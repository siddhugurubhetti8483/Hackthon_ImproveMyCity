using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace ImproveMyCity.Domain.Entities
{
    public class ApplicationUser : IdentityUser<int>
    {
        [Required]
        [StringLength(100)]
        public string FullName { get; set; }

        // MFASecretKey for TOTP (Google Authenticator)
        public string? MFASecretKey { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime? LastLoginDate { get; set; }

        // Navigation properties - ADD THESE
        public virtual ICollection<OTPRequest> OTPRequests { get; set; } = new List<OTPRequest>();
        public virtual ICollection<Complaint> ComplaintsCreated { get; set; } = new List<Complaint>();
        public virtual ICollection<Complaint> ComplaintsAssigned { get; set; } = new List<Complaint>();
    }
}