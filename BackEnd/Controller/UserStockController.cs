using BackEnd.Data;
using BackEnd.DTOs;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Controllers
{
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

        // POST: api/UserStock/buy
        [HttpPost("buy")]
        public async Task<IActionResult> Buy([FromBody] BuyStockDto dto)
        {
            if (dto == null) return BadRequest("Invalid payload");

            // Ensure user and stock exist (optional simple checks)
            var userExists = await _context.Users.AnyAsync(u => u.Id == dto.UserId);
            var stockExists = await _context.Stocks.AnyAsync(s => s.StockId == dto.StockId);
            if (!userExists || !stockExists) return NotFound("User or Stock not found");

            var entity = await _context.BuySellInvests.FindAsync(dto.UserId, dto.StockId);
            if (entity == null)
            {
                entity = new Buy_Sell_Invest
                {
                    UserId = dto.UserId,
                    StockId = dto.StockId,
                    buyPrice = dto.BuyPrice,
                    sellPrice = 0,
                    changeAmount = 0
                };
                _context.BuySellInvests.Add(entity);
            }
            else
            {
                entity.buyPrice = dto.BuyPrice;
                // Reset sell and change when buying again
                entity.sellPrice = 0;
                entity.changeAmount = 0;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Bought successfully", userId = dto.UserId, stockId = dto.StockId, buyPrice = dto.BuyPrice });
        }

        // POST: api/UserStock/sell
        [HttpPost("sell")]
        public async Task<IActionResult> Sell([FromBody] SellStockDto dto)
        {
            if (dto == null) return BadRequest("Invalid payload");

            var entity = await _context.BuySellInvests.FindAsync(dto.UserId, dto.StockId);
            if (entity == null)
            {
                return NotFound("No existing position to sell");
            }

            entity.sellPrice = dto.SellPrice;
            entity.changeAmount = dto.SellPrice - entity.buyPrice;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Sold successfully", userId = dto.UserId, stockId = dto.StockId, sellPrice = dto.SellPrice, changeAmount = entity.changeAmount });
        }
    }
}


