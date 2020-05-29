using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OauthClient.Models
{
    public class BaseApiResponse
    {
        [JsonProperty(PropertyName = "success")]
        public string success { get; set; }

        [JsonProperty(PropertyName = "messages")]
        public List<string> messages { get; set; }
    }
    public class BaseDataResponse<T> : BaseApiResponse
    {
        public T data { get; set; }
    }
}
