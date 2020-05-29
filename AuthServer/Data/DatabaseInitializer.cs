using AuthServer.Constants;
using AuthServer.Data.Identity;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Mappers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AuthServer.Data
{
    public class DatabaseInitializer
    {
        public static void Init(IServiceProvider provider)
        {

            provider.GetRequiredService<AppIdentityDbContext>().Database.Migrate();
            //provider.GetRequiredService<PersistedGrantDbContext>().Database.Migrate();
            //provider.GetRequiredService<ConfigurationDbContext>().Database.Migrate();

           // InitializeIdentityServer(provider);

            var userManager = provider.GetRequiredService<UserManager<AppUser>>();
            var Admin = userManager.FindByNameAsync("admin").Result;
            if (Admin == null)
            {
                DateTime gettime = DateTime.Now;
                Admin = new AppUser
                {
                    UserName = "admin",
                    Name = "Duytuit",
                    Email = "duytu89@gmail.com",
                    status=true,
                    userid_by=Guid.NewGuid(),
                    created_at= gettime,
                    updated_at=gettime,
                };
                var result = userManager.CreateAsync(Admin, "Admin@123456").Result;
                if (!result.Succeeded)
                {
                    throw new Exception(result.Errors.First().Description);
                }

                Admin = userManager.FindByNameAsync("admin").Result;

                 userManager.AddClaimAsync(Admin, new System.Security.Claims.Claim("userName", Admin.UserName));
                 userManager.AddClaimAsync(Admin, new System.Security.Claims.Claim("name", Admin.Name));
                 userManager.AddClaimAsync(Admin, new System.Security.Claims.Claim("email", Admin.Email));
                 userManager.AddClaimAsync(Admin, new System.Security.Claims.Claim("role", Roles.Admin));

                if (!result.Succeeded)
                {
                    throw new Exception(result.Errors.First().Description);
                }
                Console.WriteLine("admin created");
            }
            else
            {
                Console.WriteLine("admin already exists");
            }
        }

        private static void InitializeIdentityServer(IServiceProvider provider)
        {
            var context = provider.GetRequiredService<ConfigurationDbContext>();
            if (!context.Clients.Any())
            {
                foreach (var client in Config.GetClients())
                {
                    context.Clients.Add(client.ToEntity());
                }
                context.SaveChanges();
            }

            if (!context.IdentityResources.Any())
            {
                foreach (var resource in Config.GetIdentityResources())
                {
                    context.IdentityResources.Add(resource.ToEntity());
                }
                context.SaveChanges();
            }

            if (!context.ApiResources.Any())
            {
                foreach (var resource in Config.GetApiResources())
                {
                    context.ApiResources.Add(resource.ToEntity());
                }
                context.SaveChanges();
            }
        }
    }
}
