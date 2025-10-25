using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ImproveMyCity.Domain.Entities;

namespace ImproveMyCity.Application.Interfaces
{
    public interface IJwtService
    {
        Task<string> GenerateJwtTokenAsync(ApplicationUser user, IList<string> roles);
    }
}
