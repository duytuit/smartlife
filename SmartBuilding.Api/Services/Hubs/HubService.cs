using SmartBuilding.Data;
using SmartBuilding.Data.EF;
using SmartBuilding.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartBuilding.Api.Services.Hubs
{
    public class HubService : EFRepository<Hub>, IHubService
    {
        public HubService(SmartBuildingDbContext context) : base(context)
        {
        }
    }
}
