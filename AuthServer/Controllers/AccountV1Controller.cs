using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using AuthServer.Constants;
using AuthServer.Data.Identity;
using AuthServer.Extensions;
using AuthServer.Models;
using AutoMapper;
using IdentityModel;
using IdentityModel.Client;
using IdentityServer4.Events;
using IdentityServer4.Models;
using IdentityServer4.Services;
using IdentityServer4.Stores;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace AuthServer.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AccountV1Controller : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<AppUser> _userManager;
        private readonly IHttpClientFactory _httpClientFactory;

        public AccountV1Controller(IConfiguration configuration, UserManager<AppUser> userManager ,IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _userManager = userManager;
            _httpClientFactory = httpClientFactory;
        }
        [HttpPost]
        public async Task<IActionResult> Login(LoginInputDto loginInputDto)
        {


            HttpClient client = _httpClientFactory.CreateClient();

            DiscoveryDocumentResponse disco = await client.GetDiscoveryDocumentAsync(new DiscoveryDocumentRequest
            {
                Address = _configuration["Service:Authority"],
                Policy =
                {
                    RequireHttps = false
                }
            });

            if (disco.IsError)
            {
                return NotFound();
            }

            TokenResponse response = await client.RequestTokenAsync(new PasswordTokenRequest()
            {
                Address = disco.TokenEndpoint,
                GrantType = GrantType.ResourceOwnerPassword,
                ClientId = _configuration["Service:ClientId"],
                ClientSecret = _configuration["Service:ClientSecret"],
                Parameters =
                {
                    { "UserName",loginInputDto.Username},
                    { "Password",loginInputDto.Password}
                },
                Scope = _configuration["Service:Name"],
            });

            if (response.IsError)
            {
                return Unauthorized();
            }
            var user = await _userManager.FindByNameAsync(loginInputDto.Username);
            var results = new
            {
                success = true,
                data = response.Raw,
                username = user.UserName,
                userid = user.Id
            };

            return Ok(results);
        }
        public string JsonToQuery(string jsonQuery)
        {
            string str = "?";
            str += jsonQuery.Replace(":", "=").Replace("{", "").
                        Replace("}", "").Replace(",", "&").
                            Replace("\"", "");
            return str;
        }
        [HttpGet]
        public async Task<IActionResult> GetRefreshToken()
        {
            string refreshToken=null;

            string authHeader = Request.Headers["Authorization"];

            if (authHeader != null && authHeader.StartsWith("Bearer"))
            {
                refreshToken = authHeader.Substring("Bearer ".Length).Trim();
            }
            else
            {
                return NotFound();
            }

            HttpClient client = _httpClientFactory.CreateClient();

            DiscoveryDocumentResponse disco = await client.GetDiscoveryDocumentAsync(new DiscoveryDocumentRequest
            {
                Address = _configuration["Service:Authority"],
                Policy =
                {
                    RequireHttps = true
                }
            });

            if (disco.IsError)
            {
                return NotFound();
            }

            TokenResponse response = await client.RequestTokenAsync(new TokenRequest
            {
                Address = disco.TokenEndpoint,
                GrantType = OidcConstants.GrantTypes.RefreshToken,

                ClientId = _configuration["Service:ClientId"],
                ClientSecret = _configuration["Service:ClientSecrets"],

                Parameters = new Dictionary<string, string>
                    {
                        { OidcConstants.TokenRequest.RefreshToken, refreshToken }
                    }
            });

            if (response.IsError)
            {
                return Unauthorized();
            }

            return Ok(response.Raw);
        }
        [HttpPost]
        public async Task<IActionResult> Register([FromBody]RegisterRequestViewModel model)
        {
            //var aVal = 0; var blowUp = 1 / aVal;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            DateTime gettime = DateTime.Now;
            var user = new AppUser {
                UserName = model.Email,
                Name = model.Name,
                Email = model.Email,
                status = false,
                userid_by = Guid.NewGuid(),
                created_at = gettime,
                updated_at = gettime,
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            await _userManager.AddClaimAsync(user, new System.Security.Claims.Claim("userName", user.UserName));
            await _userManager.AddClaimAsync(user, new System.Security.Claims.Claim("name", user.Name));
            await _userManager.AddClaimAsync(user, new System.Security.Claims.Claim("email", user.Email));
            await _userManager.AddClaimAsync(user, new System.Security.Claims.Claim("role", Roles.Admin));

            return Ok(new RegisterResponseViewModel(user));
        }
    }
}