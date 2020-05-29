using System;
using System.Collections.Generic;
using System.Text;

namespace SmartBuilding.Data.Entities
{
    public class Device
    {
        public Guid id { get; set; }
        public string name_device { get; set; }
        public string code_device { get; set; }
        public string device_type { get; set; }
        public string number_switch { get; set; }
        public Guid hubid { get; set; }
        public virtual Hub Hub { get; set; }
        public string hub_code { get; set; }
        public string hub_password_client { get; set; }
        public string hub_room_name { get; set; }
        public string icon { get; set; }
        public string note { get; set; }
        public bool status { get; set; }
        public Guid userid_by { get; set; }
        public string created_by { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
    }
}
