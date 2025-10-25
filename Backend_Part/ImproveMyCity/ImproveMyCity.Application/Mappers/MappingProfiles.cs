using AutoMapper;
using ImproveMyCity.Application.DTOs;
using ImproveMyCity.Application.Interfaces;
using ImproveMyCity.Domain.Entities;

namespace ImproveMyCity.Application.Mappers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            // User mappings
            CreateMap<ApplicationUser, UserDTO>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.IsMFAEnabled, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.MFASecretKey)));

            // Complaint mappings
            CreateMap<Complaint, ComplaintDTO>();
            CreateMap<CreateComplaintDTO, Complaint>();
            CreateMap<UpdateComplaintDTO, Complaint>();

            // Comment mappings
            CreateMap<ComplaintComment, ComplaintCommentDTO>();

            // Audit log mappings
            CreateMap<AuditLog, AuditLogDTO>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.FullName));
        }
    }
}