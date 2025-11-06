import { inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Configuration for the shared auth guard
 */
export interface AuthGuardConfig {
  /** URL to redirect to when not authenticated */
  loginUrl?: string;
  /** Whether to store the attempted URL for post-login redirect */
  storeAttemptedUrl?: boolean;
  /** Storage key for the attempted URL */
  attemptedUrlKey?: string;
}

/**
 * Creates a reusable auth guard that can be configured per application
 * 
 * Usage:
 * ```typescript
 * export const routes: Routes = [
 *   { 
 *     path: 'dashboard', 
 *     component: DashboardComponent, 
 *     canActivate: [createAuthGuard(authService, { loginUrl: '/login' })]
 *   }
 * ];
 * ```
 */
export function createAuthGuard(
  authService: any,
  config?: AuthGuardConfig
) {
  const defaultConfig: AuthGuardConfig = {
    loginUrl: '/login',
    storeAttemptedUrl: true,
    attemptedUrlKey: 'redirect_url'
  };

  const finalConfig = { ...defaultConfig, ...config };

  return () => {
    const router = inject(Router);

    if (authService.isAuthenticated()) {
      return true;
    }

    // Store the attempted URL for redirecting after login
    if (finalConfig.storeAttemptedUrl) {
      const attemptedUrl = window.location.pathname;
      // Don't store the homepage or empty path
      if (attemptedUrl !== '/' && attemptedUrl !== '') {
        sessionStorage.setItem(finalConfig.attemptedUrlKey!, attemptedUrl);
      }
    }

    router.navigate([finalConfig.loginUrl]);
    return false;
  };
}

/**
 * Simple functional auth guard for Angular 17+
 * Requires authService to be injected at the route level
 */
export const authGuard = () => {
  // Note: AuthService must be provided by the consuming application
  // This is a template - apps should create their own version
  const router = inject(Router);
  
  // This will need to be customized per app to inject their AuthService
  // Example implementation:
  // const authService = inject(AuthService);
  // if (authService.isAuthenticated()) return true;
  
  router.navigate(['/login']);
  return false;
};

