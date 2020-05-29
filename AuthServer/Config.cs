using IdentityServer4.Models;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.IO;

namespace AuthServer
{
    public class Config
    {
      
        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Email(),
                new IdentityResources.Profile()
            };
        }

        public static IEnumerable<ApiResource> GetApiResources()
        {
            return new List<ApiResource>
            {
                new ApiResource("resourceapi", "Resource API")
                {
                    Scopes = {new Scope("api.read") },
                },

                {
                    new ApiResource("apiApp", "My API")
                }
        };
        }

        public static IEnumerable<Client> GetClients()
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();
            return new[]
            {
                new Client {
                    RequireConsent = false,
                    ClientId = "angular_spa",
                    ClientName = "Angular SPA",
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowedScopes = { "openid", "profile", "email", "api.read" },
                    RedirectUris = {"http://localhost:4200/welcome" },
                    PostLogoutRedirectUris = {"http://localhost:4200/welcome" },
                    AllowedCorsOrigins = {"http://localhost:4200"},
                     AllowAccessTokensViaBrowser = true,
                     AccessTokenLifetime = 3600
                },
                 new Client {
                    RequireConsent = false,
                    ClientId = "smartlife_spa",
                    ClientName =  "smartlife SPA",
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowedScopes = { "openid", "profile", "email", "api.read" },
                    RedirectUris = {"http://localhost:4300/welcome" },
                    PostLogoutRedirectUris = {"http://localhost:4300/welcome" },
                    AllowedCorsOrigins = {"http://localhost:4300"},
                     AllowAccessTokensViaBrowser = true,
                     AccessTokenLifetime = 3600
                },
                 new Client
                {
                    ClientId = "clientApp",
                    AllowedGrantTypes = GrantTypes.ClientCredentials,
                    ClientSecrets =
                    {
                        new Secret("secret".Sha256())
                    },
                    AllowedScopes = { "apiApp" }
                },
                  new Client {
                    ClientId = "angular_spa1",
                    ClientName = "Angular SPA",
                    AllowedGrantTypes = GrantTypes.ResourceOwnerPassword,
                    AllowedScopes = { "openid", "profile", "email", "api.read","role" },
                    ClientSecrets =
                    {
                        new Secret("secret".Sha256())
                    },
                     AllowAccessTokensViaBrowser = true,
                     AccessTokenLifetime = 3600,
                },
                 new Client
                {
                    ClientId = configuration["Service3:ClientId"],
                    AllowedGrantTypes = GrantTypes.ResourceOwnerPassword,
                    ClientSecrets =
                    {
                        new Secret(configuration["Service3:ClientSecrets"].Sha256())
                    },
                    AllowedScopes = { "apiApp" }
                },
            };
        }
    }
}