using BackEnd.Data;
using BackEnd.Models;
using BackEnd.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace BackEnd.BL
{
    public class Login
    {
        private readonly AppDbContext _context;

        public Login(AppDbContext context)
        {
            _context = context;
        }

        public async Task<LoginResult> LoginUserAsync(LoginDto dto)
        {
            if (dto == null)
            {
                return new LoginResult { Success = false, ErrorMessage = "Login data is null." };
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);
            if (user == null)
            {
                return new LoginResult { Success = false, ErrorMessage = "Invalid username or password." };
            }

            var hasher = new PasswordHasher<User>();
            var result = hasher.VerifyHashedPassword(user, user.Password, dto.Password);
            if (result == PasswordVerificationResult.Failed)
            {
                return new LoginResult { Success = false, ErrorMessage = "Invalid username or password." };
            }

            return new LoginResult 
            { 
                Success = true, 
                User = user,
                Message = "Login successful"
            };
        }
    }

    public class LoginResult
    {
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }
        public string? Message { get; set; }
        public User? User { get; set; }
    }
}
