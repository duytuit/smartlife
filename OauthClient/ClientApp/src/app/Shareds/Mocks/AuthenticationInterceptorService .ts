import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from '../Core/authentication/auth.service';
@Injectable()
  export class AuthenticationInterceptorService implements HttpInterceptor {
    constructor( private authService: AuthService) {}
    intercept(
      request: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      const accessToken: string = this.authService.authorizationHeaderValue;
      // Set headers for requests that require authorization.
      if (accessToken) {
        const authenticatedRequest = request.clone({
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'Authorization': accessToken
              })
        });
        // Request with authorization headers
        return next.handle(authenticatedRequest);
      } else {
        // Request without authorization header
        return next.handle(request);
      }
    }
  }
  export let AuthProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: AuthenticationInterceptorService,
    multi: true
};