using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ImproveMyCity.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace ImproveMyCity.Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, int>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<OTPRequest> OTPRequests { get; set; }
        public DbSet<Complaint> Complaints { get; set; }
        public DbSet<ComplaintComment> ComplaintComments { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure ApplicationUser
            builder.Entity<ApplicationUser>(entity =>
            {
                entity.HasIndex(u => u.Email).IsUnique();
                entity.HasIndex(u => u.NormalizedEmail).IsUnique();
                entity.HasIndex(u => u.NormalizedUserName).IsUnique();

                entity.Property(u => u.FullName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(u => u.MFASecretKey)
                    .HasMaxLength(256);

                // Relationships
                entity.HasMany(u => u.OTPRequests)
                    .WithOne(o => o.User)
                    .HasForeignKey(o => o.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(u => u.ComplaintsCreated)
                    .WithOne(c => c.CreatedBy)
                    .HasForeignKey(c => c.CreatedById)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(u => u.ComplaintsAssigned)
                    .WithOne(c => c.AssignedTo)
                    .HasForeignKey(c => c.AssignedToId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure ApplicationRole
            builder.Entity<ApplicationRole>(entity =>
            {
                entity.HasIndex(r => r.NormalizedName).IsUnique();

                entity.Property(r => r.Description)
                    .HasMaxLength(500);

                entity.Property(r => r.Category)
                    .HasMaxLength(100);
            });

            // Configure OTPRequest
            builder.Entity<OTPRequest>(entity =>
            {
                entity.HasIndex(o => new { o.UserId, o.Purpose, o.CreatedAt });
                entity.HasIndex(o => new { o.OTPCode, o.IsUsed, o.ExpiresAt });

                entity.Property(o => o.OTPCode)
                    .IsRequired()
                    .HasMaxLength(6);

                entity.Property(o => o.Purpose)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(o => o.OTPType)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasDefaultValue("Email");
            });

            // Configure Complaint
            builder.Entity<Complaint>(entity =>
            {
                entity.HasIndex(c => c.Status);
                entity.HasIndex(c => c.Category);
                entity.HasIndex(c => c.CreatedAt);
                entity.HasIndex(c => new { c.Status, c.Priority });

                entity.Property(c => c.Title)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(c => c.Description)
                    .IsRequired()
                    .HasMaxLength(1000);

                entity.Property(c => c.Status)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasDefaultValue("Pending");

                entity.Property(c => c.Location)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(c => c.ImageUrl)
                    .HasMaxLength(500);

                entity.Property(c => c.Category)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasDefaultValue("General");

                entity.Property(c => c.ResolutionNotes)
                    .HasMaxLength(1000);

                // Relationships
                entity.HasOne(c => c.CreatedBy)
                    .WithMany(u => u.ComplaintsCreated)
                    .HasForeignKey(c => c.CreatedById)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(c => c.AssignedTo)
                    .WithMany(u => u.ComplaintsAssigned)
                    .HasForeignKey(c => c.AssignedToId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasMany(c => c.Comments)
                    .WithOne(cc => cc.Complaint)
                    .HasForeignKey(cc => cc.ComplaintId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure ComplaintComment
            builder.Entity<ComplaintComment>(entity =>
            {
                entity.HasIndex(cc => cc.ComplaintId);
                entity.HasIndex(cc => cc.CreatedAt);

                entity.Property(cc => cc.Comment)
                    .IsRequired()
                    .HasMaxLength(1000);

                // Relationships
                entity.HasOne(cc => cc.Complaint)
                    .WithMany(c => c.Comments)
                    .HasForeignKey(cc => cc.ComplaintId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(cc => cc.User)
                    .WithMany()
                    .HasForeignKey(cc => cc.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure AuditLog
            builder.Entity<AuditLog>(entity =>
            {
                entity.HasIndex(al => al.UserId);
                entity.HasIndex(al => al.Timestamp);
                entity.HasIndex(al => new { al.ActionType, al.Entity });

                entity.Property(al => al.ActionType)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(al => al.Entity)
                    .HasMaxLength(100);

                entity.Property(al => al.Description)
                    .HasMaxLength(1000);

                entity.Property(al => al.IPAddress)
                    .HasMaxLength(50);

                entity.Property(al => al.UserAgent)
                    .HasMaxLength(500);

                entity.Property(al => al.OldValues)
                    .HasMaxLength(1000);

                entity.Property(al => al.NewValues)
                    .HasMaxLength(1000);

                // Relationships
                entity.HasOne(al => al.User)
                    .WithMany()
                    .HasForeignKey(al => al.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Seed initial Roles
            builder.Entity<ApplicationRole>().HasData(
                new ApplicationRole
                {
                    Id = 1,
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                    Description = "System Administrator with full access",
                    Category = "Administrative",
                    CreatedAt = DateTime.UtcNow
                },
                new ApplicationRole
                {
                    Id = 2,
                    Name = "Officer",
                    NormalizedName = "OFFICER",
                    Description = "City officer who can manage complaints",
                    Category = "Municipal",
                    CreatedAt = DateTime.UtcNow
                },
                new ApplicationRole
                {
                    Id = 3,
                    Name = "User",
                    NormalizedName = "USER",
                    Description = "Regular application user",
                    Category = "General",
                    CreatedAt = DateTime.UtcNow
                }
            );

            // Seed default admin user
            var hasher = new PasswordHasher<ApplicationUser>();

            var adminUser = new ApplicationUser
            {
                Id = 1,
                UserName = "admin@improvecity.com",
                NormalizedUserName = "ADMIN@IMPROVECITY.COM",
                Email = "admin@improvecity.com",
                NormalizedEmail = "ADMIN@IMPROVECITY.COM",
                FullName = "System Administrator",
                EmailConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString(),
                ConcurrencyStamp = Guid.NewGuid().ToString(),
                PhoneNumber = null,
                PhoneNumberConfirmed = false,
                TwoFactorEnabled = false,
                LockoutEnabled = true,
                AccessFailedCount = 0,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            adminUser.PasswordHash = hasher.HashPassword(adminUser, "Admin@123");

            builder.Entity<ApplicationUser>().HasData(adminUser);

            // Assign admin role to admin user
            builder.Entity<IdentityUserRole<int>>().HasData(
                new IdentityUserRole<int>
                {
                    UserId = 1,
                    RoleId = 1
                }
            );

            // Seed sample officer
            var officerUser = new ApplicationUser
            {
                Id = 2,
                UserName = "officer@improvecity.com",
                NormalizedUserName = "OFFICER@IMPROVECITY.COM",
                Email = "officer@improvecity.com",
                NormalizedEmail = "OFFICER@IMPROVECITY.COM",
                FullName = "City Officer",
                EmailConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString(),
                ConcurrencyStamp = Guid.NewGuid().ToString(),
                PhoneNumber = null,
                PhoneNumberConfirmed = false,
                TwoFactorEnabled = false,
                LockoutEnabled = true,
                AccessFailedCount = 0,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            officerUser.PasswordHash = hasher.HashPassword(officerUser, "Officer@123");

            builder.Entity<ApplicationUser>().HasData(officerUser);

            // Assign officer role
            builder.Entity<IdentityUserRole<int>>().HasData(
                new IdentityUserRole<int>
                {
                    UserId = 2,
                    RoleId = 2
                }
            );
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is ApplicationUser || e.Entity is ApplicationRole || e.Entity is Complaint &&
                    (e.State == EntityState.Modified));

            foreach (var entityEntry in entries)
            {
                if (entityEntry.State == EntityState.Modified)
                {
                    if (entityEntry.Entity is ApplicationUser user)
                    {
                        user.UpdatedAt = DateTime.UtcNow;
                    }
                    else if (entityEntry.Entity is ApplicationRole role)
                    {
                        role.UpdatedAt = DateTime.UtcNow;
                    }
                    else if (entityEntry.Entity is Complaint complaint)
                    {
                        complaint.UpdatedAt = DateTime.UtcNow;
                        if (complaint.Status == "Resolved" && complaint.ResolvedAt == null)
                        {
                            complaint.ResolvedAt = DateTime.UtcNow;
                        }
                    }
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}