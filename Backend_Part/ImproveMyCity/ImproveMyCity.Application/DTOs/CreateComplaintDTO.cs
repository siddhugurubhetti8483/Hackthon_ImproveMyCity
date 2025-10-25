using System.ComponentModel.DataAnnotations;


namespace ImproveMyCity.Application.DTOs
{
    public class CreateComplaintDTO
    {
        [Required]
        [StringLength(200, MinimumLength = 5)]
        public string Title { get; set; }

        [Required]
        [StringLength(1000, MinimumLength = 10)]
        public string Description { get; set; }

        [Required]
        [StringLength(500)]
        public string Location { get; set; }

        public string? ImageUrl { get; set; }

        [StringLength(50)]
        public string Category { get; set; } = "General";

        public int Priority { get; set; } = 1;
    }
}
