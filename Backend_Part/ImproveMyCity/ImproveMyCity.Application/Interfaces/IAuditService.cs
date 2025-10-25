using ImproveMyCity.Application.DTOs;

namespace ImproveMyCity.Application.Interfaces
{
    public interface IAuditService
    {
        Task LogActivityAsync(int userId, string actionType, string entity, int? entityId, string description, string ipAddress, string userAgent, string oldValues = null, string newValues = null);
        Task<List<AuditLogDTO>> GetAuditLogsAsync(int? userId = null, string actionType = null, DateTime? fromDate = null, DateTime? toDate = null);
    }
}