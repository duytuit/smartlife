import { Injectable } from '@angular/core';
import { BaseService } from '../../Services/base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TopSecretService extends BaseService {

 
  constructor(private http: HttpClient) {    
    super();      
  }

  fetchTopSecretData(token: string) {   
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': token
      })
    };

    return this.http.get(environment.SmartBuildingapiUrl + '/values', httpOptions).pipe(catchError(this.handleError));
  }
}
