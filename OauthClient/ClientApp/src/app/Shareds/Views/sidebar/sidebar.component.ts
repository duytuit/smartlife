import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { AuthService } from '../../Core/authentication/auth.service';
import { Subscription } from 'rxjs/internal/Subscription';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements AfterViewInit, OnDestroy, OnInit {
  name: string;
  isAuthenticated: boolean =false;
  subscription:Subscription;
  constructor( private mScrollbarService: MalihuScrollbarService,private authService:AuthService) { }

  ngOnInit() {
    this.subscription = this.authService.authNavStatus$.subscribe(status => this.isAuthenticated = status);
  }
  ngAfterViewInit() {
    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        this.mScrollbarService.initScrollbar(".test-content", {  axis: 'y',
        autoHideScrollbar: true,
        theme:"dark-2",
        scrollInertia: 300})
    }
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
    this.mScrollbarService.destroy('.test-content');
  }
}
