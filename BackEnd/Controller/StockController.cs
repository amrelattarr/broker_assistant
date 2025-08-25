using BackEnd.Data;
using BackEnd.DTOs;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StockController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StockController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /api/stock
        [HttpGet]
        public async Task<IActionResult> GetStocks()
        {
            var stocks = await _context.Stocks.ToListAsync();
            return Ok(stocks);
        }

        // GET: /api/stock/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetStock(int id)
        {
            var stock = await _context.Stocks.FindAsync(id);
            if (stock == null) return NotFound();
            return Ok(stock);
        }

        // POST: /api/stock
        [HttpPost]
        public async Task<IActionResult> CreateStock([FromBody] StockCreateDto stockDto)
        {
            if (stockDto == null) return BadRequest("Stock data cannot be null");

            var stock = new Stock
            {
                EnglishName = stockDto.EnglishName,
                Value = stockDto.Value,
                Symbol = stockDto.Symbol,
                Open = stockDto.Open,
                Close = stockDto.Close,
                Change = stockDto.Change
            };

            _context.Stocks.Add(stock);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStock), new { id = stock.StockId }, stock);
        }

        // PUT: /api/stock/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateStock(int id, [FromBody] StockCreateDto stockDto)
        {
            var stock = await _context.Stocks.FindAsync(id);
            if (stock == null) return NotFound();

            stock.EnglishName = stockDto.EnglishName;
            stock.Value = stockDto.Value;
            stock.Symbol = stockDto.Symbol;
            stock.Open = stockDto.Open;
            stock.Close = stockDto.Close;
            stock.Change = stockDto.Change;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Updated successfully", id });
        }

        // DELETE: /api/stock/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteStock(int id)
        {
            var stock = await _context.Stocks.FindAsync(id);
            if (stock == null) return NotFound();

            _context.Stocks.Remove(stock);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Deleted successfully", id });
        }
    }
}


