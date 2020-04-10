import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

export var isLoggedIn = new BehaviorSubject(false);

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['login']);
      isLoggedIn.next(false);
      return false;
    }
    isLoggedIn.next(true);
    return true;
  }
}