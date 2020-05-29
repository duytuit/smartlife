import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../../Services/app.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from '../../Core/authentication/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  name: string;
  error: boolean;
  isAuthenticated: boolean;
  subscription:Subscription;
  
  constructor(private appService: AppService,private router: Router,private authService:AuthService, private route: ActivatedRoute) {}
  getClasses() {
    const classes = {
      'pinned-sidebar': this.appService.getSidebarStat().isSidebarPinned,
      'toggeled-sidebar': this.appService.getSidebarStat().isSidebarToggeled
    }
    return classes;
  }
  toggleSidebar() {
    this.appService.toggleSidebar();
  }
    ngOnInit() {
    
    // await this.authService.completeAuthentication();  
    // this.subscription = this.authService.authNavStatus$.subscribe(status => this.isAuthenticated = status);
    // this.name = this.authService.name;
    // if(this.isAuthenticated)
    // {
    //   this.router.navigate(['/dashboard']); 
    // }
   
  }
  // ngOnDestroy() {
  //   // prevent memory leak when component is destroyed
  //   this.subscription.unsubscribe();
  // }
}
