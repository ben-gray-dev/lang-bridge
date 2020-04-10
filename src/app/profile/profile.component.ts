import { Component, OnInit, AfterViewInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService, ProfileInfo, PROFILE_UPDATE_SUCCESS_MSG, PROFILE_UPDATE_FAILURE_MSG } from '../api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  jwtHelper = new JwtHelperService();
  editInfoFormCtl: FormGroup;
  profileInfo: ProfileInfo;
  statusMessage: String;
  errorMessage: String;
  saveDisabled = true;
  constructor(private apiService: ApiService, private datepipe: DatePipe) {


  }
  ngOnInit(): void {
    this.apiService.getProfileInfo().subscribe(
      res => {
        this.profileInfo = {
          name: res.name,
          email: res.email,
          bio: res.bio,
          lastLogIn: this.jwtHelper.decodeToken(res.tokens[res.tokens.length - 1].token).iat * 1000
        }
        this.populateForm();
        this.editInfoFormCtl.valueChanges.subscribe(res => this.saveDisabled = !(this.checkIfChangeOfValues(res)));
      },
      err => {
        console.log(err);
      });



  }

  populateForm() {
    this.editInfoFormCtl = new FormGroup({
      email: new FormControl(this.profileInfo.email, [Validators.email, Validators.required]),
      name: new FormControl(this.profileInfo.name, [Validators.required]),
      lastLogIn: new FormControl({
        value: this.datepipe.transform(this.profileInfo.lastLogIn, 'yyyy-MM-dd HH:mm:ss OOOO'),
        disabled: true
      }),
      bio: new FormControl(this.profileInfo.bio)
    });
  }

  checkIfChangeOfValues(formVals) {
    let hasChanged = false;
    Object.keys(formVals).map(k => {
      if (formVals[k] !== this.profileInfo[k]) {
        hasChanged = true;
      }
    });
    return hasChanged;
  }


  onSave() {
    const formVals = this.editInfoFormCtl.value;
    const pInfoToSend = {
      name: formVals.name,
      email: formVals.email,
      bio: formVals.bio
    } as ProfileInfo;
    this.profileInfo = {...pInfoToSend, 'lastLogIn': this.profileInfo.lastLogIn}
    this.apiService.saveProfileInfo(pInfoToSend).subscribe(_ => {
      this.saveDisabled = true;
      this.errorMessage = undefined;
      this.statusMessage = PROFILE_UPDATE_SUCCESS_MSG;
    },
    err => {
      this.statusMessage = undefined;
      this.errorMessage = PROFILE_UPDATE_FAILURE_MSG;
      console.log(err);
    });
    // this.apiService.login({
    //   email: formVals.email,
    //   password: formVals.password
    // } as ProfileInfo).subscribe(res => {
    //   localStorage.setItem('token', res['token']);
    //   this.router.navigate(['learn'])
    //   this.resultMessage =  LOGIN_SUCCESS_MSG;
    // }, err => {
    //   this.resultMessage =  LOGIN_FAILURE_MSG;
    // })



  }

}
