using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ImproveMyCity.Domain.Entities
{
    public class Complaint
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [Required]
        [StringLength(1000)]
        public string Description { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, InProgress, Resolved, Rejected

        [Required]
        [StringLength(500)]
        public string Location { get; set; }

        [StringLength(500)]
        public string? ImageUrl { get; set; }

        [Required]
        public int CreatedById { get; set; }

        public int? AssignedToId { get; set; }

        [StringLength(50)]
        public string Category { get; set; } = "General"; // Pothole, Garbage, Streetlight, etc.

        [StringLength(1000)]
        public string? ResolutionNotes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public bool IsDeleted { get; set; } = false;

        public int Priority { get; set; } = 1; // 1: Low, 2: Medium, 3: High, 4: Critical

        // Navigation properties
        [ForeignKey("CreatedById")]
        public virtual ApplicationUser CreatedBy { get; set; }

        [ForeignKey("AssignedToId")]
        public virtual ApplicationUser? AssignedTo { get; set; }

        public virtual ICollection<ComplaintComment> Comments { get; set; } = new List<ComplaintComment>();
    }
}