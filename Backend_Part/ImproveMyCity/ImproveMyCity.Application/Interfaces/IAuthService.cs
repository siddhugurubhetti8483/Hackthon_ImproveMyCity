using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ImproveMyCity.Application.DTOs;

namespace ImproveMyCity.Application.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDTO> RegisterAsync(RegisterRequestDTO dto);
        Task<LoginResponseDTO> LoginAsync(LoginRequestDTO dto);
        Task<bool> SendEmailMfaOtpAsync(string email);
        Task<LoginResponseDTO> VerifyEmailMfaOtpAsync(MfaVerifyRequestDTO dto);
        Task<SetupTotpResponseDTO> SetupTotpMfaAsync(int userId);
        Task<LoginResponseDTO> VerifyAndEnableTotpMfaAsync(int userId, string totpCode);
        Task<bool> DisableTotpMfaAsync(int userId);
        Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
        Task<UserDTO> GetUserProfileAsync(int userId);
    }
}
