import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { devicemqtt } from '../Models/device.mqtt';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeviceMqttService {
  public Api: string = environment.SmartBuildingapiUrl+"api/device";
  public showSpinner: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public showSpinnerTable: BehaviorSubject<boolean> = new BehaviorSubject(true);
  
  constructor(private http: HttpClient) {
   }
  GetDeviceMqtt(keyword:string,pageSize:number,page:number):Observable<devicemqtt[]>{
    // this.showSpinner.next(true);
    let url = `${this.Api}?keyword=${keyword}&pageSize=${pageSize}&page=${page}`
    if(keyword==null)
    {
      url = `${this.Api}?&pageSize=${pageSize}&page=${page}`
    }
    return this.http.get<devicemqtt[]>(url).pipe(
      tap(response => {
        this.showSpinner.next(false)
        this.showSpinnerTable.next(false)
      }
      ,
        (error: any) =>{
          this.showSpinner.next(false)
          this.showSpinnerTable.next(false)
        } ));
  }
  DeleteDeviceMqtt(id:string):Observable<any>{
    const url=`${this.Api}/${id}`;
    return this.http.delete(url);
  }
  AddDeviceMqtt(devicemqtt:any[]):Observable<any[]>{
    return this.http.post<any[]>(this.Api,devicemqtt);
  }
  UpdateDeviceMqtt(devicemqtt:devicemqtt):Observable<devicemqtt>
  {
    return this.http.put<devicemqtt>(this.Api,devicemqtt);
  }
}
