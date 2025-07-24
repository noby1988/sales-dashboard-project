import { AuthState } from './auth/auth.state';
import { SalesState } from './sales/sales.state';

export interface AppState {
  auth: AuthState;
  sales: SalesState;
}
