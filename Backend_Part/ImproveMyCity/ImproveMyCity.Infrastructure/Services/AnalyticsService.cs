using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ImproveMyCity.Application.DTOs;
using ImproveMyCity.Application.Interfaces;
using ImproveMyCity.Infrastructure.Data;

namespace ImproveMyCity.Infrastructure.Services
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly ILogger<AnalyticsService> _logger;

        public AnalyticsService(ApplicationDbContext dbContext, ILogger<AnalyticsService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<ComplaintSummaryDTO> GetComplaintSummaryAsync()
        {
            try
            {
                var total = await _dbContext.Complaints.CountAsync(c => !c.IsDeleted);
                var pending = await _dbContext.Complaints.CountAsync(c => !c.IsDeleted && c.Status == "Pending");
                var inProgress = await _dbContext.Complaints.CountAsync(c => !c.IsDeleted && c.Status == "InProgress");
                var resolved = await _dbContext.Complaints.CountAsync(c => !c.IsDeleted && c.Status == "Resolved");
                var rejected = await _dbContext.Complaints.CountAsync(c => !c.IsDeleted && c.Status == "Rejected");

                return new ComplaintSummaryDTO
                {
                    TotalComplaints = total,
                    PendingComplaints = pending,
                    InProgressComplaints = inProgress,
                    ResolvedComplaints = resolved,
                    RejectedComplaints = rejected
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting complaint summary");
                throw;
            }
        }

        public async Task<AnalyticsDTO> GetAnalyticsAsync()
        {
            try
            {
                var summary = await GetComplaintSummaryAsync();
                var categoryStats = await GetCategoryStatsAsync();
                var monthlyStats = await GetMonthlyStatsAsync(6);

                return new AnalyticsDTO
                {
                    Summary = summary,
                    CategoryStats = categoryStats,
                    MonthlyStats = monthlyStats
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting analytics");
                throw;
            }
        }

        public async Task<List<CategoryStatsDTO>> GetCategoryStatsAsync()
        {
            try
            {
                var categoryStats = await _dbContext.Complaints
                    .Where(c => !c.IsDeleted)
                    .GroupBy(c => c.Category)
                    .Select(g => new CategoryStatsDTO
                    {
                        Category = g.Key,
                        Count = g.Count()
                    })
                    .OrderByDescending(cs => cs.Count)
                    .ToListAsync();

                return categoryStats;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting category stats");
                throw;
            }
        }

        public async Task<List<MonthlyStatsDTO>> GetMonthlyStatsAsync(int months = 12)
        {
            try
            {
                var startDate = DateTime.UtcNow.AddMonths(-months);

                var monthlyStats = await _dbContext.Complaints
                    .Where(c => !c.IsDeleted && c.CreatedAt >= startDate)
                    .GroupBy(c => new { Year = c.CreatedAt.Year, Month = c.CreatedAt.Month })
                    .Select(g => new MonthlyStatsDTO
                    {
                        Month = $"{g.Key.Year}-{g.Key.Month:00}",
                        Complaints = g.Count(),
                        Resolved = g.Count(c => c.Status == "Resolved")
                    })
                    .OrderBy(ms => ms.Month)
                    .ToListAsync();

                return monthlyStats;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting monthly stats");
                throw;
            }
        }
    }
}