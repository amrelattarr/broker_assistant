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
        var result = await _registerService.RegisterUserAsync(dto);
        if (!result.Success)
            throw new ArgumentNullException(result.ErrorMessage);
        return CreatedAtAction(nameof(Register), new { id = result.User.Id }, result.User);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var result = await _loginService.LoginUserAsync(dto);
        if (!result.Success)
            throw new UnauthorizedAccessException(result.ErrorMessage); 
        return Ok(result);
    }

}
