import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedUserManagementComponent } from './user-management.component';
import { SharedAuthenticationService, User } from '../services/authentication.service';
import { of, throwError } from 'rxjs';

describe('SharedUserManagementComponent', () => {
  let component: SharedUserManagementComponent;
  let fixture: ComponentFixture<SharedUserManagementComponent>;
  let mockAuthService: any;

  const mockUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      displayName: 'Admin User',
      authMethod: 'credentials',
      roles: ['admin', 'user'],
      createdAt: new Date()
    },
    {
      id: '2',
      username: 'user1',
      email: 'user1@example.com',
      displayName: 'Regular User',
      authMethod: 'google',
      roles: ['user'],
      createdAt: new Date()
    }
  ];

  beforeEach(async () => {
    mockAuthService = {
      getUsers: jasmine.createSpy('getUsers').and.returnValue(of(mockUsers)),
      createUser: jasmine.createSpy('createUser').and.returnValue(of({ id: '3', ...mockUsers[0] })),
      deleteUser: jasmine.createSpy('deleteUser').and.returnValue(of(void 0)),
      syncActiveDirectoryUsers: jasmine.createSpy('syncActiveDirectoryUsers').and.returnValue(of({ synced: 5, users: [] }))
    };

    await TestBed.configureTestingModule({
      imports: [SharedUserManagementComponent, HttpClientTestingModule],
      providers: [
        { provide: SharedAuthenticationService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(mockAuthService.getUsers).toHaveBeenCalled();
    expect(component.users.length).toBe(2);
  });

  it('should open create user modal', () => {
    component.openCreateUserModal();
    expect(component.showCreateUserModal).toBe(true);
    expect(component.newUser.username).toBe('');
  });

  it('should close create user modal', () => {
    component.showCreateUserModal = true;
    component.closeCreateUserModal();
    expect(component.showCreateUserModal).toBe(false);
  });

  it('should create user with valid data', () => {
    spyOn(window, 'alert');
    component.newUser = {
      username: 'newuser',
      email: 'new@example.com',
      displayName: 'New User',
      authMethod: 'credentials',
      roles: ['user']
    };
    component.createUser();
    expect(mockAuthService.createUser).toHaveBeenCalledWith(component.newUser);
  });

  it('should not create user without required fields', () => {
    spyOn(window, 'alert');
    component.newUser = { username: '', email: '' };
    component.createUser();
    expect(mockAuthService.createUser).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalled();
  });

  it('should delete user with confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');
    component.deleteUser(mockUsers[0]);
    expect(mockAuthService.deleteUser).toHaveBeenCalledWith('1');
  });

  it('should not delete user without confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteUser(mockUsers[0]);
    expect(mockAuthService.deleteUser).not.toHaveBeenCalled();
  });

  it('should sync AD users', () => {
    spyOn(window, 'alert');
    component.syncADUsers();
    expect(mockAuthService.syncActiveDirectoryUsers).toHaveBeenCalled();
  });

  it('should get auth method label', () => {
    const label = component.getAuthMethodLabel('activeDirectory');
    expect(label).toBe('Active Directory');
  });

  it('should get correct role badge class', () => {
    expect(component.getRolesBadgeClass(['admin'])).toBe('badge-admin');
    expect(component.getRolesBadgeClass(['manager'])).toBe('badge-manager');
    expect(component.getRolesBadgeClass(['user'])).toBe('badge-user');
  });

  it('should toggle roles', () => {
    component.newUser = { roles: ['user'] };
    const event = { target: { checked: true } };
    component.toggleRole(event, 'admin');
    expect(component.newUser.roles).toContain('admin');

    event.target.checked = false;
    component.toggleRole(event, 'admin');
    expect(component.newUser.roles).not.toContain('admin');
  });
});

