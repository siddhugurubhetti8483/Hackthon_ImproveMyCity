using ImproveMyCity.Application.DTOs;

namespace ImproveMyCity.Application.Interfaces
{
    public interface IAnalyticsService
    {
        Task<ComplaintSummaryDTO> GetComplaintSummaryAsync();
        Task<AnalyticsDTO> GetAnalyticsAsync();
        Task<List<CategoryStatsDTO>> GetCategoryStatsAsync();
        Task<List<MonthlyStatsDTO>> GetMonthlyStatsAsync(int months = 12);
    }
}