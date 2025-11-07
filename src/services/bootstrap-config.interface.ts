export interface BootstrapCheck {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  timestamp?: Date;
  details?: any;
}

export interface BootstrapState {
  isReady: boolean;
  checks: BootstrapCheck[];
  overallStatus: 'initializing' | 'ready' | 'error';
  error?: string;
}

export interface BootstrapConfig {
  /**
   * API base URL (e.g., '/api' or 'http://localhost:3000/api')
   */
  apiUrl: string;
  
  /**
   * Request timeout in milliseconds
   */
  timeoutMs?: number;
  
  /**
   * Endpoint to check for API availability (e.g., '/organizations' or '/data/dashboard-data')
   */
  apiEndpoint?: string;
  
  /**
   * Name of the localStorage key for authentication token (e.g., 'authToken' or 'sessionId')
   */
  authTokenKey?: string;
  
  /**
   * Custom error messages
   */
  errorMessages?: {
    backendNotResponding?: string;
    backendHealthFailed?: string;
    apiEndpointsFailed?: string;
  };
  
  /**
   * Custom success messages
   */
  successMessages?: {
    backendConnected?: string;
    backendHealthy?: string;
    apiEndpoints?: string;
    authenticated?: string;
  };
}

