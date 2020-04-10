import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MainNavigationBarComponent } from './main-navigation-bar/main-navigation-bar.component';
import { isLoggedIn } from './auth/auth-guard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'LangBridge';
  scrolledPastLanding: Boolean = false;

  scrollListener = _ => {

    const currOffset = window.pageYOffset;
    if (currOffset >= window.innerHeight) {
      this.scrolledPastLanding = true;
      this.navBar.currentBackgroundColor = '#32a6a8'
    } else {
      this.scrolledPastLanding = false;
      this.navBar.currentBackgroundColor = 'transparent';
    }
  }

  @ViewChild(MainNavigationBarComponent) navBar: MainNavigationBarComponent

  routesWithBar: String[] = [
    'login',
    'register',
    'learn',
    'profile',
    'stats',
    'terms-of-service',
    'resetPassword',
    'forgotPassword',
    'privacy'
  ]

  constructor(public router: Router) {

  }
  ngOnInit(): void {
    this.router.events.subscribe((route: any) => {
      if (route.url) {
        if (this.routesWithBar.includes(route.url.split('/')[1]) || this.scrolledPastLanding) {
          this.navBar.currentBackgroundColor = '#32a6a8';
          window.removeEventListener('scroll', this.scrollListener)
        } else {
          this.navBar.currentBackgroundColor = 'transparent';
          window.addEventListener('scroll', this.scrollListener)
        }
      }
    })

  }

  ngAfterViewInit() {
    isLoggedIn.subscribe(val => {
      this.navBar.loggedIn = val
    });
  }




}
