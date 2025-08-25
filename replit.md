# Burkaya Corp - Fantasy Fashion Platform

## Overview

Burkaya Corp is a fantasy-inspired, fiction-fueled fashion platform that transforms imagination into wearable reality. The platform combines dropshipping, customization, fandom culture, and gamification to create an immersive shopping experience. Customers can discover fashion inspired by manhwa, manga, K-dramas, anime, donghua, and games, or create their own custom designs through the "Write a Design" feature and Imagination Lab creator portal.

The application serves as both an e-commerce platform and a creative community where fans can wear their favorite stories and creators can submit original designs for production and royalties.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack Architecture
The application uses a monorepo structure with separate client and server directories, sharing common schema definitions. The backend is built with Express.js and TypeScript, while the frontend uses React with Vite for development and build tooling.

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Build Tool**: Vite with custom configuration for development speed and hot module replacement
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design system
- **Styling**: Tailwind CSS with custom fantasy-themed color palette and CSS variables for theming
- **Authentication**: Session-based authentication with protected routes and auth state management

### Backend Architecture  
- **Runtime**: Node.js with Express.js framework
- **Database ORM**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Authentication**: Replit Authentication with OpenID Connect and Passport.js strategy
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **API Design**: RESTful endpoints with proper error handling and request logging middleware

### Database Design
- **Primary Database**: PostgreSQL with Neon serverless driver for connection pooling
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Key Tables**: Users, products, custom designs, creator submissions, orders, cart items, missions, and user progress tracking
- **Data Types**: Comprehensive enums for categories, order status, and design workflow states

### Authentication & Authorization
- **Provider**: Replit Authentication with OpenID Connect protocol
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **Authorization**: Route-level protection with authentication middleware
- **User Management**: Complete user profile system with gamification features (XP, levels, titles)

### Gamification System
- **User Progression**: XP points, levels, and unlockable titles
- **Missions**: Completable challenges that reward users with points and unlock exclusive content
- **Creator Economy**: Submission system for user-generated designs with voting and royalty tracking

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL serverless with connection pooling
- **Authentication**: Replit Authentication service with OpenID Connect
- **Image Storage**: Unsplash for demo images (will need dedicated CDN for production)

### Payment Processing
- **Stripe**: React Stripe.js integration for payment processing and subscription management

### Development Tools
- **Replit**: Development environment with integrated deployment and domain management
- **TypeScript**: End-to-end type safety across client, server, and shared modules
- **ESBuild**: Fast bundling for production server builds

### UI/UX Libraries
- **Radix UI**: Accessible component primitives for complex interactions
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Lucide React**: Consistent icon system
- **React Hook Form**: Form state management with validation

### Third-Party Integrations
- **Dropshipping Sources**: AliExpress, Taobao, 1688, and Temu for product sourcing (future implementation)
- **Email Service**: Will require integration for notifications and marketing
- **Analytics**: Will need analytics platform for user behavior tracking
- **Social Media APIs**: Future integration for content sharing and social login options