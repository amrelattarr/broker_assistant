using BackEnd.Data;
using BackEnd.Models;
using BackEnd.DTOs;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace BackEnd.BL
{
    public class Register
    {
        private readonly AppDbContext _context;

        public Register(AppDbContext context)
        {
            _context = context;
        }

        public async Task<RegisterResult> RegisterUserAsync(RegisterDto dto)
        {
            if (dto == null)
            {
                return new RegisterResult { Success = false, ErrorMessage = "User registration data is null." };
            }

            var hasher = new PasswordHasher<User>();
            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email
            };
            user.Password = hasher.HashPassword(user, dto.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new RegisterResult 
            { 
                Success = true, 
                User = user,
                Message = "Registration successful"
            };
        }
    }

    public class RegisterResult
    {
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }
        public string? Message { get; set; }
        public User? User { get; set; }
    }
}
