using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartBuilding.Data.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartBuilding.Data.Configurations
{
    public class HubConfiguration : IEntityTypeConfiguration<Hub>
    {
        public void Configure(EntityTypeBuilder<Hub> builder)
        {
            builder.ToTable("Hubs");
            builder.HasKey(x => x.id);
            builder.Property(x => x.id).ValueGeneratedOnAdd();
            //builder.Property(x => x.code_hub).IsRequired();
        }
    }
}
