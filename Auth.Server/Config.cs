using IdentityServer4.Models;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.IO;

namespace Auth.Server
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
                    ClientId = configuration["Service1:ClientId"],
                    ClientName =  configuration["Service1:ClientName"],
                    AllowedGrantTypes =  GrantTypes.Implicit,
                    ClientSecrets = { new Secret("secret".Sha256())},
                    AllowedScopes = { "openid", "profile", "email", "api.read" },
                    RedirectUris = { configuration["Service1:RedirectUris"] },
                    PostLogoutRedirectUris = { configuration["Service1:PostLogoutRedirectUris"] },
                    AllowedCorsOrigins = { configuration["Service1:AllowedCorsOrigins"] },
                    AllowAccessTokensViaBrowser = true,
                    AccessTokenLifetime = 3600,
                },
                 new Client {
                    RequireConsent = false,
                    ClientId = configuration["Service2:ClientId"],
                    ClientName =  configuration["Service2:ClientName"],
                    AllowedGrantTypes =  GrantTypes.Implicit,
                    AllowedScopes =  { "openid", "profile", "email", "api.read" },
                    RedirectUris = { configuration["Service2:RedirectUris"] },
                    PostLogoutRedirectUris = { configuration["Service2:PostLogoutRedirectUris"] },
                    AllowedCorsOrigins = { configuration["Service2:AllowedCorsOrigins"] },
                    AllowAccessTokensViaBrowser = true,
                    AccessTokenLifetime = 3600,
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