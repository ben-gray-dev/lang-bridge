import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordCtl: FormGroup;
  submitEmailDisabled: Boolean = true;
  resultMessage: String;
  successfulMessage: Boolean = true;

  constructor(private apiService: ApiService) {
    this.forgotPasswordCtl = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required])
    });
  }

  ngOnInit(): void {

    this.forgotPasswordCtl.statusChanges.subscribe(status => {
      this.submitEmailDisabled = status != 'VALID';
    })
  }

  onSubmit(email) {
    this.successfulMessage = true
    this.submitEmailDisabled = true
    this.resultMessage = 'Please wait, attempting to send email to reset password...'
    this.apiService.sendForgotPasswordEmail(email.email).subscribe(res => {
      this.resultMessage = 'Password reset email sent successfully'
      this.forgotPasswordCtl.controls.email.patchValue('')
    }, err => {
      this.successfulMessage = false
      console.log(err)
      switch (err) {
        case 'email not found':
          this.resultMessage = 'No accounts associated with that email address.'
          break
        default:
          this.resultMessage = 'Unexpected internal server error sending email to that address.'
      }
    })
  }

}
