using AutoMapper;
using ImproveMyCity.Application.DTOs;
using ImproveMyCity.Application.Interfaces;
using ImproveMyCity.Domain.Entities;
using ImproveMyCity.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OtpNet;

namespace ImproveMyCity.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _dbContext;
        private readonly IJwtService _jwtService;
        private readonly IEmailService _emailService;
        private readonly IMapper _mapper;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext dbContext,
            IJwtService jwtService,
            IEmailService emailService,
            IMapper mapper,
            ILogger<AuthService> logger)
        {
            _userManager = userManager;
            _dbContext = dbContext;
            _jwtService = jwtService;
            _emailService = emailService;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<LoginResponseDTO> RegisterAsync(RegisterRequestDTO dto)
        {
            var userExists = await _userManager.FindByEmailAsync(dto.Email);
            if (userExists != null)
            {
                return new LoginResponseDTO { Success = false, Message = "User with this email already exists." };
            }

            var user = new ApplicationUser
            {
                Email = dto.Email,
                UserName = dto.Email,
                FullName = dto.FullName,
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                _logger.LogError("User registration failed for {Email}: {Errors}", dto.Email, string.Join(", ", result.Errors.Select(e => e.Description)));
                return new LoginResponseDTO { Success = false, Message = $"User creation failed: {string.Join(", ", result.Errors.Select(e => e.Description))}" };
            }

            // Assign default "User" role
            await _userManager.AddToRoleAsync(user, "User");

            var userDto = _mapper.Map<UserDTO>(user);
            userDto.Roles.Add("User");

            return new LoginResponseDTO { Success = true, Message = "User registered successfully.", User = userDto };
        }

        public async Task<LoginResponseDTO> LoginAsync(LoginRequestDTO dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                return new LoginResponseDTO { Success = false, Message = "Invalid credentials." };
            }

            if (!user.IsActive)
            {
                return new LoginResponseDTO { Success = false, Message = "Account is deactivated." };
            }

            var passwordCheck = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!passwordCheck)
            {
                return new LoginResponseDTO { Success = false, Message = "Invalid credentials." };
            }

            // Update last login
            user.LastLoginDate = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);

            // If MFA is enabled
            if (user.TwoFactorEnabled || !string.IsNullOrEmpty(user.MFASecretKey))
            {
                await SendEmailMfaOtpAsync(user.Email);

                var userDto = _mapper.Map<UserDTO>(user);
                userDto.Roles = (await _userManager.GetRolesAsync(user)).ToList();

                return new LoginResponseDTO
                {
                    Success = true,
                    Message = "MFA required. Please verify with your OTP.",
                    RequiresMFA = true,
                    User = userDto
                };
            }

            // If no MFA is enabled, issue JWT directly
            var roles = await _userManager.GetRolesAsync(user);
            var token = await _jwtService.GenerateJwtTokenAsync(user, roles);

            var userDtoLoggedIn = _mapper.Map<UserDTO>(user);
            userDtoLoggedIn.Roles = roles.ToList();

            return new LoginResponseDTO
            {
                Success = true,
                Message = "Login successful.",
                Token = token,
                User = userDtoLoggedIn
            };
        }

        public async Task<bool> SendEmailMfaOtpAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return false;

            // Generate a 6-digit OTP
            var otpCode = new Random().Next(100000, 999999).ToString();

            // Save OTP to database
            var otpRequest = new OTPRequest
            {
                UserId = user.Id,
                OTPCode = otpCode,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddMinutes(2),
                Purpose = "LoginMFA"
            };

            await _dbContext.OTPRequests.AddAsync(otpRequest);
            await _dbContext.SaveChangesAsync();

            // Send OTP via email
            var emailBody = $@"
                <h3>Improve My City OTP</h3>
                <p>Your One-Time Password is: <strong>{otpCode}</strong></p>
                <p>This OTP will expire in 2 minutes.</p>
                <p><em>If you didn't request this, please ignore this email.</em></p>";

            await _emailService.SendEmailAsync(user.Email, "Your OTP Code for Login", emailBody);
            _logger.LogInformation("Email OTP sent to {Email} for MFA.", email);
            return true;
        }

        public async Task<LoginResponseDTO> VerifyEmailMfaOtpAsync(MfaVerifyRequestDTO dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                return new LoginResponseDTO { Success = false, Message = "User not found." };
            }

            var otpRequest = await _dbContext.OTPRequests
                .Where(o => o.UserId == user.Id &&
                           o.OTPCode == dto.OTPCode &&
                           !o.IsUsed &&
                           o.ExpiresAt > DateTime.UtcNow &&
                           o.Purpose == "LoginMFA")
                .OrderByDescending(o => o.CreatedAt)
                .FirstOrDefaultAsync();

            if (otpRequest == null)
            {
                return new LoginResponseDTO { Success = false, Message = "Invalid or expired OTP." };
            }

            // Mark OTP as used
            otpRequest.IsUsed = true;
            otpRequest.Attempts += 1;
            await _dbContext.SaveChangesAsync();

            // OTP verified, issue JWT
            var roles = await _userManager.GetRolesAsync(user);
            var token = await _jwtService.GenerateJwtTokenAsync(user, roles);

            var userDto = _mapper.Map<UserDTO>(user);
            userDto.Roles = roles.ToList();

            return new LoginResponseDTO
            {
                Success = true,
                Message = "MFA verification successful. Login granted.",
                Token = token,
                User = userDto
            };
        }

        public async Task<SetupTotpResponseDTO> SetupTotpMfaAsync(int userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                _logger.LogWarning("Attempt to setup TOTP for non-existent user {UserId}", userId);
                return null;
            }

            // Generate a new secret key for TOTP
            var key = KeyGeneration.GenerateRandomKey(20);
            user.MFASecretKey = Base32Encoding.ToString(key);

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                _logger.LogError("Failed to save MFA secret for user {UserId}: {Errors}", userId, string.Join(", ", result.Errors.Select(e => e.Description)));
                return null;
            }

            // Generate the otpauth URI for QR code
            var issuer = "ImproveMyCity";
            var accountName = user.Email;
            var otpAuthUri = $"otpauth://totp/{issuer}:{accountName}?secret={user.MFASecretKey}&issuer={issuer}";

            return new SetupTotpResponseDTO { SecretKey = user.MFASecretKey, OtpAuthUri = otpAuthUri };
        }

        public async Task<LoginResponseDTO> VerifyAndEnableTotpMfaAsync(int userId, string totpCode)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                return new LoginResponseDTO { Success = false, Message = "User not found." };
            }

            if (string.IsNullOrEmpty(user.MFASecretKey))
            {
                return new LoginResponseDTO { Success = false, Message = "MFA setup not initiated for this user." };
            }

            var secretBytes = Base32Encoding.ToBytes(user.MFASecretKey);
            var totp = new Totp(secretBytes);

            bool isValid = totp.VerifyTotp(totpCode, out _, VerificationWindow.RfcSpecifiedNetworkDelay);

            if (!isValid)
            {
                _logger.LogWarning("Invalid TOTP code provided by user {UserId}", userId);
                return new LoginResponseDTO { Success = false, Message = "Invalid TOTP code. Please try again." };
            }

            // TOTP verified, enable TwoFactorEnabled
            user.TwoFactorEnabled = true;
            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                _logger.LogError("Failed to enable TwoFactorEnabled for user {UserId}: {Errors}", userId, string.Join(", ", updateResult.Errors.Select(e => e.Description)));
                return new LoginResponseDTO { Success = false, Message = $"Failed to enable MFA: {string.Join(", ", updateResult.Errors.Select(e => e.Description))}" };
            }

            var roles = await _userManager.GetRolesAsync(user);
            var token = await _jwtService.GenerateJwtTokenAsync(user, roles);

            var userDto = _mapper.Map<UserDTO>(user);
            userDto.Roles = roles.ToList();

            return new LoginResponseDTO
            {
                Success = true,
                Message = "TOTP MFA enabled and verified successfully!",
                Token = token,
                User = userDto
            };
        }

        public async Task<bool> DisableTotpMfaAsync(int userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return false;

            user.MFASecretKey = null;
            user.TwoFactorEnabled = false;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                _logger.LogError("Failed to disable TOTP for user {UserId}: {Errors}", userId, string.Join(", ", result.Errors.Select(e => e.Description)));
                return false;
            }
            _logger.LogInformation("TOTP MFA disabled for user {UserId}.", userId);
            return true;
        }

        public async Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return false;

            var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
            return result.Succeeded;
        }

        public async Task<UserDTO> GetUserProfileAsync(int userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return null;

            var userDto = _mapper.Map<UserDTO>(user);
            userDto.Roles = (await _userManager.GetRolesAsync(user)).ToList();
            return userDto;
        }
    }
}
