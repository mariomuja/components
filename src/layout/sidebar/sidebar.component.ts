import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

export interface MenuItem {
  icon: string;
  label: string;
  translationKey?: string;
  route: string;
  badge?: string;
}

export interface SidebarConfig {
  menuItems: MenuItem[];
  showLogout?: boolean;
  logoutLabel?: string;
  enableMobileOverlay?: boolean;
}

@Component({
  selector: 'shared-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <div class="nav-section">
          <div class="nav-section-title">{{ sectionTitle || 'MAIN MENU' }}</div>
          
          <a *ngFor="let item of config.menuItems" 
             [routerLink]="item.route"
             [class.active]="isActiveRoute(item.route)"
             class="nav-item"
             (click)="onNavItemClick()">
            
            <span class="nav-icon" [innerHTML]="getIconSvg(item.icon)"></span>
            <span class="nav-label">{{ item.label }}</span>
            <span *ngIf="item.badge" class="nav-badge">{{ item.badge }}</span>
          </a>
        </div>

        <div *ngIf="config.showLogout" class="logout-section">
          <button class="logout-item" (click)="onLogout()">
            <span class="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </span>
            <span class="nav-label">{{ config.logoutLabel || 'Logout' }}</span>
          </button>
        </div>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      height: 100%;
      background: #ffffff;
      border-right: 1px solid #e5e7eb;
      overflow-y: auto;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 1.5rem 1rem;
    }

    .nav-section {
      margin-bottom: 2rem;
    }

    .nav-section-title {
      padding: 0 0.75rem;
      margin-bottom: 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: #9ca3af;
      letter-spacing: 0.05em;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      margin-bottom: 0.25rem;
      color: #6b7280;
      text-decoration: none;
      border-radius: 0.5rem;
      transition: all 0.2s;
      font-weight: 500;
    }

    .nav-item:hover {
      background: #f3f4f6;
      color: #1f2937;
    }

    .nav-item.active {
      background: #eff6ff;
      color: #3b82f6;
    }

    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      color: inherit;
    }

    .nav-label {
      flex: 1;
      font-size: 0.875rem;
    }

    .nav-badge {
      padding: 0.125rem 0.5rem;
      background: #ef4444;
      color: white;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .logout-section {
      margin-top: auto;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .logout-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem;
      background: none;
      border: none;
      color: #6b7280;
      text-align: left;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 500;
    }

    .logout-item:hover {
      background: #fef2f2;
      color: #dc2626;
    }

    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        z-index: 200;
        transform: translateX(0);
        transition: transform 0.3s;
      }
    }
  `]
})
export class SharedSidebarComponent {
  @Input() config!: SidebarConfig;
  @Input() sectionTitle?: string;
  @Output() closeSidebar = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  constructor(public router: Router) {}

  isActiveRoute(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  onNavItemClick(): void {
    this.closeSidebar.emit();
  }

  onLogout(): void {
    this.logout.emit();
    this.closeSidebar.emit();
  }

  getIconSvg(icon: string): string {
    const icons: Record<string, string> = {
      dashboard: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
      accounts: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
      journal: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
      reports: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
      settings: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"></path></svg>',
      import: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="8 17 12 21 16 17"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path></svg>',
      audit: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'
    };
    return icons[icon] || icons['dashboard'];
  }
}

