import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface HeaderConfig {
  appTitle: string;
  logoUrl?: string;
  showLanguageSelector?: boolean;
  showThemeToggle?: boolean;
  showDocumentation?: boolean;
  showUserMenu?: boolean;
  showOrganization?: boolean;
  organizationName?: string;
  organizationCurrency?: string;
  userName?: string;
}

@Component({
  selector: 'shared-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <button class="mobile-menu-button" (click)="toggleMobileMenu.emit()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <div class="logo">
            <img *ngIf="config.logoUrl" [src]="config.logoUrl" [alt]="config.appTitle">
            <svg *ngIf="!config.logoUrl" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            <span class="logo-text">{{ config.appTitle }}</span>
          </div>
        </div>

        <div class="header-center" *ngIf="config.showOrganization">
          <div class="organization-info">
            <div class="organization-name">{{ config.organizationName }}</div>
            <div class="organization-currency">{{ config.organizationCurrency }}</div>
          </div>
        </div>

        <div class="header-right">
          <button *ngIf="config.showDocumentation" 
                  class="icon-button" 
                  (click)="documentationClick.emit()"
                  title="Documentation">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </button>

          <ng-content select="[languageSelector]"></ng-content>
          <ng-content select="[themeToggle]"></ng-content>
          <ng-content select="[userMenu]"></ng-content>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: white;
      border-bottom: 1px solid #e5e7eb;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      gap: 1rem;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .mobile-menu-button {
      display: none;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      background: none;
      border: none;
      cursor: pointer;
      color: #6b7280;
    }

    @media (max-width: 768px) {
      .mobile-menu-button {
        display: flex;
      }
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo img, .logo svg {
      width: 32px;
      height: 32px;
      color: #3b82f6;
    }

    .logo-text {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
    }

    @media (max-width: 640px) {
      .logo-text {
        display: none;
      }
    }

    .header-center {
      flex: 1;
      display: flex;
      justify-content: center;
    }

    .organization-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .organization-name {
      font-weight: 500;
      color: #1f2937;
    }

    .organization-currency {
      padding: 0.25rem 0.75rem;
      background: #3b82f6;
      color: white;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .icon-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      background: none;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.2s;
    }

    .icon-button:hover {
      background: #f3f4f6;
      color: #1f2937;
    }
  `]
})
export class SharedHeaderComponent {
  @Input() config!: HeaderConfig;
  @Output() toggleMobileMenu = new EventEmitter<void>();
  @Output() documentationClick = new EventEmitter<void>();
}

