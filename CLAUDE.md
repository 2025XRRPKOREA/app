# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RipplePay is a React Native mobile wallet application built with Expo for XRP and KRW IOU transactions. The app provides a cross-platform solution for XRP payments with Korean Won integration.

## Development Commands

### Core Development
- `npm start` - Start Expo development server
- `npm run android` - Start on Android emulator  
- `npm run ios` - Start on iOS simulator
- `npm run web` - Start web version
- `npm run lint` - Run ESLint

### Project Management
- `npm run reset-project` - Move starter code to app-example and create blank app directory

## Architecture Overview

### Technology Stack
- **Framework**: React Native with Expo (~54.0.9)
- **Router**: Expo Router v6 with file-based routing and typed routes
- **UI**: Custom themed components with expo-symbols icons
- **State**: React Context API for authentication
- **Storage**: AsyncStorage for mobile, localStorage for web
- **API**: Auto-generated TypeScript client from OpenAPI 3.0 spec
- **Crypto**: XRP Ledger integration for blockchain transactions

### Key Directories
- `app/` - File-based routing pages (tabs layout with index, exchange, transaction, profile)
- `api/` - Auto-generated API client from OpenAPI spec
- `components/` - Reusable UI components and icons
- `context/` - React Context providers (AuthContext)
- `services/` - API client wrapper and business logic
- `constants/` - Configuration and theme definitions
- `hooks/` - Custom React hooks for theming

### API Integration
The app uses an auto-generated TypeScript API client from `openapi.json`. API configuration is centralized in `constants/config.ts` with environment-specific base URLs:
- Development: `http://localhost:8081` (configurable via SERVER_HOST env var)
- Production: Configurable via app.config.js extra fields

### Authentication Flow
- Managed through `context/AuthContext.tsx` using React Context
- Token storage handled by `services/apiClient.ts` with platform-specific storage (AsyncStorage/localStorage)
- Auth guards implemented via `components/AuthGuard.tsx`
- Supports login/register/logout with JWT tokens

### Navigation Structure
```
app/
├── (tabs)/          # Tab-based navigation
│   ├── index.tsx    # Home/Dashboard
│   ├── exchange.tsx # Currency exchange
│   ├── transaction.tsx # Transaction history
│   └── profile.tsx  # User profile
├── login.tsx        # Authentication screen
└── modal.tsx        # Modal screens
```

### Configuration Management
- App configuration in `app.config.js` with environment variable support
- Runtime config in `constants/config.ts` with API endpoints, transaction limits, UI settings
- Platform detection for web vs mobile feature differences

### QR Code Integration
- QR generation via `components/QRGenerator.tsx` 
- QR scanning via `components/QRScanner.tsx` using expo-barcode-scanner

## API Code Generation

The project uses OpenAPI Generator to create TypeScript API clients:
- Source spec: `openapi.json` 
- Generated files: `api/` directory
- Generator config: `openapitools.json`
- Regenerate API client when OpenAPI spec changes

## Development Notes

### Environment Configuration
- Server host configurable via `app.config.js` extra.serverHost
- Development server defaults to localhost:8081
- API timeout configurable via extra.apiTimeout

### Platform Considerations
- Cross-platform storage abstraction in apiClient.ts
- Platform-specific icons and components where needed
- Web vs mobile feature detection via Platform.OS

### State Management
- Authentication state in AuthContext
- API client maintains token state with automatic storage persistence
- Configuration constants for app-wide settings