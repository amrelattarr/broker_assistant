using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class TestController : ControllerBase
{

    // GET api/test/hello/{name}
    [HttpGet("hello/{name}")]
    public IActionResult hello(string name)
    {
        return Ok($"hello {name}");
    }
}


