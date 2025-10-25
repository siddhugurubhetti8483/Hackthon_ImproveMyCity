using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImproveMyCity.Application.DTOs
{
    public class ComplaintDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string Location { get; set; }
        public string? ImageUrl { get; set; }
        public string Category { get; set; }
        public int Priority { get; set; }
        public string? ResolutionNotes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public UserDTO CreatedBy { get; set; }
        public UserDTO? AssignedTo { get; set; }
        public List<ComplaintCommentDTO> Comments { get; set; } = new List<ComplaintCommentDTO>();
    }
}
