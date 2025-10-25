using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ImproveMyCity.Application.DTOs;
using ImproveMyCity.Application.Interfaces;
using ImproveMyCity.Domain.Entities;
using ImproveMyCity.Infrastructure.Data;

namespace ImproveMyCity.Infrastructure.Services
{
    public class AuditService : IAuditService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly ILogger<AuditService> _logger;

        public AuditService(ApplicationDbContext dbContext, ILogger<AuditService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task LogActivityAsync(int userId, string actionType, string entity, int? entityId, string description, string ipAddress, string userAgent, string oldValues = null, string newValues = null)
        {
            try
            {
                var auditLog = new AuditLog
                {
                    UserId = userId,
                    ActionType = actionType,
                    Entity = entity,
                    EntityId = entityId,
                    Description = description,
                    IPAddress = ipAddress,
                    UserAgent = userAgent,
                    OldValues = oldValues,
                    NewValues = newValues,
                    Timestamp = DateTime.UtcNow
                };

                await _dbContext.AuditLogs.AddAsync(auditLog);
                await _dbContext.SaveChangesAsync();

                _logger.LogInformation("Audit log created for user {UserId}, action: {ActionType}", userId, actionType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating audit log for user {UserId}", userId);
            }
        }

        public async Task<List<AuditLogDTO>> GetAuditLogsAsync(int? userId = null, string actionType = null, DateTime? fromDate = null, DateTime? toDate = null)
        {
            try
            {
                var query = _dbContext.AuditLogs
                    .Include(al => al.User)
                    .AsQueryable();

                if (userId.HasValue)
                {
                    query = query.Where(al => al.UserId == userId.Value);
                }

                if (!string.IsNullOrEmpty(actionType))
                {
                    query = query.Where(al => al.ActionType == actionType);
                }

                if (fromDate.HasValue)
                {
                    query = query.Where(al => al.Timestamp >= fromDate.Value);
                }

                if (toDate.HasValue)
                {
                    query = query.Where(al => al.Timestamp <= toDate.Value);
                }

                var auditLogs = await query
                    .OrderByDescending(al => al.Timestamp)
                    .Take(1000)
                    .ToListAsync();

                return auditLogs.Select(al => new AuditLogDTO
                {
                    Id = al.Id,
                    UserName = al.User.FullName,
                    ActionType = al.ActionType,
                    Entity = al.Entity,
                    EntityId = al.EntityId,
                    Description = al.Description,
                    IPAddress = al.IPAddress,
                    Timestamp = al.Timestamp
                }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting audit logs");
                throw;
            }
        }
    }
}