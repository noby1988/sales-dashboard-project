import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    // First check if we have a token
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return of(false);
    }

    // Verify the token with the backend
    return this.authService.verifyToken().pipe(
      map((response) => {
        if (response.valid) {
          return true;
        } else {
          this.authService.logout();
          return false;
        }
      }),
      catchError(() => {
        this.authService.logout();
        return of(false);
      })
    );
  }
}
