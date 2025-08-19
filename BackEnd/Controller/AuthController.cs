using Microsoft.AspNetCore.Mvc;
using BackEnd.Data;
using BackEnd.Models;
using System.Threading.Tasks;
using BackEnd.DTOs;
using Microsoft.EntityFrameworkCore;
using BackEnd.BL;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly Register _registerService;
    private readonly Login _loginService;

    public AuthController(AppDbContext context, Register registerService, Login loginService)
    {
        _context = context;
        _registerService = registerService;
        _loginService = loginService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(BackEnd.DTOs.RegisterDto dto)
    {
        try
        {
            var user = await _registerService.RegisterUserAsync(dto);
            return CreatedAtAction(nameof(Register), new { id = user.Id }, user);
        }
        catch (ArgumentNullException)
        {
            return BadRequest("User is null.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(BackEnd.DTOs.LoginDto dto)
    {
        try
        {
            var result = await _loginService.LoginUserAsync(dto);
            if (result.Success)
            {
                return Ok(new { message = result.Message, result.User?.Id, result.User?.Username, result.User?.Email });
            }
            return Unauthorized(result.ErrorMessage);
        }
        catch (ArgumentNullException)
        {
            return BadRequest("Login data is null.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
