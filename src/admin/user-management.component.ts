import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedAuthenticationService, User, AuthenticationMethod } from '../services/authentication.service';

@Component({
  selector: 'shared-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class SharedUserManagementComponent implements OnInit {
  users: User[] = [];
  loading = false;
  showCreateUserModal = false;
  showSyncModal = false;
  syncing = false;

  // New user form
  newUser: Partial<User> = {
    username: '',
    email: '',
    displayName: '',
    authMethod: 'credentials',
    roles: ['user']
  };

  authMethods: { value: AuthenticationMethod; label: string }[] = [
    { value: 'credentials', label: 'Username/Password' },
    { value: 'activeDirectory', label: 'Active Directory' },
    { value: 'google', label: 'Google OAuth' },
    { value: 'microsoft', label: 'Microsoft OAuth' },
    { value: 'github', label: 'GitHub OAuth' },
    { value: 'saml', label: 'SAML SSO' }
  ];

  availableRoles = ['user', 'admin', 'viewer', 'editor', 'manager'];

  constructor(private authService: SharedAuthenticationService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.authService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  openCreateUserModal(): void {
    this.showCreateUserModal = true;
    this.newUser = {
      username: '',
      email: '',
      displayName: '',
      authMethod: 'credentials',
      roles: ['user']
    };
  }

  closeCreateUserModal(): void {
    this.showCreateUserModal = false;
  }

  createUser(): void {
    if (!this.newUser.username || !this.newUser.email) {
      alert('Please fill in all required fields');
      return;
    }

    this.loading = true;
    this.authService.createUser(this.newUser).subscribe({
      next: (user) => {
        this.users.push(user);
        this.closeCreateUserModal();
        this.loading = false;
        alert('User created successfully!');
      },
      error: (error) => {
        this.loading = false;
        alert('Failed to create user: ' + (error.error?.message || error.message));
      }
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Delete user ${user.username}?`)) {
      return;
    }

    this.authService.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        alert('User deleted successfully');
      },
      error: (error) => {
        alert('Failed to delete user: ' + (error.error?.message || error.message));
      }
    });
  }

  openSyncModal(): void {
    this.showSyncModal = true;
  }

  closeSyncModal(): void {
    this.showSyncModal = false;
  }

  syncADUsers(): void {
    this.syncing = true;
    this.authService.syncActiveDirectoryUsers().subscribe({
      next: (result) => {
        this.syncing = false;
        this.closeSyncModal();
        this.loadUsers(); // Refresh the list
        alert(`Successfully synced ${result.synced} users from Active Directory`);
      },
      error: (error) => {
        this.syncing = false;
        alert('Failed to sync AD users: ' + (error.error?.message || error.message));
      }
    });
  }

  getAuthMethodLabel(method: AuthenticationMethod): string {
    const methodInfo = this.authMethods.find(m => m.value === method);
    return methodInfo?.label || method;
  }

  getRolesBadgeClass(roles: string[]): string {
    if (roles.includes('admin')) return 'badge-admin';
    if (roles.includes('manager')) return 'badge-manager';
    return 'badge-user';
  }

  toggleRole(event: any, role: string): void {
    if (!this.newUser.roles) {
      this.newUser.roles = [];
    }
    
    if (event.target.checked) {
      if (!this.newUser.roles.includes(role)) {
        this.newUser.roles.push(role);
      }
    } else {
      this.newUser.roles = this.newUser.roles.filter(r => r !== role);
    }
  }
}

