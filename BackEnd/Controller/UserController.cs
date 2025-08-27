using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using BackEnd.Data;
using BackEnd.DTOs;
using BackEnd.Models;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/User/AddBalance
        [HttpPost("AddBalance")]
        [Authorize] // Requires authentication
        public async Task<IActionResult> AddBalance([FromBody] UpdateBalanceDto dto)
        {
            if (dto == null || dto.Amount <= 0)
            {
                return BadRequest("Invalid amount. Amount must be a positive number.");
            }

            // Get user ID from the JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Invalid user token");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User  not found");
            }

            // Update the user's balance
            user.Balance = (user.Balance ?? 0) + dto.Amount;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new
                {
                    message = "Balance updated successfully",
                    userId = user.Id,
                    newBalance = user.Balance
                });
            }
            catch (DbUpdateException)
            {
                return StatusCode(500, "An error occurred while updating the balance.");
            }
        }

        // GET: api/User/GetBalance
        [HttpGet("GetBalance")]
        [Authorize] // Requires authentication
        public async Task<IActionResult> GetBalance()
        {
            // Get user ID from the JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Invalid user token");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User  not found");
            }

            return Ok(new
            {
                userId = user.Id,
                balance = user.Balance
            });
        }
    }
}
