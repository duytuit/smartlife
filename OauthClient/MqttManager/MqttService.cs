using MQTTnet;
using MQTTnet.Client.Connecting;
using MQTTnet.Client.Disconnecting;
using MQTTnet.Client.Options;
using MQTTnet.Client.Receiving;
using MQTTnet.Extensions.ManagedClient;
using MQTTnet.Formatter;
using MQTTnet.Protocol;
using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace OauthClient.MqttManager
{
    public class MqttService
    {
        private ConcurrentDictionary<string, WebSocket> _users = new ConcurrentDictionary<string, WebSocket>();
        private IManagedMqttClient _managedMqttClient;
        //private IConfiguration _config;

        public async Task StartClient()
        {
            var mqttFactory = new MqttFactory();
            var tlsOptions = new MqttClientTlsOptions
            {
                UseTls = false,
                IgnoreCertificateChainErrors = true,
                IgnoreCertificateRevocationErrors = true,
                AllowUntrustedCertificates = true
            };

            var options = new MqttClientOptions
            {
                ClientId = Guid.NewGuid().ToString(),// add new clientid

                ProtocolVersion = MqttProtocolVersion.V311,
                ChannelOptions = new MqttClientTcpOptions
                {
                    Server = "45.124.94.254",
                    Port = 1883,
                    TlsOptions = tlsOptions
                }
            };

            if (options.ChannelOptions == null)
            {
                throw new InvalidOperationException();
            }


            options.Credentials = new MqttClientCredentials
            {
                Username = "an12345",
                Password = Encoding.UTF8.GetBytes("xiaomi@") // add password clientid
            };


            options.CleanSession = true;
            options.KeepAlivePeriod = TimeSpan.FromSeconds(50);
            _managedMqttClient = mqttFactory.CreateManagedMqttClient();
            _managedMqttClient.UseApplicationMessageReceivedHandler((Action<MqttApplicationMessageReceivedEventArgs>)this.HandleReceivedApplicationMessage);
            _managedMqttClient.ConnectedHandler = new MqttClientConnectedHandlerDelegate((Action<MqttClientConnectedEventArgs>)OnConnected);
            _managedMqttClient.DisconnectedHandler = new MqttClientDisconnectedHandlerDelegate((Action<MqttClientDisconnectedEventArgs>)OnDisconnected);
            _managedMqttClient.ApplicationMessageReceivedHandler = new MqttApplicationMessageReceivedHandlerDelegate((Action<MqttApplicationMessageReceivedEventArgs>)this.OnSubscriberMessageReceived);

            try
            {
                await _managedMqttClient.StartAsync(
                new ManagedMqttClientOptions
                {
                    ClientOptions = options
                });
            }
            catch
            {
                await _managedMqttClient.StopAsync();
            }
        }
        private void HandleReceivedApplicationMessage(MqttApplicationMessageReceivedEventArgs eventArgs)
        {
            var item = $"Timestamp: {DateTime.Now.ToString("yyyy-MM-dd HH:mm")} | Topic: {eventArgs.ApplicationMessage.Topic} | Payload: {eventArgs.ApplicationMessage.ConvertPayloadToString()} | QoS: {eventArgs.ApplicationMessage.QualityOfServiceLevel}";
            var message = new SocketMessage<string>
            {
                MessageType = "subcribe",
                Payload = item
            };
            //await Send(message.ToJson(), _users.Values.ToArray());
        }
        private void OnConnected(MqttClientConnectedEventArgs x)
        {
            // await Send("Đã Kết Nối!", _users.Values.ToArray());
        }
        private void OnDisconnected(MqttClientDisconnectedEventArgs x)
        {
            // await Send("Mất Kết Nối!", _users.Values.ToArray());
        }
        private async void OnSubscriberMessageReceived(MqttApplicationMessageReceivedEventArgs x)
        {
            // var item = $"Timestamp: {DateTime.Now.ToString("yyyy-MM-dd HH:mm")} | Topic: {x.ApplicationMessage.Topic} | Payload: {x.ApplicationMessage.ConvertPayloadToString()} | QoS: {x.ApplicationMessage.QualityOfServiceLevel}";

            var item = JsonConvert.SerializeObject(new
            {
                Timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm"),
                Topic_result = x.ApplicationMessage.Topic,
                Payload = x.ApplicationMessage.ConvertPayloadToString(),
                QoS = x.ApplicationMessage.QualityOfServiceLevel
            });
            var message = new SocketMessage<string>
            {
                MessageType = "subcribe",
                Payload = item
            };
            await Send(message.ToJson(), _users.Values.ToArray());
        }
        public async Task AddUser(WebSocket socket)
        {
            try
            {
                var name = GenerateName();
                var userAddedSuccessfully = _users.TryAdd(name, socket);
                while (!userAddedSuccessfully)
                {
                    name = GenerateName();
                    userAddedSuccessfully = _users.TryAdd(name, socket);
                }

                GiveUserTheirName(name, socket).Wait();
                AnnounceNewUser(name).Wait();
                // StartClient().Wait();
                while (socket.State == WebSocketState.Open)
                {
                    var buffer = new byte[1024 * 4];
                    WebSocketReceiveResult socketResponse;
                    var package = new List<byte>();
                    do
                    {
                        socketResponse = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                        package.AddRange(new ArraySegment<byte>(buffer, 0, socketResponse.Count));
                    } while (!socketResponse.EndOfMessage);
                    var bufferAsString = System.Text.Encoding.UTF8.GetString(package.ToArray());
                    if (!string.IsNullOrEmpty(bufferAsString))
                    {
                        DataTable dt = (DataTable)JsonConvert.DeserializeObject(bufferAsString, typeof(DataTable));
                        await HandleRequestSocket(dt);
                    }
                }
                await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
            }
            catch
            {

            }
        }
        private async Task HandleRequestSocket(DataTable request)
        {

            var Name = request.Rows[0]["Name"].ToString();
            if (Name == "Subcriber")
            {
                try
                {
                    await _managedMqttClient.SubscribeAsync(new TopicFilterBuilder().WithTopic(request.Rows[0]["Topic"].ToString()).Build());
                }
                catch
                {

                }
            }
            if (Name == "Publisher")
            {
                try
                {
                    var payload = Encoding.UTF8.GetBytes(request.Rows[0]["Messager"].ToString());
                    var message = new MqttApplicationMessageBuilder().WithTopic(request.Rows[0]["Topic"].ToString()).WithPayload(payload).WithQualityOfServiceLevel(MqttQualityOfServiceLevel.AtLeastOnce).Build();

                    if (_managedMqttClient != null)
                    {
                        await _managedMqttClient.PublishAsync(message);
                    }
                }
                catch
                {

                }
            }

        }
        private async Task Send(string message, params WebSocket[] socketsToSendTo)
        {
            var sockets = socketsToSendTo.Where(s => s.State == WebSocketState.Open);
            foreach (var theSocket in sockets)
            {
                var stringAsBytes = System.Text.Encoding.ASCII.GetBytes(message);
                var byteArraySegment = new ArraySegment<byte>(stringAsBytes, 0, stringAsBytes.Length);
                await theSocket.SendAsync(byteArraySegment, WebSocketMessageType.Text, true, CancellationToken.None);
            }
        }
        private string GenerateName()
        {
            var prefix = "WebUser";
            Random ran = new Random();
            var name = prefix + ran.Next(1, 1000);
            while (_users.ContainsKey(name))
            {
                name = prefix + ran.Next(1, 1000);
            }
            return name;
        }

        private async Task SendAll(string message)
        {
            await Send(message, _users.Values.ToArray());
        }

        private async Task GiveUserTheirName(string name, WebSocket socket)
        {
            var message = new SocketMessage<string>
            {
                MessageType = "name",
                Payload = name
            };
            await Send(message.ToJson(), socket);
        }

        private async Task AnnounceNewUser(string name)
        {
            var message = new SocketMessage<string>
            {
                MessageType = "announce",
                Payload = $"{name} has joined"
            };
            await SendAll(message.ToJson());
        }
    }
}
