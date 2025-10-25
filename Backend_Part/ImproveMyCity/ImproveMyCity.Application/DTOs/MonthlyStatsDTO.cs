using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImproveMyCity.Application.DTOs
{
    public class MonthlyStatsDTO
    {
        public string Month { get; set; }
        public int Complaints { get; set; }
        public int Resolved { get; set; }
    }
}
