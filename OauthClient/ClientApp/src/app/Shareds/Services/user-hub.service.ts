import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { userHub } from '../Models/user-hub';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserHubService {

  public Api: string = environment.SmartBuildingapiUrl+"api/user_hub";
  public ApiAccount: string = environment.SmartBuildingapiUrl+"api/user_hub/user";
  public showSpinner: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public showSpinnerUserHub: BehaviorSubject<boolean> = new BehaviorSubject(true);
  constructor(private http: HttpClient) {
   }
  GetUserHub(keyword:string):Observable<userHub[]>{
    let url = `${this.Api}?keyword=${keyword}`
    return this.http.get<userHub[]>(url).pipe(
      tap(response => this.showSpinnerUserHub.next(false), (error: any) => this.showSpinnerUserHub.next(false))
    );
  }
  GetAccount(keyword:string,pageSize:number,page:number):Observable<any[]>{
    let url = `${this.ApiAccount}?keyword=${keyword}&pageSize=${pageSize}&page=${page}`
    if(keyword==null)
    {
      url = `${this.ApiAccount}?&pageSize=${pageSize}&page=${page}`
    }
    return this.http.get<any[]>(url).pipe(
      tap(response => this.showSpinner.next(false), (error: any) => this.showSpinner.next(false))
    );
  }
  DeleteUserHub(id:string):Observable<any>{
    const url=`${this.Api}/${id}`;
    return this.http.delete(url);
  }
  AddUserHub(userhub:any[]):Observable<any[]>{
    return this.http.post<any[]>(this.Api,userhub);
  }
  AddAccount(account:any[]):Observable<any[]>{
    return this.http.post<any[]>(this.ApiAccount,account);
  }
  DeleteAccount(id:string):Observable<any>{
    const url=`${this.ApiAccount}/${id}`;
    return this.http.delete(url);
  }
  UpdateUserHub(userhub:userHub):Observable<userHub>
  {
    return this.http.put<userHub>(this.Api,userhub);
  }
}
