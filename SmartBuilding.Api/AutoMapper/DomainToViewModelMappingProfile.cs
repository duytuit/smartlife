using AutoMapper;
using SmartBuilding.Api.ViewModels;
using SmartBuilding.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartBuilding.Api.AutoMapper
{
    public class DomainToViewModelMappingProfile : Profile
    {
        public DomainToViewModelMappingProfile()
        {
            CreateMap<Device, DeviceViewModel>();
            CreateMap<UserHubViewModel, User_Hub>(); 
        }
    }
}
