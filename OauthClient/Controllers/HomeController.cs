using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace OauthClient.Controllers
{
    [Route("[controller]")]
    [ApiController]

    public class HomeController : ControllerBase
    {

        [HttpGet]
        public IActionResult Get()
        {
         
            return Ok("Websocket Connect Mqtt");
        }
    }
}