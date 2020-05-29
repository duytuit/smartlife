import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MqttSocketService {
  private socket: WebSocket;
  subcribe$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  announcement$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  name$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private name: string;
  constructor() { }
  startSocket() {
    this.socket = new WebSocket(environment.Socket_Mqtt);
    this.socket.addEventListener("open", (ev => {
     // console.log('opened')
    }));
    this.socket.addEventListener("message", (ev => {
     // console.log(ev.data)
      if (ev.data) {
        var messageBox = JSON.parse(ev.data);
      }
      //console.log('message object', messageBox);
      switch (messageBox.MessageType) {
        case "name":
          this.name = messageBox.Payload;
          this.name$.next(this.name);
          break;
        case "announce":
          this.announcement$.next(messageBox.Payload);
          break;
        case "subcribe":
          var obj = JSON.parse(messageBox.Payload);
          this.subcribe$.next(obj);
          break;
        default:
          break;
      }
    }));
  }

  sendMqttRequest(req) {
    //req.Name = this.name;
    var requestAsJson = JSON.stringify(req);
    this.socket.send(requestAsJson);
  }
}
