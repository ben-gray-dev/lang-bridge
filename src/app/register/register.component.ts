import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService, LOGIN_SUCCESS_MSG, LOGIN_FAILURE_MSG,  LoginEntry } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  signUp: boolean = false;
  logInFormCtl: FormGroup;
  resultProcessed = false;
  resultMessage: String;
  logInDisabled: Boolean = true;
  constructor(private apiService: ApiService, public router: Router) { 
    
    this.logInFormCtl = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
      
    });

  }

  ngOnInit(): void {

    this.logInFormCtl.statusChanges.subscribe(status => {
      this.logInDisabled = status != 'VALID';
    })
  }


  onSubmit(formVals: any) {
    this.apiService.login({
      email: formVals.email,
      password: formVals.password
    } as LoginEntry).subscribe(res => {
      localStorage.setItem('token', res['token']);
      this.router.navigate(['learn'])
      this.resultMessage =  LOGIN_SUCCESS_MSG;
    }, err => {
      this.resultMessage =  LOGIN_FAILURE_MSG;
    })
    
    
    
  }

}
