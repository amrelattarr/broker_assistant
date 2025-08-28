using System.Security.Claims;
using BackEnd.Data;
using BackEnd.DTOs;
using BackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserStockController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserStockController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/UserStock/{userId}
        [HttpGet("{userId:int}")]
        public async Task<IActionResult> GetUserPositions(int userId)
        {
            var positions = await _context.BuySellInvests
                .AsNoTracking()
                .Where(p => p.UserId == userId)
                .Include(p => p.Stock)
                .Select(p => new UserStockPositionDto
                {
                    UserId = p.UserId,
                    StockId = p.StockId,
                    EnglishName = p.Stock != null ? p.Stock.EnglishName : null,
                    Symbol = p.Stock != null ? p.Stock.Symbol : null,
                    CurrentValue = p.Stock != null ? p.Stock.Value : 0,
                    BuyPrice = p.buyPrice,
                    SellPrice = p.sellPrice,
                    ChangeAmount = p.changeAmount
                })
                .ToListAsync();

            return Ok(positions);
        }

        private int GetUserIdFromToken()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                throw new UnauthorizedAccessException("Invalid user ID in token");
            }
            return userId;
        }

        // POST: api/UserStock/buy
        [HttpPost("buy")]
        public async Task<IActionResult> Buy([FromBody] BuyStockDto dto)
        {
            if (dto == null) return BadRequest("Invalid payload");

            int userId = GetUserIdFromToken();

            // Get user and stock with tracking
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            var stock = await _context.Stocks.FirstOrDefaultAsync(s => s.StockId == dto.StockId);
            
            if (user == null || stock == null) 
                return NotFound("User or Stock not found");

            // Get the current stock value
            var stockValue = stock.Value;

            // Convert stock value to int (rounding to nearest integer for currency)
            int stockValueInt = (int)Math.Round(stockValue, MidpointRounding.AwayFromZero);
            
            // Balance check
            if ((user.Balance ?? 0) < stockValueInt)
            {
                return BadRequest("Insufficient balance");
            }

            var entity = await _context.BuySellInvests.FindAsync(userId, dto.StockId);
            if (entity == null)
            {
                entity = new Buy_Sell_Invest
                {
                    UserId = userId,
                    StockId = dto.StockId,
                    buyPrice = stockValueInt,  // Use the rounded integer value
                    sellPrice = 0,
                    changeAmount = 0
                };
                _context.BuySellInvests.Add(entity);
            }
            else
            {
                entity.buyPrice = stockValue;  // Update to current stock value
                // Reset sell and change when buying again
                entity.sellPrice = 0;
                entity.changeAmount = 0;
            }

            // Deduct the stock's current value from user's balance (converted to int)
            user.Balance = (user.Balance ?? 0) - stockValueInt;

            await _context.SaveChangesAsync();
            return Ok(new { 
                message = "Bought successfully", 
                userId = userId, 
                stockId = dto.StockId, 
                buyPrice = stockValueInt,
                remainingBalance = user.Balance
            });
        }

        // POST: api/UserStock/sell
        [HttpPost("sell")]
        public async Task<IActionResult> Sell([FromBody] SellStockDto dto)
        {
            if (dto == null) return BadRequest("Invalid payload");

            int userId = GetUserIdFromToken();

            var entity = await _context.BuySellInvests.FindAsync(userId, dto.StockId);
            if (entity == null)
            {
                return NotFound("No existing position to sell");
            }

            // Set the target sell price and activate the sell order
            entity.TargetSellPrice = dto.TargetSellPrice;
            entity.IsSellOrderActive = true;
            
            // Reset the actual sell price since we haven't sold yet
            entity.sellPrice = 0;
            entity.changeAmount = 0;

            await _context.SaveChangesAsync();
            
            return Ok(new { 
                message = "Sell order created successfully. The stock will be sold automatically when the price reaches " + dto.TargetSellPrice,
                userId = userId, 
                stockId = dto.StockId,
                targetSellPrice = dto.TargetSellPrice,
                isSellOrderActive = true
            });
        }
    }
}


