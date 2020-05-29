using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Auth.Server.Data.Identity
{
    public class AppUser : IdentityUser
    {
        public string Name { get; set; }
        public string note { get; set; }
        public bool status { get; set; }
        public Guid userid_by { get; set; }
        public string created_by { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
    }
}
