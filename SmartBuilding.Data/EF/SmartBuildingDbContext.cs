using Microsoft.EntityFrameworkCore;
using SmartBuilding.Data.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartBuilding.Data.EF
{
    public class SmartBuildingDbContext : DbContext
    {
        public SmartBuildingDbContext(DbContextOptions<SmartBuildingDbContext> options) : base(options)
        {
        }
        public DbSet<Hub> Hubs { get; set; }

        public DbSet<Device> Devices { get; set; }

        public DbSet<User_Hub> User_Hubs { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
