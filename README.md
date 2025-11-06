# Angular Shared Components

Shared Angular components library for Mario Muja's applications.

## Components

### SharedLoginComponent

A reusable login page with developer contact card and configurable branding.

## Usage

### In Bookkeeping App:

```typescript
import { SharedLoginComponent } from '@mario-muja/angular-shared-components/login';

// In your component
<shared-login 
  [config]="loginConfig"
  [authService]="authService"
  [organizationService]="orgService">
</shared-login>
```

### In Dashboard App:

```typescript
import { SharedLoginComponent } from '@mario-muja/angular-shared-components/login';

// In your component
<shared-login 
  [config]="loginConfig"
  [authService]="authService">
</shared-login>
```

## Configuration

```typescript
const loginConfig: LoginConfig = {
  appTitle: 'Your App Name',
  githubRepoUrl: 'https://github.com/mariomuja/your-repo',
  photoUrl: 'assets/images/mario-muja.jpg',
  demoCredentials: {
    username: 'demo',
    password: 'DemoUser2025!Secure'
  },
  redirectAfterLogin: '/dashboard',
  showDeveloperCard: true
};
```

## Installation

### Option 1: NPM Link (Development)

```bash
cd angular-shared-components
npm link

cd ../your-app
npm link @mario-muja/angular-shared-components
```

### Option 2: Git Submodule

```bash
cd your-app
git submodule add https://github.com/mariomuja/angular-shared-components.git shared-components
```

### Option 3: Direct Path (Recommended for local development)

Add to tsconfig.json:
```json
{
  "compilerOptions": {
    "paths": {
      "@mario-muja/angular-shared-components/*": ["../angular-shared-components/src/*"]
    }
  }
}
```

## Development

The shared components are located in `src/` directory and are TypeScript/Angular files that don't need compilation for local use.

## Author

Mario Muja
- Email: mario.muja@gmail.com
- Phone: +49 1520 464 1473
- Location: Hamburg, Germany

