import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './../app/landing-page/landing-page.component';
import { LoginPageComponent } from './../app/login-page//login-page.component';
import { RegisterComponent } from './register/register.component';
import { 
  AuthGuardService as AuthGuard 
} from './auth/auth-guard.service';
import { LearnComponent } from './learn/learn.component';
import { ProfileComponent } from './profile/profile.component';
import { StatsComponent } from './stats/stats.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

const routes: Routes = [
  { path: 'landing', component: LandingPageComponent },
  { path: 'login', component: RegisterComponent },
  { path: 'register', component: LoginPageComponent },
  { path: 'learn', component: LearnComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'stats', component: StatsComponent, canActivate: [AuthGuard] },
  { path: 'terms-of-service', component: TermsOfServiceComponent },
  { path: 'privacy', component: PrivacyPolicyComponent },
  { path: 'resetPassword/:token', component: ResetPasswordComponent },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  { path: '**', redirectTo: 'landing' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
