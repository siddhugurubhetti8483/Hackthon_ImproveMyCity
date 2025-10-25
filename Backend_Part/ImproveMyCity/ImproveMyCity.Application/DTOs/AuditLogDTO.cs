using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImproveMyCity.Application.DTOs
{
    public class AuditLogDTO
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string ActionType { get; set; }
        public string Entity { get; set; }
        public int? EntityId { get; set; }
        public string Description { get; set; }
        public string IPAddress { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
