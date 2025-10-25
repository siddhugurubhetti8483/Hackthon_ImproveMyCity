using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ImproveMyCity.Domain.Entities
{
    public class AuditLog
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(100)]
        public string ActionType { get; set; } // Login, CreateComplaint, UpdateStatus, etc.

        [StringLength(100)]
        public string Entity { get; set; } // Complaint, User, etc.

        public int? EntityId { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        [StringLength(50)]
        public string IPAddress { get; set; }

        [StringLength(500)]
        public string UserAgent { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [StringLength(1000)]
        public string OldValues { get; set; }

        [StringLength(1000)]
        public string NewValues { get; set; }

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }
    }
}