# Project Overview

## Overview

This is a full-stack web application built with React on the frontend and Express.js on the backend. The application appears to be a chat interface with a modern UI built using shadcn/ui components and Tailwind CSS. The backend uses Drizzle ORM with PostgreSQL for data persistence and includes session management capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL store (connect-pg-simple)
- **Database Provider**: Neon Database serverless PostgreSQL

## Key Components

### Frontend Components
1. **Chat Interface** (`client/src/pages/chat.tsx`): Main chat page with message display and input functionality
2. **UI Components** (`client/src/components/ui/`): Comprehensive set of reusable UI components from shadcn/ui
3. **Query Client** (`client/src/lib/queryClient.ts`): Centralized API request handling with React Query
4. **Routing**: Simple routing setup with chat as the main page and 404 handling

### Backend Components
1. **Server Entry** (`server/index.ts`): Express server setup with middleware and error handling
2. **Routes** (`server/routes.ts`): API route definitions (currently minimal setup)
3. **Storage Layer** (`server/storage.ts`): Data access layer with both in-memory and database implementations
4. **Vite Integration** (`server/vite.ts`): Development server integration with Vite for HMR

### Shared Components
1. **Database Schema** (`shared/schema.ts`): Drizzle schema definitions for users table
2. **Type Definitions**: Shared TypeScript types between frontend and backend

## Data Flow

1. **Client Requests**: Frontend makes API calls using the centralized query client
2. **API Layer**: Express routes handle HTTP requests and delegate to storage layer
3. **Data Layer**: Storage interface abstracts database operations using Drizzle ORM
4. **Database**: PostgreSQL database managed by Neon Database service
5. **Response Flow**: Data flows back through the same layers with proper error handling

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React, React DOM, React Query for frontend state management
- **Backend**: Express.js with TypeScript support via tsx
- **Database**: Drizzle ORM with Neon Database PostgreSQL adapter

### UI and Styling
- **Component Library**: Extensive Radix UI component collection
- **Styling**: Tailwind CSS with PostCSS processing
- **Icons**: Lucide React icon library
- **Form Handling**: React Hook Form with Zod validation

### Development Tools
- **Build System**: Vite with React plugin and Replit-specific plugins
- **TypeScript**: Full TypeScript support across frontend and backend
- **Database Migrations**: Drizzle Kit for schema migrations

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR and Replit integration
- **Backend**: tsx for TypeScript execution with file watching
- **Database**: Drizzle push for schema synchronization

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js` as ESM
- **Startup**: Single Node.js process serves both API and static files
- **Database**: Uses DATABASE_URL environment variable for connection

### Key Build Commands
- `dev`: Development mode with file watching
- `build`: Production build for both frontend and backend
- `start`: Production server startup
- `db:push`: Database schema synchronization

The application follows a modern full-stack architecture with clear separation of concerns, type safety throughout, and a scalable foundation for chat functionality.