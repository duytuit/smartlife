import { Component, OnInit } from '@angular/core';
import { AppService } from '../../Services/app.service';
import { async } from '@angular/core/testing';
import { AuthService } from '../../Core/authentication/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private appService: AppService,private authService:AuthService,) { }
  isCollapsed = true;
  ngOnInit() {
  }

  toggleSidebarPin() {
    this.appService.toggleSidebarPin();
  }
  toggleSidebar() {
    this.appService.toggleSidebar();
  }
  async Logout(){
      await this.authService.signout();   
  }
}
