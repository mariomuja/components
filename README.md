# Angular Shared Components Library

A comprehensive collection of reusable Angular components, services, and utilities for building modern web applications.

## 📦 Repository
**GitHub:** [mariomuja/components](https://github.com/mariomuja/components)

## 🎯 Overview

This library provides battle-tested, production-ready components used across multiple applications:
- **International Bookkeeping** (https://international-bookkeeping.vercel.app)
- **KPI Dashboard** (https://github.com/mariomuja/dashboard)

## 🚀 Installation

### Using Git Submodules (Recommended)

```bash
# Add as submodule to your project
git submodule add https://github.com/mariomuja/components.git shared-components

# Initialize and update submodule
git submodule update --init --recursive

# Update to latest version
git submodule update --remote --merge
```

### Configure TypeScript Path Mapping

Add to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@shared-components/*": ["../shared-components/src/*"]
    }
  }
}
```

---

## 📚 Components & Services

### 1. 🔐 Authentication

#### **Login Component**
Full-featured login component with 2FA support and developer card.

```typescript
import { SharedLoginComponent, LoginConfig } from '@shared-components/login';

// In your component
loginConfig: LoginConfig = {
  appTitle: 'My App',
  redirectAfterLogin: '/dashboard',
  showDeveloperCard: true,
  photoUrl: 'assets/photo.jpg',
  githubRepoUrl: 'https://github.com/user/repo',
  demoCredentials: {
    username: 'demo',
    password: 'Demo123!Secure'
  }
};
```

```html
<shared-login 
  [config]="loginConfig" 
  [authService]="authService" 
  [organizationService]="organizationService">
</shared-login>
```

**Features:**
- 2FA verification support
- Developer contact card with photo
- GitHub repository link
- Demo credentials display
- Configurable branding
- Mobile responsive

---

#### **Auth Guard**
Reusable route guard for authentication.

```typescript
import { createAuthGuard } from '@shared-components/auth';

export const routes: Routes = [
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [createAuthGuard(authService, { 
      loginUrl: '/login',
      storeAttemptedUrl: true 
    })]
  }
];
```

---

### 2. 🎨 Theme Management

#### **Theme Service**
Light/Dark mode with system preference detection.

```typescript
import { ThemeService } from '@shared-components/services';

constructor(private themeService: ThemeService) {
  // Configure theme
  this.themeService.configure({
    storageKey: 'my_app_theme',
    defaultTheme: 'auto',
    attributeName: 'data-theme'
  });

  // Listen to theme changes
  this.themeService.theme$.subscribe(theme => {
    console.log('Current theme:', theme);
  });

  // Toggle theme
  this.themeService.toggleTheme();

  // Set specific theme
  this.themeService.setTheme('dark');
}
```

**Features:**
- Light, Dark, and Auto modes
- System preference detection
- LocalStorage persistence
- Observable theme changes
- CSS class and attribute management

---

#### **Theme Toggle Component**
UI component for theme switching with 3 styles.

```html
<!-- Button Style -->
<shared-theme-toggle 
  [toggleStyle]="'button'" 
  [showLabel]="true"
  [showAutoOption]="true">
</shared-theme-toggle>

<!-- Switch Style -->
<shared-theme-toggle [toggleStyle]="'switch'"></shared-theme-toggle>

<!-- Select Style -->
<shared-theme-toggle [toggleStyle]="'select'"></shared-theme-toggle>
```

---

### 3. 🌍 Internationalization (i18n)

#### **Language Service**
Multi-language support with browser detection.

```typescript
import { LanguageService } from '@shared-components/services';

constructor(
  private languageService: LanguageService,
  private translate: TranslateService
) {
  // Configure available languages
  languageService.configure({
    availableLanguages: [
      { code: 'en', name: 'English', flag: '🇬🇧', direction: 'ltr' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪', direction: 'ltr' },
      { code: 'es', name: 'Español', flag: '🇪🇸', direction: 'ltr' }
    ],
    defaultLanguage: 'en',
    useBrowserLanguage: true
  });

  // Sync with ngx-translate
  languageService.currentLanguage$.subscribe(lang => {
    translate.use(lang);
  });

  // Change language
  languageService.setLanguage('de');
}
```

**Features:**
- Configurable languages
- Browser language detection
- LocalStorage persistence
- RTL support
- Observable language changes

---

#### **Language Selector Component**
Dropdown for language selection.

```html
<shared-language-selector [showLabel]="true"></shared-language-selector>
```

---

### 4. 📐 Layout Components

#### **Header Component**
Configurable application header with mobile support.

```typescript
import { SharedHeaderComponent, HeaderConfig } from '@shared-components/layout';

headerConfig: HeaderConfig = {
  appTitle: 'My Application',
  logoUrl: 'assets/logo.png',
  showDocumentation: true,
  showOrganization: true,
  organizationName: 'Company Name',
  organizationCurrency: 'USD'
};
```

```html
<shared-header 
  [config]="headerConfig" 
  (toggleMobileMenu)="onToggleMobileMenu()"
  (documentationClick)="openDocs()">
  
  <!-- Custom slots -->
  <shared-language-selector languageSelector></shared-language-selector>
  <shared-theme-toggle themeToggle></shared-theme-toggle>
</shared-header>
```

**Features:**
- Mobile hamburger menu
- Organization display
- Documentation button
- Content projection slots
- Responsive design

---

#### **Sidebar Component**
Navigation sidebar with logout and mobile overlay.

```typescript
import { SharedSidebarComponent, SidebarConfig, MenuItem } from '@shared-components/layout';

sidebarConfig: SidebarConfig = {
  menuItems: [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'accounts', label: 'Accounts', route: '/accounts', badge: '5' },
    { icon: 'reports', label: 'Reports', route: '/reports' }
  ],
  showLogout: true,
  logoutLabel: 'Sign Out'
};
```

```html
<shared-sidebar 
  [config]="sidebarConfig"
  [sectionTitle]="'MAIN MENU'"
  (closeSidebar)="onCloseSidebar()"
  (logout)="onLogout()">
</shared-sidebar>
```

**Features:**
- Configurable menu items
- Built-in SVG icons (dashboard, accounts, journal, reports, settings, import, audit)
- Active route highlighting
- Badge support
- Logout button
- Mobile overlay support

**Available Icons:**
- `dashboard` - Grid icon
- `accounts` - Book icon
- `journal` - Document icon
- `reports` - Bar chart icon
- `settings` - Settings icon
- `import` - Download icon
- `audit` - Document with magnifying glass

---

### 5. 🎭 UI Components

#### **Loading Skeleton Component**
Animated loading placeholders.

```html
<!-- Text skeleton -->
<shared-loading-skeleton 
  type="text" 
  width="80%">
</shared-loading-skeleton>

<!-- Circle skeleton (avatar) -->
<shared-loading-skeleton 
  type="circle" 
  width="3rem">
</shared-loading-skeleton>

<!-- Rectangle skeleton -->
<shared-loading-skeleton 
  type="rect" 
  height="10rem">
</shared-loading-skeleton>

<!-- Card skeleton -->
<shared-loading-skeleton type="card"></shared-loading-skeleton>

<!-- Table skeleton -->
<shared-loading-skeleton type="table"></shared-loading-skeleton>
```

**Skeleton Types:**
- `text` - Text line placeholder
- `circle` - Circular placeholder (avatars, icons)
- `rect` - Rectangle placeholder
- `card` - Complete card layout
- `table` - Table with rows and columns

---

## 📁 Complete Import Examples

### Import Everything from Main Index

```typescript
import {
  // Auth
  SharedLoginComponent,
  LoginConfig,
  createAuthGuard,
  
  // Services
  ThemeService,
  LanguageService,
  
  // Layout
  SharedHeaderComponent,
  SharedSidebarComponent,
  HeaderConfig,
  SidebarConfig,
  MenuItem,
  
  // UI
  ThemeToggleComponent,
  LanguageSelectorComponent,
  LoadingSkeletonComponent,
  Language
} from '@shared-components';
```

### Import from Specific Modules

```typescript
// Auth module
import { SharedLoginComponent, createAuthGuard } from '@shared-components/auth';

// Services
import { ThemeService, LanguageService } from '@shared-components/services';

// Layout
import { SharedHeaderComponent, SharedSidebarComponent } from '@shared-components/layout';

// UI Components
import { ThemeToggleComponent, LanguageSelectorComponent } from '@shared-components/ui';
```

---

## 🎨 Styling

All components use inline styles and are framework-agnostic. They work with:
- CSS custom properties
- Tailwind CSS
- Bootstrap
- Material Design
- Custom CSS

### CSS Variables (Optional)

```css
:root {
  --primary-color: #3b82f6;
  --sidebar-width: 260px;
  --header-height: 64px;
}
```

---

## 🔧 Configuration

### Language Service Configuration

```typescript
languageService.configure({
  availableLanguages: [
    { code: 'en', name: 'English', flag: '🇬🇧', direction: 'ltr' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', direction: 'rtl' }
  ],
  defaultLanguage: 'en',
  storageKey: 'my_app_language',
  useBrowserLanguage: true
});
```

### Theme Service Configuration

```typescript
themeService.configure({
  storageKey: 'my_app_theme',
  defaultTheme: 'auto',
  classPrefix: 'theme-',  // Results in 'theme-light', 'theme-dark'
  attributeName: 'data-theme'
});
```

---

## 🏗️ Complete App Integration Example

```typescript
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { 
  SharedHeaderComponent, 
  SharedSidebarComponent,
  ThemeService,
  LanguageService,
  HeaderConfig,
  SidebarConfig
} from '@shared-components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SharedHeaderComponent, SharedSidebarComponent],
  template: `
    <shared-header 
      [config]="headerConfig"
      (toggleMobileMenu)="toggleSidebar()"
      (documentationClick)="openDocs()">
      <shared-language-selector languageSelector></shared-language-selector>
      <shared-theme-toggle themeToggle></shared-theme-toggle>
    </shared-header>

    <div class="app-layout">
      <shared-sidebar 
        [config]="sidebarConfig"
        [class.mobile-open]="isSidebarOpen"
        (closeSidebar)="closeSidebar()"
        (logout)="onLogout()">
      </shared-sidebar>

      <main class="app-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent implements OnInit {
  isSidebarOpen = false;

  headerConfig: HeaderConfig = {
    appTitle: 'My App',
    showDocumentation: true,
    showOrganization: true
  };

  sidebarConfig: SidebarConfig = {
    menuItems: [
      { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
      { icon: 'settings', label: 'Settings', route: '/settings' }
    ],
    showLogout: true
  };

  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    // Initialize services
    this.languageService.configure({
      availableLanguages: [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
      ],
      defaultLanguage: 'en'
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  onLogout() {
    // Handle logout
  }

  openDocs() {
    // Open documentation
  }
}
```

---

## 📱 Mobile Responsive

All components are mobile-responsive out of the box:

- **Header:** Hamburger menu appears on screens < 768px
- **Sidebar:** Transforms to overlay on mobile
- **Login:** Stacks cards vertically on small screens
- **Theme Toggle:** Adapts sizing for mobile
- **Language Selector:** Touch-friendly dropdown

---

## 🧪 Testing

Components are designed to be easily testable:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedLoginComponent } from '@shared-components/login';

describe('Login Integration', () => {
  let component: MyLoginComponent;
  let fixture: ComponentFixture<MyLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyLoginComponent, SharedLoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyLoginComponent);
    component = fixture.componentInstance;
  });

  it('should render shared login component', () => {
    expect(component).toBeTruthy();
  });
});
```

---

## 🔄 Updating Shared Components

```bash
# In your main app repository
git submodule update --remote --merge

# Commit the submodule update
git add shared-components
git commit -m "Update shared-components to latest version"
git push
```

---

## 🛠️ Development Workflow

### Making Changes to Shared Components

1. Navigate to shared components directory:
```bash
cd shared-components
```

2. Make your changes

3. Commit and push:
```bash
git add .
git commit -m "Your changes"
git push
```

4. Update in consuming apps:
```bash
cd ..  # Back to main app
git submodule update --remote --merge
git add shared-components
git commit -m "Update shared-components"
git push
```

---

## 📋 Component Checklist

- [x] Login Component with 2FA
- [x] Auth Guard
- [x] Theme Service & Toggle
- [x] Language Service & Selector
- [x] Header Component
- [x] Sidebar Component
- [x] Loading Skeleton
- [ ] Footer Component
- [ ] Modal Component
- [ ] Toast/Notification Service
- [ ] 2FA Setup Component
- [ ] Documentation Modal

---

## 🎯 Best Practices

1. **Always use TypeScript path mapping** - Makes imports cleaner
2. **Configure services on app init** - Set languages, theme preferences early
3. **Use content projection** - Customize headers with slots
4. **Test with submodule updates** - Ensure backward compatibility
5. **Version control your config** - Keep LoginConfig, HeaderConfig in version control

---

## 🌟 Features

- ✅ Fully typed with TypeScript
- ✅ Standalone components (Angular 17+)
- ✅ Mobile responsive
- ✅ i18n ready
- ✅ Dark mode support
- ✅ Git submodule integration
- ✅ Production tested
- ✅ Zero external dependencies (except Angular core)

---

## 📊 Statistics

- **Total Lines:** ~1,500 lines
- **Components:** 9
- **Services:** 2
- **Bundle Size Impact:** Minimal (tree-shakeable)
- **Apps Using:** 2+

---

## 🤝 Contributing

To add new components:

1. Create component in appropriate directory
2. Export from directory's `index.ts`
3. Add to main `src/index.ts`
4. Document usage in README
5. Test in both consuming apps

---

## 📞 Support

**Developed by:** Mario Muja  
**Email:** mario.muja@gmail.com  
**Phone:** +49 1520 464 1473  
**Location:** Hamburg, Germany

---

## 📜 License

Private repository for personal projects.

---

## 🚀 Deployment

Both apps using these components are deployed on Vercel:

- **International Bookkeeping:** https://international-bookkeeping.vercel.app
- **KPI Dashboard:** (Configured, ready to deploy)

**Node.js Version:** 22.x (Required for Vercel)

---

## 🎓 Examples

See real-world usage in:
- [Bookkeeping App](https://github.com/mariomuja/bookkeeping)
- [KPI Dashboard](https://github.com/mariomuja/dashboard)
