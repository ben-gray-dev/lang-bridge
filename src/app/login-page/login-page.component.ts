import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { PasswordValidator } from './../password.validator';
import { ApiService } from '../api.service';
import { SignUpEntry, ACCOUNT_CREATION_SUCCESS_MSG } from '../api.service'; 
import { Router } from '@angular/router';
import { RecaptchaComponent } from 'ng-recaptcha';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);
    return (invalidCtrl || invalidParent) && control['_parent'].hasError('notSame');
  }
}


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  signUp: boolean = false;
  logInFormCtl: FormGroup;
  matcher = new MyErrorStateMatcher();
  resultProcessed = false;
  resultMessage: String;
  registerDisabled: Boolean = true;


  @ViewChild(RecaptchaComponent) captchaRef: RecaptchaComponent;
  constructor(private apiService: ApiService, public router: Router ) { 
    
    this.logInFormCtl = new FormGroup({
       
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required,
      PasswordValidator.strong]),
      confirmPass: new FormControl('', [Validators.required]),
      termsOfService: new FormControl('', [(control) => {    
        return !control.value ? { 'required': true } : null;
      }]),
      recaptchaReactive: new FormControl(null, Validators.required)
      
    }, {validators: this.checkPasswords});

  }

  ngOnInit(): void {

    this.logInFormCtl.statusChanges.subscribe(status => {
      this.registerDisabled = status != 'VALID';
    })
  }


  onSubmit(formVals: any) {
    this.apiService.signUp({
      name: formVals.name,
      email: formVals.email,
      password: formVals.password
    } as SignUpEntry).subscribe(res => {
      localStorage.setItem('token', res['token'])
      this.resultMessage =  ACCOUNT_CREATION_SUCCESS_MSG;
      this.router.navigate(['learn']);
    }, err => {
      console.log(err);
      this.resultMessage =  err;
    })
    
    
    
  }


  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPass').value;

    return pass === confirmPass ? null : { notSame: true }     
  }

  resolved(captchaResponse: string) {
    if (captchaResponse != null) {
      this.apiService.sendToken(captchaResponse).subscribe(
        data => {
          if (data['success'] === true) {
            return true
          }
          this.captchaRef.reset()
        },
        err => {
          this.captchaRef.reset()
        },
        () => {}
      );

    }
  }
}
