using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ImproveMyCity.Application.DTOs;
using ImproveMyCity.Application.Interfaces;

namespace ImproveMyCity.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService;
        private readonly ILogger<AnalyticsController> _logger;

        public AnalyticsController(IAnalyticsService analyticsService, ILogger<AnalyticsController> logger)
        {
            _analyticsService = analyticsService;
            _logger = logger;
        }

        [HttpGet("summary")]
        [Authorize(Roles = "Admin,Officer")]
        public async Task<IActionResult> GetComplaintSummary()
        {
            try
            {
                var summary = await _analyticsService.GetComplaintSummaryAsync();
                return Ok(new { Success = true, Data = summary });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting complaint summary");
                return StatusCode(500, new { Success = false, Message = "Internal server error getting complaint summary." });
            }
        }

        [HttpGet("dashboard")]
        [Authorize(Roles = "Admin,Officer")]
        public async Task<IActionResult> GetAnalyticsDashboard()
        {
            try
            {
                var analytics = await _analyticsService.GetAnalyticsAsync();
                return Ok(new { Success = true, Data = analytics });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting analytics dashboard");
                return StatusCode(500, new { Success = false, Message = "Internal server error getting analytics dashboard." });
            }
        }

        [HttpGet("category-stats")]
        [Authorize(Roles = "Admin,Officer")]
        public async Task<IActionResult> GetCategoryStats()
        {
            try
            {
                var categoryStats = await _analyticsService.GetCategoryStatsAsync();
                return Ok(new { Success = true, Data = categoryStats });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting category stats");
                return StatusCode(500, new { Success = false, Message = "Internal server error getting category stats." });
            }
        }

        [HttpGet("monthly-stats")]
        [Authorize(Roles = "Admin,Officer")]
        public async Task<IActionResult> GetMonthlyStats([FromQuery] int months = 12)
        {
            try
            {
                var monthlyStats = await _analyticsService.GetMonthlyStatsAsync(months);
                return Ok(new { Success = true, Data = monthlyStats });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting monthly stats");
                return StatusCode(500, new { Success = false, Message = "Internal server error getting monthly stats." });
            }
        }
    }
}