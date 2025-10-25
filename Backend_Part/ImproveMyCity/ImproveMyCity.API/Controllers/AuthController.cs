using System.Security.Claims;
using ImproveMyCity.Application.DTOs;
using ImproveMyCity.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ImproveMyCity.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO dto)
        {
            try
            {
                var result = await _authService.RegisterAsync(dto);
                if (result.Success)
                {
                    _logger.LogInformation("New user registered: {Email}", dto.Email);
                    return Ok(result);
                }
                return BadRequest(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration for {Email}", dto.Email);
                return StatusCode(500, new { Success = false, Message = "Internal server error during registration." });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO dto)
        {
            try
            {
                var result = await _authService.LoginAsync(dto);
                if (result.Success)
                {
                    if (result.RequiresMFA)
                    {
                        _logger.LogInformation("MFA required for user: {Email}", dto.Email);
                        return Ok(result);
                    }
                    _logger.LogInformation("User logged in successfully: {Email}", dto.Email);
                    return Ok(result);
                }
                return Unauthorized(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for {Email}", dto.Email);
                return StatusCode(500, new { Success = false, Message = "Internal server error during login." });
            }
        }

        [HttpPost("verify-email-otp")]
        public async Task<IActionResult> VerifyEmailOtp([FromBody] MfaVerifyRequestDTO dto)
        {
            try
            {
                var result = await _authService.VerifyEmailMfaOtpAsync(dto);
                if (result.Success)
                {
                    _logger.LogInformation("Email OTP verified successfully for: {Email}", dto.Email);
                    return Ok(result);
                }
                return Unauthorized(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during email OTP verification for {Email}", dto.Email);
                return StatusCode(500, new { Success = false, Message = "Internal server error during OTP verification." });
            }
        }

        [Authorize]
        [HttpPost("setup-totp")]
        public async Task<IActionResult> SetupTotp()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var result = await _authService.SetupTotpMfaAsync(userId);
                if (result != null)
                {
                    _logger.LogInformation("TOTP setup initiated for user: {UserId}", userId);
                    return Ok(new { Success = true, Data = result });
                }
                return BadRequest(new { Success = false, Message = "Failed to setup TOTP." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during TOTP setup for user");
                return StatusCode(500, new { Success = false, Message = "Internal server error during TOTP setup." });
            }
        }

        [Authorize]
        [HttpPost("verify-enable-totp")]
        public async Task<IActionResult> VerifyAndEnableTotp([FromBody] MfaVerifyRequestDTO dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var result = await _authService.VerifyAndEnableTotpMfaAsync(userId, dto.OTPCode);
                if (result.Success)
                {
                    _logger.LogInformation("TOTP enabled successfully for user: {UserId}", userId);
                    return Ok(result);
                }
                return BadRequest(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during TOTP verification for user");
                return StatusCode(500, new { Success = false, Message = "Internal server error during TOTP verification." });
            }
        }

        [Authorize]
        [HttpPost("disable-totp")]
        public async Task<IActionResult> DisableTotp()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var result = await _authService.DisableTotpMfaAsync(userId);
                if (result)
                {
                    _logger.LogInformation("TOTP disabled for user: {UserId}", userId);
                    return Ok(new { Success = true, Message = "TOTP MFA disabled successfully." });
                }
                return BadRequest(new { Success = false, Message = "Failed to disable TOTP." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error disabling TOTP for user");
                return StatusCode(500, new { Success = false, Message = "Internal server error disabling TOTP." });
            }
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var result = await _authService.ChangePasswordAsync(userId, dto.CurrentPassword, dto.NewPassword);
                if (result)
                {
                    _logger.LogInformation("Password changed successfully for user: {UserId}", userId);
                    return Ok(new { Success = true, Message = "Password changed successfully." });
                }
                return BadRequest(new { Success = false, Message = "Failed to change password. Please check your current password." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password for user");
                return StatusCode(500, new { Success = false, Message = "Internal server error changing password." });
            }
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var userProfile = await _authService.GetUserProfileAsync(userId);
                if (userProfile != null)
                {
                    return Ok(new { Success = true, Data = userProfile });
                }
                return NotFound(new { Success = false, Message = "User profile not found." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user profile");
                return StatusCode(500, new { Success = false, Message = "Internal server error getting profile." });
            }
        }

        [Authorize]
        [HttpGet("test-auth")]
        public IActionResult TestAuth()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var userName = User.FindFirst("fullname")?.Value;
            var roles = User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();

            return Ok(new
            {
                Message = "Authentication successful!",
                UserId = userId,
                Email = userEmail,
                Name = userName,
                Roles = roles,
                IsAuthenticated = User.Identity.IsAuthenticated
            });
        }
    }
}