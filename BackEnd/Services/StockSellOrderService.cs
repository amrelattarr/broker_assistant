using BackEnd.Data;
using BackEnd.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BackEnd.Services
{
    public class StockSellOrderService : BackgroundService
    {
        private readonly ILogger<StockSellOrderService> _logger;
        private readonly IServiceProvider _serviceProvider;
        private readonly TimeSpan _checkInterval = TimeSpan.FromSeconds(30); // Check every 30 seconds

        public StockSellOrderService(ILogger<StockSellOrderService> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("StockSellOrderService is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                        
                        // Get all active sell orders
                        var activeSellOrders = await dbContext.BuySellInvests
                            .Where(b => b.IsSellOrderActive && b.TargetSellPrice.HasValue)
                            .Include(b => b.Stock)
                            .Include(b => b.User)
                            .ToListAsync(stoppingToken);

                        foreach (var order in activeSellOrders)
                        {
                            if (order.Stock != null && order.User != null)
                            {
                                // Check if current stock price has reached or exceeded target price
                                if (order.Stock.Value >= order.TargetSellPrice.Value)
                                {
                                    // Check if targetSellPrice equals buyPrice
                                    if (order.TargetSellPrice == order.buyPrice)
                                    {
                                        // Remove the row if targetSellPrice equals buyPrice
                                        dbContext.BuySellInvests.Remove(order);
                                        _logger.LogInformation("Removed order for user {UserId}, stock {StockId} as target price equals buy price",
                                            order.UserId, order.StockId);
                                    }
                                    else
                                    {
                                        // Execute the sell order
                                        order.sellPrice = (int)Math.Round(order.Stock.Value, MidpointRounding.AwayFromZero);
                                        order.changeAmount = order.sellPrice - order.buyPrice;
                                        order.IsSellOrderActive = false;
                                        order.TargetSellPrice = null;

                                        // Update user balance
                                        order.User.Balance = (int?)((order.User.Balance ?? 0) + order.sellPrice);

                                        _logger.LogInformation("Executed sell order for user {UserId}, stock {StockId} at price {SellPrice}",
                                            order.UserId, order.StockId, order.sellPrice);
                                    }
                                }
                            }
                        }

                        await dbContext.SaveChangesAsync(stoppingToken);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing sell orders");
                }

                // Wait for the next check
                await Task.Delay(_checkInterval, stoppingToken);
            }

            _logger.LogInformation("StockSellOrderService is stopping.");
        }
    }
}
