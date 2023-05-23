import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {User} from "../utils/models";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn:boolean;
  user!: User;

  constructor(private authService: AuthService) {
    this.isLoggedIn = false;
  }

  ngOnInit(): void {
    this.authService.userObservable$.subscribe((user: User) => {
      this.isLoggedIn = !!user?.id;
      return this.user = user;
    });
  }

  logOut(): void{
    this.authService.logout();
  }
}
