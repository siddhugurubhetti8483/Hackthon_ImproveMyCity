using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImproveMyCity.Application.DTOs
{
    public class SetupTotpResponseDTO
    {
        public string? SecretKey { get; set; }
        public string? OtpAuthUri { get; set; }
    }
}
