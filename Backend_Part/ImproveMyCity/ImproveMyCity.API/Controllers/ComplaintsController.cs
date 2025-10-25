using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using ImproveMyCity.Application.DTOs;
using ImproveMyCity.Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace ImproveMyCity.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ComplaintsController : ControllerBase
    {
        private readonly IComplaintService _complaintService;
        private readonly ILogger<ComplaintsController> _logger;

        public ComplaintsController(IComplaintService complaintService, ILogger<ComplaintsController> logger)
        {
            _complaintService = complaintService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> CreateComplaint([FromBody] CreateComplaintDTO dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var result = await _complaintService.CreateComplaintAsync(dto, userId);

                if (result != null)
                {
                    _logger.LogInformation("Complaint created successfully by user {UserId}", userId);
                    return Ok(new { Success = true, Data = result });
                }

                return BadRequest(new { Success = false, Message = "Failed to create complaint." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating complaint for user");
                return StatusCode(500, new { Success = false, Message = "Internal server error creating complaint." });
            }
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Officer,User")]
        public async Task<IActionResult> GetComplaints()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var userRoles = User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();

                List<ComplaintDTO> complaints;

                if (userRoles.Contains("Admin"))
                {
                    complaints = await _complaintService.GetAllComplaintsAsync();
                    _logger.LogInformation("Admin {UserId} fetched all {Count} complaints", userId, complaints.Count);
                }
                else if (userRoles.Contains("Officer"))
                {
                    complaints = await _complaintService.GetOfficerComplaintsAsync(userId);
                    _logger.LogInformation("Officer {UserId} fetched {Count} complaints", userId, complaints.Count);
                }
                else
                {
                    complaints = await _complaintService.GetUserComplaintsAsync(userId);
                    _logger.LogInformation("User {UserId} fetched {Count} complaints", userId, complaints.Count);
                }

                return Ok(new { Success = true, Data = complaints });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting complaints for user");
                return StatusCode(500, new { Success = false, Message = "Internal server error getting complaints." });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetComplaint(int id)
        {
            try
            {
                var complaint = await _complaintService.GetComplaintByIdAsync(id);

                if (complaint == null)
                {
                    return NotFound(new { Success = false, Message = "Complaint not found." });
                }

                // Check authorization
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var userRoles = User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();

                if (!userRoles.Contains("Admin") && !userRoles.Contains("Officer") && complaint.CreatedBy.UserId != userId)
                {
                    return Forbid();
                }

                return Ok(new { Success = true, Data = complaint });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting complaint {ComplaintId}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error getting complaint." });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComplaint(int id, [FromBody] UpdateComplaintDTO dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var result = await _complaintService.UpdateComplaintAsync(id, dto, userId);

                if (result != null)
                {
                    return Ok(new { Success = true, Data = result });
                }

                return BadRequest(new { Success = false, Message = "Failed to update complaint." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating complaint {ComplaintId}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error updating complaint." });
            }
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin,Officer")]
        public async Task<IActionResult> UpdateComplaintStatus(int id, [FromBody] UpdateComplaintStatusDTO dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var result = await _complaintService.UpdateComplaintStatusAsync(id, dto, userId);

                if (result != null)
                {
                    return Ok(new { Success = true, Data = result });
                }

                return BadRequest(new { Success = false, Message = "Failed to update complaint status." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating complaint status {ComplaintId}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error updating complaint status." });
            }
        }

        [HttpPost("{id}/assign")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignComplaint(int id, [FromBody] AssignComplaintDTO dto)
        {
            try
            {
                var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var result = await _complaintService.AssignComplaintAsync(id, dto.OfficerId, adminId);

                if (result)
                {
                    return Ok(new { Success = true, Message = "Complaint assigned successfully." });
                }

                return BadRequest(new { Success = false, Message = "Failed to assign complaint." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning complaint {ComplaintId} to officer {OfficerId}", id, dto.OfficerId);
                return StatusCode(500, new { Success = false, Message = "Internal server error assigning complaint." });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComplaint(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var result = await _complaintService.DeleteComplaintAsync(id, userId);

                if (result)
                {
                    return Ok(new { Success = true, Message = "Complaint deleted successfully." });
                }

                return BadRequest(new { Success = false, Message = "Failed to delete complaint." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting complaint {ComplaintId}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error deleting complaint." });
            }
        }

        [HttpPost("{id}/comments")]
        public async Task<IActionResult> AddComment(int id, [FromBody] AddCommentDTO dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var userRoles = User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();

                var isInternal = dto.IsInternal && (userRoles.Contains("Admin") || userRoles.Contains("Officer"));

                var result = await _complaintService.AddCommentAsync(id, dto.Comment, userId, isInternal);

                if (result != null)
                {
                    return Ok(new { Success = true, Data = result });
                }

                return BadRequest(new { Success = false, Message = "Failed to add comment." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding comment to complaint {ComplaintId}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error adding comment." });
            }
        }

        [HttpGet("{id}/comments")]
        public async Task<IActionResult> GetComments(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var result = await _complaintService.GetComplaintCommentsAsync(id, userId);

                return Ok(new { Success = true, Data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting comments for complaint {ComplaintId}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error getting comments." });
            }
        }
    }
}