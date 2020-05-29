import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/Shareds/Core/authentication/auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formdata = new FormGroup({
    uname: new FormControl("", Validators.compose([
      Validators.required,
      Validators.minLength(6)
    ])),
    passwd: new FormControl("")
  });
  constructor(private authService:AuthService,private router: Router ) { }

  ngOnInit() {
  }
  onClickSubmit(data) {
    let dataLogIn = [{
      "username": data.uname,
      "password": data.passwd
    }]
    this.authService.loginapi(dataLogIn[0]).subscribe(results => {
        if(results['success']==true)
        {
          var obj = JSON.parse(results['data']);
          localStorage.setItem('access_token', obj['access_token']);
          localStorage.setItem('token_type', obj['token_type']);
          localStorage.setItem('username', results['username']);
          localStorage.setItem('userid', results['userid']);
        } 
    })  
  }
}
