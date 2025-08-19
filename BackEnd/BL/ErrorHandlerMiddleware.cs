using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace BackEnd.BL
{
    public class ErrorHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlerMiddleware> _logger;

        public ErrorHandlerMiddleware(RequestDelegate next, ILogger<ErrorHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                _logger.LogInformation("ErrorHandlerMiddleware: Processing request");
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ErrorHandlerMiddleware: Exception caught");
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            _logger.LogError(exception, "HandleExceptionAsync: Handling exception of type {ExceptionType}", exception.GetType().Name);
            
            // Check if response has already started
            if (context.Response.HasStarted)
            {
                _logger.LogWarning("Cannot modify response, it has already started");
                return;
            }

            context.Response.Clear();
            context.Response.ContentType = "application/json";

            switch (exception)
            {
                case ArgumentNullException ex:
                    _logger.LogError(ex, "Bad Request");
                    context.Response.StatusCode = 400;
                    await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(new { error = "Invalid input data." }));
                    break;

                case UnauthorizedAccessException ex:
                    _logger.LogError(ex, "Unauthorized");
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(new { error = ex.Message }));
                    break;

                default:
                    _logger.LogError(exception, "Internal Server Error");
                    context.Response.StatusCode = 500;
                    await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(new { error = "An unexpected error occurred." }));
                    break;
            }
            
            _logger.LogInformation("HandleExceptionAsync: Response sent with status code {StatusCode}", context.Response.StatusCode);
        }
    }

}
