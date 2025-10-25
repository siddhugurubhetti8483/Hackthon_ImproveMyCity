using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ImproveMyCity.Application.DTOs;
using ImproveMyCity.Application.Interfaces;
using ImproveMyCity.Domain.Entities;
using ImproveMyCity.Infrastructure.Data;

namespace ImproveMyCity.Infrastructure.Services
{
    public class ComplaintService : IComplaintService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly ILogger<ComplaintService> _logger;
        private readonly IAuditService _auditService;

        public ComplaintService(
            ApplicationDbContext dbContext,
            IMapper mapper,
            ILogger<ComplaintService> logger,
            IAuditService auditService)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _logger = logger;
            _auditService = auditService;
        }

        public async Task<ComplaintDTO> CreateComplaintAsync(CreateComplaintDTO dto, int userId)
        {
            try
            {
                var complaint = _mapper.Map<Complaint>(dto);
                complaint.CreatedById = userId;
                complaint.CreatedAt = DateTime.UtcNow;

                await _dbContext.Complaints.AddAsync(complaint);
                await _dbContext.SaveChangesAsync();

                // Log activity
                await _auditService.LogActivityAsync(
                    userId,
                    "CreateComplaint",
                    "Complaint",
                    complaint.Id,
                    $"Created complaint: {complaint.Title}",
                    "System",
                    "API"
                );

                _logger.LogInformation("Complaint created successfully: {ComplaintId} by user {UserId}", complaint.Id, userId);

                return await GetComplaintByIdAsync(complaint.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating complaint for user {UserId}", userId);
                throw;
            }
        }

        public async Task<ComplaintDTO> GetComplaintByIdAsync(int id)
        {
            var complaint = await _dbContext.Complaints
                .Include(c => c.CreatedBy)
                .Include(c => c.AssignedTo)
                .Include(c => c.Comments)
                    .ThenInclude(cc => cc.User)
                .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);

            if (complaint == null)
            {
                _logger.LogWarning("Complaint not found: {ComplaintId}", id);
                return null;
            }

            return _mapper.Map<ComplaintDTO>(complaint);
        }

        public async Task<List<ComplaintDTO>> GetUserComplaintsAsync(int userId)
        {
            try
            {
                var complaints = await _dbContext.Complaints
                    .Include(c => c.CreatedBy)
                    .Include(c => c.AssignedTo)
                    .Include(c => c.Comments)
                    .Where(c => c.CreatedById == userId && !c.IsDeleted)
                    .OrderByDescending(c => c.CreatedAt)
                    .ToListAsync();

                return _mapper.Map<List<ComplaintDTO>>(complaints);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user complaints for user {UserId}", userId);
                throw;
            }
        }

        public async Task<List<ComplaintDTO>> GetAllComplaintsAsync()
        {
            try
            {
                var complaints = await _dbContext.Complaints
                    .Include(c => c.CreatedBy)
                    .Include(c => c.AssignedTo)
                    .Include(c => c.Comments)
                    .Where(c => !c.IsDeleted)
                    .OrderByDescending(c => c.CreatedAt)
                    .ToListAsync();

                return _mapper.Map<List<ComplaintDTO>>(complaints);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all complaints");
                throw;
            }
        }

        public async Task<List<ComplaintDTO>> GetOfficerComplaintsAsync(int officerId)
        {
            try
            {
                _logger.LogInformation("Fetching complaints for officer: {OfficerId}", officerId);

                var complaints = await _dbContext.Complaints
                    .Include(c => c.CreatedBy)
                    .Include(c => c.AssignedTo)
                    .Include(c => c.Comments)
                    .Where(c => !c.IsDeleted &&
                               (c.AssignedToId == officerId || c.Status == "Pending"))
                    .OrderByDescending(c => c.CreatedAt)
                    .ToListAsync();

                _logger.LogInformation("Found {Count} complaints for officer {OfficerId}", complaints.Count, officerId);

                return _mapper.Map<List<ComplaintDTO>>(complaints);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting officer complaints for officer {OfficerId}", officerId);
                throw;
            }
        }

        public async Task<ComplaintDTO> UpdateComplaintAsync(int id, UpdateComplaintDTO dto, int userId)
        {
            try
            {
                var complaint = await _dbContext.Complaints
                    .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);

                if (complaint == null)
                {
                    _logger.LogWarning("Complaint not found for update: {ComplaintId}", id);
                    return null;
                }

                // Only creator or admin can update
                if (complaint.CreatedById != userId)
                {
                    var user = await _dbContext.Users.FindAsync(userId);
                    var isAdmin = await _dbContext.UserRoles.AnyAsync(ur =>
                        ur.UserId == userId && ur.RoleId == 1); // Admin role ID

                    if (!isAdmin)
                    {
                        _logger.LogWarning("User {UserId} unauthorized to update complaint {ComplaintId}", userId, id);
                        return null;
                    }
                }

                // Update fields
                if (!string.IsNullOrEmpty(dto.Title)) complaint.Title = dto.Title;
                if (!string.IsNullOrEmpty(dto.Description)) complaint.Description = dto.Description;
                if (!string.IsNullOrEmpty(dto.Location)) complaint.Location = dto.Location;
                if (!string.IsNullOrEmpty(dto.ImageUrl)) complaint.ImageUrl = dto.ImageUrl;
                if (!string.IsNullOrEmpty(dto.Category)) complaint.Category = dto.Category;
                if (dto.Priority.HasValue) complaint.Priority = dto.Priority.Value;
                complaint.UpdatedAt = DateTime.UtcNow;

                await _dbContext.SaveChangesAsync();

                // Log activity
                await _auditService.LogActivityAsync(
                    userId,
                    "UpdateComplaint",
                    "Complaint",
                    complaint.Id,
                    $"Updated complaint: {complaint.Title}",
                    "System",
                    "API"
                );

                _logger.LogInformation("Complaint updated successfully: {ComplaintId} by user {UserId}", id, userId);

                return await GetComplaintByIdAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating complaint {ComplaintId} by user {UserId}", id, userId);
                throw;
            }
        }

        public async Task<ComplaintDTO> UpdateComplaintStatusAsync(int id, UpdateComplaintStatusDTO dto, int userId)
        {
            try
            {
                var complaint = await _dbContext.Complaints
                    .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);

                if (complaint == null)
                {
                    _logger.LogWarning("Complaint not found for status update: {ComplaintId}", id);
                    return null;
                }

                // Only assigned officer or admin can update status
                var user = await _dbContext.Users.FindAsync(userId);
                var isAdmin = await _dbContext.UserRoles.AnyAsync(ur =>
                    ur.UserId == userId && ur.RoleId == 1); // Admin role ID

                if (complaint.AssignedToId != userId && !isAdmin)
                {
                    _logger.LogWarning("User {UserId} unauthorized to update status of complaint {ComplaintId}", userId, id);
                    return null;
                }

                var oldStatus = complaint.Status;
                complaint.Status = dto.Status;
                complaint.ResolutionNotes = dto.ResolutionNotes;
                complaint.UpdatedAt = DateTime.UtcNow;

                if (dto.Status == "Resolved")
                {
                    complaint.ResolvedAt = DateTime.UtcNow;
                }

                await _dbContext.SaveChangesAsync();

                // Log activity
                await _auditService.LogActivityAsync(
                    userId,
                    "UpdateComplaintStatus",
                    "Complaint",
                    complaint.Id,
                    $"Updated complaint status from {oldStatus} to {dto.Status}",
                    "System",
                    "API",
                    oldValues: $"Status: {oldStatus}",
                    newValues: $"Status: {dto.Status}, ResolutionNotes: {dto.ResolutionNotes}"
                );

                _logger.LogInformation("Complaint status updated: {ComplaintId} from {OldStatus} to {NewStatus} by user {UserId}",
                    id, oldStatus, dto.Status, userId);

                return await GetComplaintByIdAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating complaint status {ComplaintId} by user {UserId}", id, userId);
                throw;
            }
        }

        public async Task<bool> AssignComplaintAsync(int complaintId, int officerId, int adminId)
        {
            try
            {
                var complaint = await _dbContext.Complaints
                    .FirstOrDefaultAsync(c => c.Id == complaintId && !c.IsDeleted);

                if (complaint == null)
                {
                    _logger.LogWarning("Complaint not found for assignment: {ComplaintId}", complaintId);
                    return false;
                }

                // Verify officer exists and has officer role
                var officer = await _dbContext.Users.FindAsync(officerId);
                var isOfficer = await _dbContext.UserRoles.AnyAsync(ur =>
                    ur.UserId == officerId && ur.RoleId == 2); // Officer role ID

                if (officer == null || !isOfficer)
                {
                    _logger.LogWarning("Invalid officer ID for assignment: {OfficerId}", officerId);
                    return false;
                }

                var oldOfficerId = complaint.AssignedToId;
                complaint.AssignedToId = officerId;
                complaint.Status = "InProgress";
                complaint.UpdatedAt = DateTime.UtcNow;

                await _dbContext.SaveChangesAsync();

                // Log activity
                await _auditService.LogActivityAsync(
                    adminId,
                    "AssignComplaint",
                    "Complaint",
                    complaint.Id,
                    $"Assigned complaint to officer: {officer.FullName}",
                    "System",
                    "API",
                    oldValues: $"AssignedTo: {oldOfficerId}",
                    newValues: $"AssignedTo: {officerId}, Status: InProgress"
                );

                _logger.LogInformation("Complaint {ComplaintId} assigned to officer {OfficerId} by admin {AdminId}",
                    complaintId, officerId, adminId);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning complaint {ComplaintId} to officer {OfficerId}", complaintId, officerId);
                return false;
            }
        }

        public async Task<bool> DeleteComplaintAsync(int id, int userId)
        {
            try
            {
                var complaint = await _dbContext.Complaints
                    .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);

                if (complaint == null)
                {
                    _logger.LogWarning("Complaint not found for deletion: {ComplaintId}", id);
                    return false;
                }

                // Only creator or admin can delete
                if (complaint.CreatedById != userId)
                {
                    var isAdmin = await _dbContext.UserRoles.AnyAsync(ur =>
                        ur.UserId == userId && ur.RoleId == 1); // Admin role ID

                    if (!isAdmin)
                    {
                        _logger.LogWarning("User {UserId} unauthorized to delete complaint {ComplaintId}", userId, id);
                        return false;
                    }
                }

                complaint.IsDeleted = true;
                complaint.UpdatedAt = DateTime.UtcNow;

                await _dbContext.SaveChangesAsync();

                // Log activity
                await _auditService.LogActivityAsync(
                    userId,
                    "DeleteComplaint",
                    "Complaint",
                    complaint.Id,
                    $"Deleted complaint: {complaint.Title}",
                    "System",
                    "API"
                );

                _logger.LogInformation("Complaint deleted: {ComplaintId} by user {UserId}", id, userId);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting complaint {ComplaintId} by user {UserId}", id, userId);
                return false;
            }
        }

        public async Task<ComplaintCommentDTO> AddCommentAsync(int complaintId, string comment, int userId, bool isInternal = false)
        {
            try
            {
                var complaint = await _dbContext.Complaints
                    .FirstOrDefaultAsync(c => c.Id == complaintId && !c.IsDeleted);

                if (complaint == null)
                {
                    _logger.LogWarning("Complaint not found for comment: {ComplaintId}", complaintId);
                    return null;
                }

                var complaintComment = new ComplaintComment
                {
                    ComplaintId = complaintId,
                    UserId = userId,
                    Comment = comment,
                    IsInternal = isInternal,
                    CreatedAt = DateTime.UtcNow
                };

                await _dbContext.ComplaintComments.AddAsync(complaintComment);
                await _dbContext.SaveChangesAsync();

                // Get the comment with user details
                var savedComment = await _dbContext.ComplaintComments
                    .Include(cc => cc.User)
                    .FirstOrDefaultAsync(cc => cc.Id == complaintComment.Id);

                // Log activity
                await _auditService.LogActivityAsync(
                    userId,
                    "AddComment",
                    "Complaint",
                    complaint.Id,
                    $"Added comment to complaint: {complaint.Title}",
                    "System",
                    "API"
                );

                _logger.LogInformation("Comment added to complaint {ComplaintId} by user {UserId}", complaintId, userId);

                return _mapper.Map<ComplaintCommentDTO>(savedComment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding comment to complaint {ComplaintId} by user {UserId}", complaintId, userId);
                throw;
            }
        }

        public async Task<List<ComplaintCommentDTO>> GetComplaintCommentsAsync(int complaintId, int userId)
        {
            var complaint = await _dbContext.Complaints
                .FirstOrDefaultAsync(c => c.Id == complaintId && !c.IsDeleted);

            if (complaint == null)
            {
                _logger.LogWarning("Complaint not found: {ComplaintId}", complaintId);
                return new List<ComplaintCommentDTO>();
            }

            var user = await _dbContext.Users.FindAsync(userId);
            var isAdminOrOfficer = await _dbContext.UserRoles.AnyAsync(ur =>
                ur.UserId == userId && (ur.RoleId == 1 || ur.RoleId == 2)); // Admin or Officer role

            var comments = await _dbContext.ComplaintComments
                .Include(cc => cc.User)
                .Where(cc => cc.ComplaintId == complaintId)
                .Where(cc => !cc.IsInternal || (cc.IsInternal && isAdminOrOfficer)) // Internal comments only visible to admin/officer
                .OrderBy(cc => cc.CreatedAt)
                .ToListAsync();

            return _mapper.Map<List<ComplaintCommentDTO>>(comments);
        }
    }
}