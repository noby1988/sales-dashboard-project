import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginData = {
    username: '',
    password: '',
  };
  isLoading = false;
  errorMessage = '';

  router = inject(Router);

  async onSubmit() {
    if (!this.loginData.username || !this.loginData.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      // For now, we'll use a simple authentication
      // In a real app, this would call your backend API
      if (
        this.loginData.username === 'admin' &&
        this.loginData.password === 'password'
      ) {
        // Store authentication token/user info
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem(
          'user',
          JSON.stringify({ username: this.loginData.username })
        );

        // Navigate to home page
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = 'Invalid username or password';
      }
    } catch {
      this.errorMessage = 'Login failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
