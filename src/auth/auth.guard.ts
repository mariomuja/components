import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

/**
 * Configuration for the shared auth guard
 */
export interface AuthGuardConfig {
  /** Local storage key to check for authentication token */
  tokenKey: string;
  /** URL to redirect to when not authenticated */
  redirectTo: string;
  /** Whether to remember the attempted URL for post-login redirect */
  rememberAttemptedUrl?: boolean;
  /** Storage key for the attempted URL */
  attemptedUrlKey?: string;
}

/**
 * Creates a reusable functional auth guard that can be configured per application.
 * This guard checks localStorage for a token and redirects to login if not found.
 * 
 * Usage in app routes:
 * ```typescript
 * import { createAuthGuard } from '@shared-components/auth';
 * 
 * export const authGuard = createAuthGuard({
 *   tokenKey: 'authToken',
 *   redirectTo: '/login',
 *   rememberAttemptedUrl: false
 * });
 * 
 * export const routes: Routes = [
 *   { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }
 * ];
 * ```
 */
export function createAuthGuard(config: AuthGuardConfig): CanActivateFn {
  return () => {
    // inject() is called here, inside the guard function during route activation
    // This is a valid injection context
    const router = inject(Router);
    
    // Check for token in localStorage
    const token = typeof localStorage !== 'undefined' 
      ? localStorage.getItem(config.tokenKey) 
      : null;

    if (token) {
      return true;
    }

    // Store the attempted URL for redirecting after login
    if (config.rememberAttemptedUrl) {
      const attemptedUrl = window.location.pathname;
      const storageKey = config.attemptedUrlKey || 'redirect_url';
      // Don't store the homepage or empty path
      if (attemptedUrl !== '/' && attemptedUrl !== '') {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem(storageKey, attemptedUrl);
        }
      }
    }

    router.navigate([config.redirectTo]);
    return false;
  };
}

