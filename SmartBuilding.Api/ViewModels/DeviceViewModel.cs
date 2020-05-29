using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartBuilding.Api.ViewModels
{
    public class DeviceViewModel
    {
        public Guid id { get; set; }
        public string name_device { get; set; }
        public string code_device { get; set; }
        public string device_type { get; set; }
        public string number_switch { get; set; }
        public Guid hubid { get; set; }
        public string hub_code { get; set; }
        public string hub_password_client { get; set; }
        public string hub_room_name { get; set; }
        public string icon { get; set; }
        public string note { get; set; }
        public bool status { get; set; }
        public Guid userid { get; set; }
    }
}
