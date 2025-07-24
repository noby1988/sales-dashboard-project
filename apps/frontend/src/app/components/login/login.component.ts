import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from '../../store/auth/auth.actions';
import {
  selectAuthLoading,
  selectAuthError,
} from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginData = {
    username: '',
    password: '',
  };
  private store = inject(Store);
  private authService = inject(AuthService);

  isLoading$ = this.store.select(selectAuthLoading);
  errorMessage$ = this.store.select(selectAuthError);

  ngOnInit() {
    // Load user from storage on component init
    this.store.dispatch(AuthActions.loadUserFromStorage());
  }

  onSubmit() {
    if (!this.loginData.username || !this.loginData.password) {
      return;
    }

    this.store.dispatch(
      AuthActions.login({
        username: this.loginData.username,
        password: this.loginData.password,
      })
    );
  }
}
