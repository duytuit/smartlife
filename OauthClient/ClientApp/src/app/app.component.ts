import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppService } from './Shareds/Services/app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './Shareds/Core/authentication/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor()
  {
  }
   ngOnInit() {
   }
}
