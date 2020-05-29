import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // let g=localStorage.getItem('userid')
    // if (localStorage.getItem('userid')!=null) { return true; }
    if (this.authService.isAuthenticated()) { return true; }
   // this.authService.login();
     this.router.navigate(['']);
    // , { queryParams: { redirect: state.url }, replaceUrl: true });
    return false;
  }

}
