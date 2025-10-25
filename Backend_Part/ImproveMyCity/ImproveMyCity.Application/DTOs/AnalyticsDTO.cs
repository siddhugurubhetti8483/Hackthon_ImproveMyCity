using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImproveMyCity.Application.DTOs
{
    public class AnalyticsDTO
    {
        public ComplaintSummaryDTO Summary { get; set; }
        public List<CategoryStatsDTO> CategoryStats { get; set; }
        public List<MonthlyStatsDTO> MonthlyStats { get; set; }
    }
}
