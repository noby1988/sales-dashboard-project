import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Login Effect
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ username, password }) =>
        this.authService.login({ username, password }).pipe(
          map((response) =>
            AuthActions.loginSuccess({
              user: response.user,
              token: response.access_token,
            })
          ),
          catchError((error) => of(AuthActions.loginFailure({ error })))
        )
      )
    )
  );

  // Login Success Effect - Navigate to home
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/home']))
      ),
    { dispatch: false }
  );

  // Logout Effect
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.authService.logout();
      }),
      map(() => AuthActions.logoutSuccess())
    )
  );

  // Logout Success Effect - Navigate to login
  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => this.router.navigate(['/login']))
      ),
    { dispatch: false }
  );

  // Verify Token Effect
  verifyToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.verifyToken),
      switchMap(() =>
        this.authService.verifyToken().pipe(
          map((response) =>
            AuthActions.verifyTokenSuccess({ user: response.user })
          ),
          catchError(() => of(AuthActions.verifyTokenFailure()))
        )
      )
    )
  );

  // Load User from Storage Effect
  loadUserFromStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUserFromStorage),
      map(() => {
        const token = this.authService.getToken();
        const user = this.authService.getCurrentUser();

        if (token && user) {
          return AuthActions.loadUserFromStorageSuccess({ user, token });
        } else {
          return AuthActions.loadUserFromStorageFailure();
        }
      })
    )
  );
}
