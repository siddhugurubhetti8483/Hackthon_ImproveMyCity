using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImproveMyCity.Application.DTOs
{
    public class AddCommentDTO
    {
        [Required]
        [StringLength(1000, MinimumLength = 1)]
        public string Comment { get; set; }

        public bool IsInternal { get; set; } = false;
    }
}
