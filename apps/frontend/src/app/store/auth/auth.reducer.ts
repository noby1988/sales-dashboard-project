import { createReducer, on } from '@ngrx/store';
import { AuthState, initialState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialState,

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    loading: false,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error.message || 'Login failed',
  })),

  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    loading: true,
  })),

  on(AuthActions.logoutSuccess, () => ({
    ...initialState,
  })),

  // Token Verification
  on(AuthActions.verifyToken, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.verifyTokenSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false,
    error: null,
  })),

  on(AuthActions.verifyTokenFailure, (state) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
  })),

  // Load User from Storage
  on(AuthActions.loadUserFromStorage, (state) => ({
    ...state,
    loading: true,
  })),

  on(AuthActions.loadUserFromStorageSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    loading: false,
    error: null,
  })),

  on(AuthActions.loadUserFromStorageFailure, (state) => ({
    ...state,
    loading: false,
  })),

  // Reset State
  on(AuthActions.resetAuthState, () => initialState)
);
