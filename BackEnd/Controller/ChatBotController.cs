using BackEnd.Data;
using BackEnd.DTOs;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
 

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatBotController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChatBotController(AppDbContext context)
        {
            _context = context;
        }

        /// GET /api/ChatBot/ask?message=hello
        [HttpGet("ask")]
        public async Task<IActionResult> Ask([FromQuery] string message)
        {
            if (string.IsNullOrWhiteSpace(message))
                return BadRequest("Message cannot be empty.");

            // Placeholder reply to avoid external dependencies
            var reply = $"You said: {message}";

            return Ok(new { question = message, answer = reply });
        }

        /// POST /api/ChatBot
        /// Body: { "msgText": "hi" }
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

        /// GET /api/ChatBot/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var msg = await _context.Chatbots.AsNoTracking().FirstOrDefaultAsync(m => m.MsgId == id);
            if (msg == null) return NotFound();
            return Ok(msg);
        }

        /// DELETE /api/ChatBot/5
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


