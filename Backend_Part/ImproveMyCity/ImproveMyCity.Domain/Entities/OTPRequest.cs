using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImproveMyCity.Domain.Entities
{
    public class OTPRequest
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }

        [Required]
        [StringLength(6)]
        public string OTPCode { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime ExpiresAt { get; set; }
        public bool IsUsed { get; set; } = false;

        [Required]
        [StringLength(50)]
        public string Purpose { get; set; } // "LoginMFA", "PasswordReset", "EmailConfirmation"

        [StringLength(20)]
        public string OTPType { get; set; } = "Email"; // "Email", "SMS", "TOTP"

        public int Attempts { get; set; } = 0;

        [StringLength(50)]
        public string? IPAddress { get; set; }

        [StringLength(500)]
        public string? UserAgent { get; set; }
    }
}
