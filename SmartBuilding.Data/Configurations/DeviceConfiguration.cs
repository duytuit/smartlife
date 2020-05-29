using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartBuilding.Data.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartBuilding.Data.Configurations
{
    public class DeviceConfiguration : IEntityTypeConfiguration<Device>
    {
        public void Configure(EntityTypeBuilder<Device> builder)
        {
            builder.ToTable("Devices");
            builder.HasKey(x => x.id);
            builder.Property(x => x.id).ValueGeneratedOnAdd();
            //builder.Property(x => x.code_device).IsRequired();
            //builder.Property(x => x.hub_id).IsRequired();
            //builder.Property(x => x.device_type).IsRequired(); 
            //builder.Property(x => x.number_switch).IsRequired();
            builder.HasOne(x => x.Hub).WithMany(x => x.Device).HasForeignKey(x => x.hubid);
        }
    }
}
