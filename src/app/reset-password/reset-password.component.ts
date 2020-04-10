import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PasswordValidator } from '../password.validator';
import { MyErrorStateMatcher } from '../login-page/login-page.component';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  token: string;
  sub: Subscription;
  resetPasswordCtl: FormGroup;
  matcher = new MyErrorStateMatcher();
  resetDisabled: Boolean = true;
  resultMessage: String;
  successfulMessage: Boolean = true;

  constructor(private route: ActivatedRoute, private apiService: ApiService, public router: Router) {
    this.resetPasswordCtl = new FormGroup({
      password: new FormControl('', [Validators.required,
      PasswordValidator.strong]),
      confirmPass: new FormControl('', [Validators.required]),
    }, { validators: this.checkPasswords })
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.token = params['token']; // (+) converts string 'id' to a number
      console.log(this.token)
      // In a real app: dispatch action to load the details here.
    });

    this.resetPasswordCtl.statusChanges.subscribe(status => {
      this.resetDisabled = status != 'VALID' || !this.token;
    })
  }


  onSubmit(formVals: any) {
    console.log(formVals)

    this.apiService.resetPassword(formVals.password, this.token).subscribe(res => {
      this.successfulMessage = true
      this.resultMessage = 'Password successfully reset'
      this.router.navigate(['login'])

    }, err => {
      this.successfulMessage = false
      this.resultMessage = err
    })

  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPass').value;

    return pass === confirmPass ? null : { notSame: true }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
