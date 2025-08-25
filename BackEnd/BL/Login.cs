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
        private readonly ITokenService _tokenService;

        public Login(AppDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        public async Task<LoginResult> LoginUserAsync(LoginDto dto)
        {
            if (dto == null)
            {
                return new LoginResult { Success = false, ErrorMessage = "Login data is null." };
            }

            var identifier = dto.email?.Trim();
            if (string.IsNullOrWhiteSpace(identifier) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return new LoginResult { Success = false, ErrorMessage = "Invalid username or password." };
            }

            var identifierLower = identifier.ToLower();
            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.Username == identifier || (u.Email != null && u.Email.ToLower() == identifierLower));
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

            var token = _tokenService.GenerateToken(user);

            return new LoginResult 
            { 
                Success = true, 
                User = user,
                Message = "Login successful",
                Token = token
            };
        }
    }

    public class LoginResult
    {
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }
        public string? Message { get; set; }
        public User? User { get; set; }
        public string? Token { get; set; }
    }
}
