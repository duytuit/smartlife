using SmartBuilding.Data;
using SmartBuilding.Data.EF;
using SmartBuilding.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartBuilding.Api.Services.User_Hubs
{
    public class User_HubService : EFRepository<User_Hub>, IUser_HubService
    {
        public User_HubService(SmartBuildingDbContext context) : base(context)
        {
        }
    }
}
