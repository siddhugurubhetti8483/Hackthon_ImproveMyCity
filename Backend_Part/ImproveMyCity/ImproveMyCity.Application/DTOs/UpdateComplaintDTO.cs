using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImproveMyCity.Application.DTOs
{
    public class UpdateComplaintDTO
    {
        [StringLength(200, MinimumLength = 5)]
        public string? Title { get; set; }

        [StringLength(1000, MinimumLength = 10)]
        public string? Description { get; set; }

        [StringLength(500)]
        public string? Location { get; set; }

        public string? ImageUrl { get; set; }

        [StringLength(50)]
        public string? Category { get; set; }

        public int? Priority { get; set; }
    }

}
