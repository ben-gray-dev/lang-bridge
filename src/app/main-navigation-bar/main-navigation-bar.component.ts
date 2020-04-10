import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-navigation-bar',
  templateUrl: './main-navigation-bar.component.html',
  styleUrls: ['./main-navigation-bar.component.scss']
})
export class MainNavigationBarComponent implements OnInit {
  loggedIn: Boolean = false;
  currentBackgroundColor: String = 'transparent';
  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  goToLogin() {
    this.router.navigate(['login'])
  }

}
