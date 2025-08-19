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

        public async Task<User> RegisterUserAsync(RegisterDto dto)
        {
            if (dto == null)
            {
                throw new ArgumentNullException(nameof(dto), "User registration data is null.");
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

            return user;
        }
    }
}
