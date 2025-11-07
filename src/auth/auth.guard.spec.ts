import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { createAuthGuard } from './auth.guard';

describe('createAuthGuard', () => {
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should allow access when token exists', () => {
    spyOn(localStorage, 'getItem').and.returnValue('test-token');
    const guard = createAuthGuard({ tokenKey: 'authToken' });
    const result = TestBed.runInInjectionContext(() => guard());
    expect(result).toBe(true);
  });

  it('should deny access and redirect when no token', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const guard = createAuthGuard({ tokenKey: 'authToken', redirectTo: '/login' });
    const result = TestBed.runInInjectionContext(() => guard());
    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should remember attempted URL when configured', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(sessionStorage, 'setItem');
    const currentPath = '/dashboard/reports';
    Object.defineProperty(window.location, 'pathname', {
      writable: true,
      value: currentPath
    });

    const guard = createAuthGuard({
      tokenKey: 'authToken',
      redirectTo: '/login',
      rememberAttemptedUrl: true,
      attemptedUrlKey: 'redirect_url'
    });

    TestBed.runInInjectionContext(() => guard());
    expect(sessionStorage.setItem).toHaveBeenCalledWith('redirect_url', currentPath);
  });

  it('should not remember homepage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(sessionStorage, 'setItem');
    Object.defineProperty(window.location, 'pathname', {
      writable: true,
      value: '/'
    });

    const guard = createAuthGuard({
      tokenKey: 'authToken',
      rememberAttemptedUrl: true
    });

    TestBed.runInInjectionContext(() => guard());
    expect(sessionStorage.setItem).not.toHaveBeenCalled();
  });

  it('should use custom token key', () => {
    const spy = spyOn(localStorage, 'getItem').and.returnValue('session-123');
    const guard = createAuthGuard({ tokenKey: 'sessionId' });
    TestBed.runInInjectionContext(() => guard());
    expect(spy).toHaveBeenCalledWith('sessionId');
  });
});


