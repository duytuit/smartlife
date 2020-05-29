using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartBuilding.Data.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartBuilding.Data.Configurations
{
    public class UserHubConfiguration : IEntityTypeConfiguration<User_Hub>
    {
        public void Configure(EntityTypeBuilder<User_Hub> builder)
        {
            builder.ToTable("User_Hubs");
            builder.HasKey(x => x.id);
            builder.Property(x => x.id).ValueGeneratedOnAdd();
            builder.HasOne(x => x.Hub).WithMany(x => x.User_Hub).HasForeignKey(x => x.hubid).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
