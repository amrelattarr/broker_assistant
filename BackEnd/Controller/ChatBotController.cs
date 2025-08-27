using BackEnd.Data;
using BackEnd.DTOs;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Json;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatBotController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;
        private object stock;

        public ChatBotController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
            _httpClient = new HttpClient();
        }

        [HttpGet("ask")]
        public async Task<IActionResult> Ask([FromQuery] string message)
        {
            if (string.IsNullOrWhiteSpace(message))
                return BadRequest(new { error = "Message cannot be empty." });

            var apiKey = _config["OpenAI:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
                return StatusCode(500, new { error = "OpenAI API key not configured in appsettings.json" });

            string dbReference = null;
            string advice = null;

            try
            {
                // =============================
                // 1. Load all stocks into memory
                // =============================
                var stocks = await _context.Stocks.AsNoTracking().ToListAsync();
                var lowerMessage = message.ToLower();

                var stock = stocks.FirstOrDefault(s =>
                    (!string.IsNullOrEmpty(s.EnglishName) && lowerMessage.Contains(s.EnglishName.ToLower())) ||
                    (!string.IsNullOrEmpty(s.Symbol) && lowerMessage.Contains(s.Symbol.ToLower())));

                if (stock != null)
                {
                    dbReference = $"Stock Info: {stock.EnglishName} ({stock.Symbol}) " +
                                  $"Current Value: {stock.Value}, Open: {stock.Open}, Close: {stock.Close}, Change: {stock.Change}.";

                    // Advice based on change %
                    if (stock.Change > 0.5m)
                        advice = $"📈 The stock {stock.EnglishName} ({stock.Symbol}) is trending up. Consider buying.";
                    else if (stock.Change < -0.5m)
                        advice = $"📉 The stock {stock.EnglishName} ({stock.Symbol}) is falling. You may consider selling.";
                    else
                        advice = $"⏳ The stock {stock.EnglishName} ({stock.Symbol}) is stable. Holding/waiting could be wise.";
                }

                // =============================
                // 2. If EGX is mentioned, get latest index
                // =============================
                if (dbReference == null && lowerMessage.Contains("egx"))
                {
                    var latestIndex = await _context.Egx30s
                        .OrderByDescending(e => e.BorsaDate)
                        .ThenByDescending(e => e.Time)
                        .FirstOrDefaultAsync();

                    if (latestIndex != null)
                    {
                        dbReference = $"EGX30 Info: On {latestIndex.BorsaDate:yyyy-MM-dd} at {latestIndex.Time}, " +
                                      $"the index value was {latestIndex.IndexValue}.";

                        // Compare with previous record to generate advice
                        var prevIndex = await _context.Egx30s
                            .Where(e => e.BorsaDate < latestIndex.BorsaDate ||
                                        (e.BorsaDate == latestIndex.BorsaDate && e.Time != latestIndex.Time))
                            .OrderByDescending(e => e.BorsaDate)
                            .ThenByDescending(e => e.Time)
                            .FirstOrDefaultAsync();

                        if (prevIndex != null)
                        {
                            if (latestIndex.IndexValue > prevIndex.IndexValue)
                                advice = "📈 The EGX30 index is rising. Market sentiment is positive, consider buying or holding.";
                            else if (latestIndex.IndexValue < prevIndex.IndexValue)
                                advice = "📉 The EGX30 index is falling. Market sentiment is bearish, selling or reducing exposure may be wise.";
                            else
                                advice = "⏳ The EGX30 index is stable. Holding/waiting could be a good choice.";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database query failed", details = ex.Message });
            }

            // =============================
            // 3. Build OpenAI request
            // =============================
            var messages = new List<object>
            {
                new { role = "system", content = "You are a helpful assistant for Egyptian stock market queries." },
                new { role = "user", content = message }
            };

            if (dbReference != null)
            {
                messages.Insert(1, new { role = "system", content = $"Here is reference data from the Broker database: {dbReference}" });
            }
            if (advice != null)
            {
                messages.Insert(2, new { role = "system", content = $"Here is trading advice based on database data: {advice}" });
            }

            var body = new
            {
                model = "gpt-4o-mini",
                messages = messages
            };

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

            try
            {
                var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
                var httpResponse = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);

                if (!httpResponse.IsSuccessStatusCode)
                {
                    return StatusCode((int)httpResponse.StatusCode, new
                    {
                        error = "OpenAI API call failed",
                        details = await httpResponse.Content.ReadAsStringAsync()
                    });
                }

                using var responseStream = await httpResponse.Content.ReadAsStreamAsync();
                using var doc = await JsonDocument.ParseAsync(responseStream);

                string reply = "";

                try
                {
                    reply = doc.RootElement
                        .GetProperty("choices")[0]
                        .GetProperty("message")
                        .GetProperty("content")
                        .GetString();
                }
                catch
                {
                    return StatusCode(500, new { error = "Failed to parse OpenAI response", raw = doc.RootElement.ToString() });
                }

                // Create response dictionary
                var response = new Dictionary<string, object>
                {
                    ["question"] = message,
                    ["referenceUsed"] = dbReference,
                    ["adviceGiven"] = advice,
                    ["answer"] = reply
                };

                // Add stockId if we have a stock symbol in the reference
                if (!string.IsNullOrEmpty(dbReference) && dbReference.Contains("(") && dbReference.Contains(")"))
                {
                    try
                    {
                        // Extract the stock symbol from the reference (e.g., "(AIDC.CA)")
                        int start = dbReference.IndexOf('(') + 1;
                        int end = dbReference.IndexOf(')');
                        if (start > 0 && end > start)
                        {
                            string symbol = dbReference.Substring(start, end - start);
                            
                            // Get the stock from database by symbol
                            var stockFromDb = await _context.Stocks
                                .AsNoTracking()
                                .FirstOrDefaultAsync(s => s.Symbol == symbol);
                                
                            if (stockFromDb != null)
                            {
                                response["stockId"] = stockFromDb.StockId;
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        // Log the error but don't fail the request
                        Console.WriteLine($"Error getting stock ID: {ex.Message}");
                    }
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to process OpenAI response", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ChatBotCreateDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.MsgText))
                return BadRequest("Message text cannot be empty.");

            var message = new ChatBot
            {
                MsgText = dto.MsgText,
                Timestamp = DateTime.UtcNow
            };

            _context.Chatbots.Add(message);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = message.MsgId }, message);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var msg = await _context.Chatbots.AsNoTracking().FirstOrDefaultAsync(m => m.MsgId == id);
            if (msg == null) return NotFound();
            return Ok(msg);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var msg = await _context.Chatbots.FindAsync(id);
            if (msg == null) return NotFound();

            _context.Chatbots.Remove(msg);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Deleted successfully", id = id });
        }
    }
}