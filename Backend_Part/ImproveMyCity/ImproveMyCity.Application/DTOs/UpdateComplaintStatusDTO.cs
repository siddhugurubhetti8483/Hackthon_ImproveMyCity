using System.ComponentModel.DataAnnotations;


namespace ImproveMyCity.Application.DTOs
{
    public class UpdateComplaintStatusDTO
    {
        [Required]
        [StringLength(20)]
        public string Status { get; set; } // Pending, InProgress, Resolved, Rejected

        [StringLength(1000)]
        public string? ResolutionNotes { get; set; }
    }
}
