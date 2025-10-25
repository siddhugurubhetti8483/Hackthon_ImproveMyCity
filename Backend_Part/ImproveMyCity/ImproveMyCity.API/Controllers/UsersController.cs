using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ImproveMyCity.Application.DTOs;
using ImproveMyCity.Domain.Entities;
using ImproveMyCity.Infrastructure.Data;

namespace ImproveMyCity.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _dbContext;
        private readonly ILogger<UsersController> _logger;

        public UsersController(
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext dbContext,
            ILogger<UsersController> logger)
        {
            _userManager = userManager;
            _dbContext = dbContext;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var users = await _userManager.Users
                    .Where(u => u.IsActive)
                    .Select(u => new UserListDTO
                    {
                        UserId = u.Id,
                        FullName = u.FullName,
                        Email = u.Email,
                        IsActive = u.IsActive,
                        CreatedAt = u.CreatedAt,
                        LastLoginDate = u.LastLoginDate,
                        Roles = _dbContext.UserRoles
                            .Where(ur => ur.UserId == u.Id)
                            .Join(_dbContext.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => r.Name)
                            .ToList()
                    })
                    .ToListAsync();

                return Ok(new { Success = true, Data = users });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting users");
                return StatusCode(500, new { Success = false, Message = "Internal server error getting users." });
            }
        }

        [HttpGet("Admin,Officer")]
        public async Task<IActionResult> GetOfficers()
        {
            try
            {
                var officers = await _userManager.GetUsersInRoleAsync("Officer");
                var officerDTOs = officers.Where(o => o.IsActive).Select(o => new UserDTO
                {
                    UserId = o.Id,
                    FullName = o.FullName,
                    Email = o.Email,
                    IsMFAEnabled = !string.IsNullOrEmpty(o.MFASecretKey),
                    CreatedAt = o.CreatedAt,
                    Roles = new List<string> { "Officer" }
                }).ToList();

                return Ok(new { Success = true, Data = officerDTOs });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting officers");
                return StatusCode(500, new { Success = false, Message = "Internal server error getting officers." });
            }
        }

        [HttpPut("{id}/activate")]
        [Authorize(Roles = "Admin,Officer")]
        public async Task<IActionResult> ActivateUser(int id)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(id.ToString());
                if (user == null)
                {
                    return NotFound(new { Success = false, Message = "User not found." });
                }

                user.IsActive = true;
                user.UpdatedAt = DateTime.UtcNow;

                var result = await _userManager.UpdateAsync(user);
                if (result.Succeeded)
                {
                    _logger.LogInformation("User activated: {UserId}", id);
                    return Ok(new { Success = true, Message = "User activated successfully." });
                }

                return BadRequest(new { Success = false, Message = "Failed to activate user." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error activating user {UserId}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error activating user." });
            }
        }

        [HttpPut("{id}/deactivate")]
        [Authorize(Roles = "Admin,Officer")]

        public async Task<IActionResult> DeactivateUser(int id)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(id.ToString());
                if (user == null)
                {
                    return NotFound(new { Success = false, Message = "User not found." });
                }

                // Prevent deactivating own account
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                if (id == currentUserId)
                {
                    return BadRequest(new { Success = false, Message = "Cannot deactivate your own account." });
                }

                user.IsActive = false;
                user.UpdatedAt = DateTime.UtcNow;

                var result = await _userManager.UpdateAsync(user);
                if (result.Succeeded)
                {
                    _logger.LogInformation("User deactivated: {UserId}", id);
                    return Ok(new { Success = true, Message = "User deactivated successfully." });
                }

                return BadRequest(new { Success = false, Message = "Failed to deactivate user." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deactivating user {UserId}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error deactivating user." });
            }
        }

        [HttpPost("{id}/roles")]
        public async Task<IActionResult> AssignRole(int id, [FromBody] AssignRoleDTO dto)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(id.ToString());
                if (user == null)
                {
                    return NotFound(new { Success = false, Message = "User not found." });
                }

                // Get current roles
                var currentRoles = await _userManager.GetRolesAsync(user);

                // Remove existing roles
                var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
                if (!removeResult.Succeeded)
                {
                    return BadRequest(new { Success = false, Message = "Failed to remove existing roles." });
                }

                // Add new role
                var addResult = await _userManager.AddToRoleAsync(user, dto.RoleName);
                if (addResult.Succeeded)
                {
                    _logger.LogInformation("Role {RoleName} assigned to user {UserId}", dto.RoleName, id);
                    return Ok(new { Success = true, Message = $"Role {dto.RoleName} assigned successfully." });
                }

                return BadRequest(new { Success = false, Message = "Failed to assign role." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning role to user {UserId}", id);
                return StatusCode(500, new { Success = false, Message = "Internal server error assigning role." });
            }
        }
    }
}