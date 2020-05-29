using SmartBuilding.Data;
using SmartBuilding.Data.EF;
using SmartBuilding.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartBuilding.Api.Services.Devives
{
    public class DeviceService : EFRepository<Device>, IDeviceService
    {
        public DeviceService(SmartBuildingDbContext context) : base(context)
        {
        }
    }
}
