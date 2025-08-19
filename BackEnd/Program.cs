using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using BackEnd.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using BackEnd.BL;

public class Program
{
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            });
}

public class Startup
{
    private readonly IConfiguration _configuration;

    public Startup(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(_configuration.GetConnectionString("BrokerContext")));

        // Register BL services
        services.AddScoped<Register>();
        services.AddScoped<Login>();

        services.AddCors(options =>
        {
            options.AddPolicy("AllowSpecificOrigin",
                builder =>
                {
                    builder.WithOrigins("http://localhost:4200") // Strictly allow only this origin
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                });
        });

        services.AddControllers();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Your API", Version = "v1" });
        });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        // Strict CORS enforcement middleware
        app.Use(async (context, next) =>
        {
            var origin = context.Request.Headers["Origin"].ToString();
            if (!string.IsNullOrEmpty(origin) && origin != "http://localhost:4200")
            {
                context.Response.StatusCode = 403;
                await context.Response.WriteAsync("CORS policy does not allow this origin.");
                return;
            }
            await next();
        });

        app.UseRouting();

        app.UseCors("AllowSpecificOrigin"); // Apply the CORS policy

        app.UseAuthorization();
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Your API v1"));

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            endpoints.MapGet("/", context => {
                context.Response.Redirect("/swagger");
                return Task.CompletedTask;
            });
        });
    }
}
