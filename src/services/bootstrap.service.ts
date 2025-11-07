import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, firstValueFrom } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { BootstrapConfig, BootstrapCheck, BootstrapState } from './bootstrap-config.interface';

import { InjectionToken } from '@angular/core';
export const BOOTSTRAP_CONFIG = new InjectionToken<BootstrapConfig>('BOOTSTRAP_CONFIG');

@Injectable({
  providedIn: 'root'
})
export class BootstrapService {
  private readonly config: Required<BootstrapConfig>;
  private bootstrapStateSubject = new BehaviorSubject<BootstrapState>({
    isReady: false,
    checks: [],
    overallStatus: 'initializing'
  });
  
  public bootstrapState$ = this.bootstrapStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Optional() @Inject(BOOTSTRAP_CONFIG) config?: BootstrapConfig
  ) {
    // Use provided config or defaults
    this.config = {
      apiUrl: config?.apiUrl || '/api',
      timeoutMs: config?.timeoutMs || 5000,
      apiEndpoint: config?.apiEndpoint || '/health',
      authTokenKey: config?.authTokenKey || 'authToken',
      errorMessages: {
        backendNotResponding: config?.errorMessages?.backendNotResponding ?? 'Backend server is not responding',
        backendHealthFailed: config?.errorMessages?.backendHealthFailed ?? 'Backend health check failed',
        apiEndpointsFailed: config?.errorMessages?.apiEndpointsFailed ?? 'Failed to reach API endpoints'
      },
      successMessages: {
        backendConnected: config?.successMessages?.backendConnected ?? 'Connected to backend',
        backendHealthy: config?.successMessages?.backendHealthy ?? 'Backend healthy',
        apiEndpoints: config?.successMessages?.apiEndpoints ?? 'API endpoints available',
        authenticated: config?.successMessages?.authenticated ?? 'User authenticated'
      }
    };
  }

  /**
   * Run all bootstrap checks
   */
  async runBootstrapChecks(): Promise<boolean> {
    const checks: BootstrapCheck[] = [];
    
    this.updateState({
      isReady: false,
      checks: [],
      overallStatus: 'initializing'
    });

    // Check 1: Backend Connectivity
    const backendCheck = await this.checkBackendConnectivity();
    checks.push(backendCheck);
    this.updateState({
      isReady: false,
      checks: [...checks],
      overallStatus: 'initializing'
    });

    if (backendCheck.status === 'error') {
      this.updateState({
        isReady: false,
        checks,
        overallStatus: 'error',
        error: this.config.errorMessages.backendNotResponding
      });
      return false;
    }

    // Check 2: Backend Health
    const healthCheck = await this.checkBackendHealth();
    checks.push(healthCheck);
    this.updateState({
      isReady: false,
      checks: [...checks],
      overallStatus: 'initializing'
    });

    if (healthCheck.status === 'error') {
      this.updateState({
        isReady: false,
        checks,
        overallStatus: 'error',
        error: this.config.errorMessages.backendHealthFailed
      });
      return false;
    }

    // Check 3: API Endpoints
    const apiCheck = await this.checkApiEndpoints();
    checks.push(apiCheck);
    this.updateState({
      isReady: false,
      checks: [...checks],
      overallStatus: 'initializing'
    });

    // Check 4: Authentication Status
    const authCheck = this.checkAuthStatus();
    checks.push(authCheck);
    
    const allSuccessful = checks.every(c => c.status === 'success' || c.status === 'warning');
    
    this.updateState({
      isReady: allSuccessful,
      checks,
      overallStatus: allSuccessful ? 'ready' : 'error',
      error: allSuccessful ? undefined : 'Some bootstrap checks failed'
    });

    return allSuccessful;
  }

  /**
   * Check if backend server is reachable
   */
  private async checkBackendConnectivity(): Promise<BootstrapCheck> {
    try {
      await firstValueFrom(
        this.http.get(`${this.config.apiUrl}/health`)
          .pipe(
            timeout(this.config.timeoutMs),
            catchError((error: HttpErrorResponse) => {
              throw error;
            })
          )
      );
      
      return {
        name: 'Backend Connectivity',
        status: 'success',
        message: `${this.config.successMessages.backendConnected} at ${this.config.apiUrl}`,
        timestamp: new Date()
      };
    } catch (error: any) {
      let errorMessage = this.config.errorMessages.backendNotResponding;
      
      if (error.name === 'TimeoutError') {
        errorMessage = `Backend connection timeout after ${this.config.timeoutMs}ms`;
      } else if (error.status === 0) {
        errorMessage = 'Backend server is not running or not reachable';
      } else if (error.status) {
        errorMessage = `Backend returned error: ${error.status} ${error.statusText || ''}`;
      }
      
      const finalMessage = errorMessage || this.config.errorMessages.backendNotResponding;
      return {
        name: 'Backend Connectivity',
        status: 'error',
        message: finalMessage,
        timestamp: new Date(),
        details: {
          url: this.config.apiUrl,
          error: error?.message || 'Unknown error'
        }
      };
    }
  }

  /**
   * Check backend health endpoint
   */
  private async checkBackendHealth(): Promise<BootstrapCheck> {
    try {
      const health: any = await firstValueFrom(
        this.http.get(`${this.config.apiUrl}/health`)
          .pipe(timeout(this.config.timeoutMs))
      );
      
      const status = health.status?.toLowerCase() || '';
      if (status && status !== 'ok') {
        return {
          name: 'Backend Health',
          status: 'warning',
          message: 'Backend health check returned non-OK status',
          timestamp: new Date(),
          details: health
        };
      }
      
      return {
        name: 'Backend Health',
        status: 'success',
        message: health.message || this.config.successMessages.backendHealthy,
        timestamp: new Date(),
        details: health
      };
    } catch (error: any) {
      return {
        name: 'Backend Health',
        status: 'error',
        message: 'Backend health check failed: ' + error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * Check if critical API endpoints are available
   */
  private async checkApiEndpoints(): Promise<BootstrapCheck> {
    try {
      const data: any = await firstValueFrom(
        this.http.get(`${this.config.apiUrl}${this.config.apiEndpoint}`)
          .pipe(
            timeout(this.config.timeoutMs),
            catchError(() => of(null))
          )
      );
      
      if (!data) {
        return {
          name: 'API Endpoints',
          status: 'warning',
          message: 'API reachable but endpoint returned no data',
          timestamp: new Date()
        };
      }
      
      return {
        name: 'API Endpoints',
        status: 'success',
        message: this.config.successMessages.apiEndpoints,
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        name: 'API Endpoints',
        status: 'error',
        message: this.config.errorMessages.apiEndpointsFailed,
        timestamp: new Date(),
        details: error.message
      };
    }
  }

  /**
   * Check authentication status
   */
  private checkAuthStatus(): BootstrapCheck {
    const token = localStorage.getItem(this.config.authTokenKey);
    
    if (token) {
      return {
        name: 'Authentication',
        status: 'success',
        message: this.config.successMessages.authenticated,
        timestamp: new Date()
      };
    }
    
    return {
      name: 'Authentication',
      status: 'warning',
      message: 'No authentication token found (will redirect to login)',
      timestamp: new Date()
    };
  }

  /**
   * Get current bootstrap state
   */
  getBootstrapState(): BootstrapState {
    return this.bootstrapStateSubject.value;
  }

  /**
   * Update bootstrap state
   */
  private updateState(state: BootstrapState): void {
    this.bootstrapStateSubject.next(state);
  }

  /**
   * Reset bootstrap state
   */
  reset(): void {
    this.updateState({
      isReady: false,
      checks: [],
      overallStatus: 'initializing'
    });
  }
}

