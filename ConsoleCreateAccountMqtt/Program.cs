using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleCreateAccountMqtt
{
    class Program
    {
        static void Main(string[] args)
        {
            AccountClient NewAccount = new AccountClient()
            {
                clientid="sdf",
                password="dfs"
            };
            Task<string> callTask = Task.Run(() => DeleteClientId("abc2020"));
            callTask.Wait();
            string astr = callTask.Result;

            Console.WriteLine(astr);

            Console.ReadKey();
        }
        private static async Task<string> DeleteClientId(string clientId)
        {

            var userName = "tu";
            var passwd = "123";
            var url = "http://45.124.94.254:18083/api/v3/auth_clientid/"+clientId;

            using var client = new HttpClient();

            var authToken = Encoding.ASCII.GetBytes($"{userName}:{passwd}");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic",
                    Convert.ToBase64String(authToken));

            var result = await client.DeleteAsync(url);

            var content_result = await result.Content.ReadAsStringAsync();

            return content_result;
        }
        private static async Task<string> InsertClientId(AccountClient account)
        {
            var userName = "tu";
            var passwd = "123";
            var url = "http://45.124.94.254:18083/api/v3/auth_clientid";

            using var client = new HttpClient();

            var authToken = Encoding.ASCII.GetBytes($"{userName}:{passwd}");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic",
                    Convert.ToBase64String(authToken));

            var serializedNewUser = JsonConvert.SerializeObject(account);


            var content = new StringContent(serializedNewUser, Encoding.UTF8, "application/json");

            var result = await client.PostAsync(url, content);

            var content_result = await result.Content.ReadAsStringAsync();

            return content_result;
        }
        public class AccountClient
        {
            public string clientid { get; set; }
            public string password { get; set; }
        }
    }
}
