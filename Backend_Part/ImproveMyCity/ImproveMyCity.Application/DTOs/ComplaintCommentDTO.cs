using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImproveMyCity.Application.DTOs
{
    public class ComplaintCommentDTO
    {
        public int Id { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }
        public UserDTO User { get; set; }
        public bool IsInternal { get; set; }
    }
}
