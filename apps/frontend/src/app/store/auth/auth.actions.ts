import { createAction, props } from '@ngrx/store';
import { User } from '../../services/auth.service';

// Login Actions
export const login = createAction(
  '[Auth] Login',
  props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: any }>()
);

// Logout Actions
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

// Token Verification Actions
export const verifyToken = createAction('[Auth] Verify Token');

export const verifyTokenSuccess = createAction(
  '[Auth] Verify Token Success',
  props<{ user: User }>()
);

export const verifyTokenFailure = createAction('[Auth] Verify Token Failure');

// Load User from Storage
export const loadUserFromStorage = createAction(
  '[Auth] Load User From Storage'
);

export const loadUserFromStorageSuccess = createAction(
  '[Auth] Load User From Storage Success',
  props<{ user: User; token: string }>()
);

export const loadUserFromStorageFailure = createAction(
  '[Auth] Load User From Storage Failure'
);

// Reset Auth State
export const resetAuthState = createAction('[Auth] Reset State');
