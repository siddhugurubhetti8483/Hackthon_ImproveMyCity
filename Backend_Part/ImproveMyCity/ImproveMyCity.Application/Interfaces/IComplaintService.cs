using ImproveMyCity.Application.DTOs;

namespace ImproveMyCity.Application.Interfaces
{
    public interface IComplaintService
    {
        Task<ComplaintDTO> CreateComplaintAsync(CreateComplaintDTO dto, int userId);
        Task<ComplaintDTO> GetComplaintByIdAsync(int id);
        Task<List<ComplaintDTO>> GetUserComplaintsAsync(int userId);
        Task<List<ComplaintDTO>> GetAllComplaintsAsync();
        Task<List<ComplaintDTO>> GetOfficerComplaintsAsync(int officerId);
        Task<ComplaintDTO> UpdateComplaintAsync(int id, UpdateComplaintDTO dto, int userId);
        Task<ComplaintDTO> UpdateComplaintStatusAsync(int id, UpdateComplaintStatusDTO dto, int userId);
        Task<bool> AssignComplaintAsync(int complaintId, int officerId, int adminId);
        Task<bool> DeleteComplaintAsync(int id, int userId);
        Task<ComplaintCommentDTO> AddCommentAsync(int complaintId, string comment, int userId, bool isInternal = false);
        Task<List<ComplaintCommentDTO>> GetComplaintCommentsAsync(int complaintId, int userId);
    }
}