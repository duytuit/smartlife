using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace SmartBuilding.Data.EF
{
    public class SmartBuildingDbContextFactory : IDesignTimeDbContextFactory<SmartBuildingDbContext>
    {
        public SmartBuildingDbContext CreateDbContext(string[] args)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                 .SetBasePath(Directory.GetCurrentDirectory())
                 .AddJsonFile("appsettings.json")
                 .Build();

            var connectionString = configuration.GetConnectionString("SmartBuildingDB");
            var optionsBuilder = new DbContextOptionsBuilder<SmartBuildingDbContext>();
            optionsBuilder.UseSqlServer(connectionString);
            return new SmartBuildingDbContext(optionsBuilder.Options);
        }
    }
}
