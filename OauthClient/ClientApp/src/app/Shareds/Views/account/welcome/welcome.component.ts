import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/Shareds/Core/authentication/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, OnDestroy {
  name: string;
  error: boolean;
  isAuthenticated: boolean;
  subscription: Subscription;
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  async ngOnInit() {
    // check for error
    if (this.route.snapshot.fragment.indexOf('error') >= 0) {
      this.error = true;
      return;
    }

    await this.authService.completeAuthentication()
    this.subscription = this.authService.authNavStatus$.pipe().subscribe(status => this.isAuthenticated = status);
    // this.name = this.authService.name;
    if (this.isAuthenticated) {
      this.router.navigate(['/home/dashboard']);
    }

  }
  Login() {
    this.authService.login();
  }
  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscription.unsubscribe();
  }
}
