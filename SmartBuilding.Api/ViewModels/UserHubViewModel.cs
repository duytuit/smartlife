using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartBuilding.Api.ViewModels
{
    public class UserHubViewModel
    {
        public Guid id { get; set; }
        public Guid? userid { get; set; }
        public string username { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public Guid? hubid { get; set; }
        public string hub_code { get; set; }
        public string hub_password_client { get; set; }
        public string note { get; set; }
        public bool status { get; set; }
        public Guid userid_by { get; set; }
        public string created_by { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
    }
}
