using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImproveMyCity.Application.DTOs
{
    public class LoginResponseDTO
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string? Token { get; set; }
        public bool RequiresMFA { get; set; }
        public UserDTO? User { get; set; }
    }
}
