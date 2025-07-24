import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

// Feature Selector
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// User Selectors
export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const selectToken = createSelector(
  selectAuthState,
  (state) => state.token
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

// Computed Selectors
export const selectUserName = createSelector(
  selectUser,
  (user) => user?.name || user?.username || 'User'
);

export const selectUserRole = createSelector(
  selectUser,
  (user) => user?.role || 'user'
);

export const selectHasAuthError = createSelector(
  selectAuthError,
  (error) => !!error
);
