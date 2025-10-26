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

                // APPROACH 1: Client-side processing (Most Reliable)
                var monthlyData = await _dbContext.Complaints
                    .Where(c => !c.IsDeleted && c.CreatedAt >= startDate)
                    .GroupBy(c => new {
                        Year = c.CreatedAt.Year,
                        Month = c.CreatedAt.Month
                    })
                    .Select(g => new
                    {
                        Year = g.Key.Year,
                        Month = g.Key.Month,
                        Complaints = g.Count(),
                        Resolved = g.Count(c => c.Status == "Resolved")
                    })
                    .OrderBy(x => x.Year)
                    .ThenBy(x => x.Month)
                    .ToListAsync();

                // Format month string on client side
                var monthlyStats = monthlyData.Select(x => new MonthlyStatsDTO
                {
                    Month = $"{x.Year}-{x.Month:00}",
                    Complaints = x.Complaints,
                    Resolved = x.Resolved
                }).ToList();

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