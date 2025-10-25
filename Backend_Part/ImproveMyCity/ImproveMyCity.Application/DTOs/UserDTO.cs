using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImproveMyCity.Application.DTOs
{
    public class UserDTO
    {
        public int UserId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public List<string> Roles { get; set; } = new List<string>();
        public bool IsMFAEnabled { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
