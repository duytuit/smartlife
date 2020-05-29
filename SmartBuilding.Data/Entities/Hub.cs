using System;
using System.Collections.Generic;
using System.Text;

namespace SmartBuilding.Data.Entities
{
    public class Hub
    {
        public Guid id { get; set; }
        public string code_hub { get; set; }
        public string clientid { get; set; }
        public string password_client { get; set; }
        public Guid roomid { get; set; }
        public string room_name { get; set; }
        public string note { get; set; }
        public bool status { get; set; }
        public Guid userid_by { get; set; }
        public string created_by { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public virtual ICollection<Device> Device { get; set; }
        public virtual ICollection<User_Hub> User_Hub { get; set; }
    }
}
