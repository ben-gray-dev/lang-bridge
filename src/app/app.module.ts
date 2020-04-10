import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { MainNavigationBarComponent } from './main-navigation-bar/main-navigation-bar.component';
import { StyleDirective } from './style.directive';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LearnComponent } from './learn/learn.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { StatsComponent } from './stats/stats.component';
import { BodyViewComponent } from './body-view/body-view.component';
import { DatePipe } from '@angular/common';
import { FlashcardComponent } from './learn/flashcard/flashcard.component';
import { LangSelectComponent } from './learn/lang-select/lang-select.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { TooltipModule } from 'ng2-tooltip-directive';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AnimateOnScrollModule } from 'ng2-animate-on-scroll';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { FooterComponent } from './footer/footer.component';
import {SlideshowModule} from 'ng-simple-slideshow';
import { MatKeyboardModule, MAT_KEYBOARD_LAYOUTS} from 'angular-onscreen-material-keyboard';
import {MatDialogModule} from '@angular/material/dialog';
import { ReportDialogComponent } from './report-dialog/report-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { CovalentBaseEchartsModule } from '@covalent/echarts/base';
import { CovalentBarEchartsModule } from '@covalent/echarts/bar';
import { CovalentTooltipEchartsModule } from '@covalent/echarts/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginPageComponent,
    MainNavigationBarComponent,
    StyleDirective,
    LearnComponent,
    RegisterComponent,
    ProfileComponent,
    StatsComponent,
    BodyViewComponent,
    FlashcardComponent,
    LangSelectComponent,
    TermsOfServiceComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    PrivacyPolicyComponent,
    FooterComponent,
    ReportDialogComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AnimateOnScrollModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatKeyboardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,

    CovalentBaseEchartsModule,
    CovalentBarEchartsModule,
    CovalentTooltipEchartsModule,
    


    FontAwesomeModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    TooltipModule,
    SlideshowModule,
    
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
