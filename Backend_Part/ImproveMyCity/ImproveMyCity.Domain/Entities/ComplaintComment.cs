using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ImproveMyCity.Domain.Entities
{
    public class ComplaintComment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int ComplaintId { get; set; }

        [Required]
        public  int UserId { get; set; }

        [Required]
        [StringLength(1000)]
        public string Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsInternal { get; set; } = false; // For officer/internal notes

        // Navigation properties
        [ForeignKey("ComplaintId")]
        public virtual Complaint Complaint { get; set; }

        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }
    }
}