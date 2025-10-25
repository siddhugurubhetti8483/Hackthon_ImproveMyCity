using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ImproveMyCity.Application.DTOs;
using ImproveMyCity.Application.Interfaces;

namespace ImproveMyCity.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Officer")]
    public class AuditController : ControllerBase
    {
        private readonly IAuditService _auditService;
        private readonly ILogger<AuditController> _logger;

        public AuditController(IAuditService auditService, ILogger<AuditController> logger)
        {
            _auditService = auditService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAuditLogs(
            [FromQuery] int? userId = null,
            [FromQuery] string actionType = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var auditLogs = await _auditService.GetAuditLogsAsync(userId, actionType, fromDate, toDate);
                return Ok(new { Success = true, Data = auditLogs });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting audit logs");
                return StatusCode(500, new { Success = false, Message = "Internal server error getting audit logs." });
            }
        }
    }
}