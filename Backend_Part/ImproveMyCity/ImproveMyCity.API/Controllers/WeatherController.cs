using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ImproveMyCity.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WeatherController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        [HttpGet]
        [Authorize]
        public IActionResult GetWeather()
        {
            var rng = new Random();
            var forecast = Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();

            return Ok(forecast);
        }

        [HttpGet("public")]
        [AllowAnonymous]
        public IActionResult GetPublicWeather()
        {
            return Ok(new { Message = "This is public weather data - no authentication required!" });
        }

        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAdminWeather()
        {
            return Ok(new { Message = "This is admin-only weather data!" });
        }

        [HttpGet("officer")]
        [Authorize(Roles = "Admin,Officer")]
        public IActionResult GetOfficerWeather()
        {
            return Ok(new { Message = "This is officer-only weather data!" });
        }
    }

    public class WeatherForecast
    {
        public DateTime Date { get; set; }
        public int TemperatureC { get; set; }
        public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
        public string Summary { get; set; }
    }
}