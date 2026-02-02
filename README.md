# Le Pas Sage CMS

Sophisticated content management system for Le Pas Sage e-commerce platform.

## Tech Stack

- **React 18.3** - UI library
- **Vite 6** - Build tool and dev server
- **TypeScript 5** - Type safety
- **React Router 6** - Client-side routing
- **TanStack React Query 5** - Server state management
- **Axios 1.7** - HTTP client
- **React Hook Form 7** - Form handling
- **Zod 3** - Schema validation
- **Tailwind CSS 3** - Styling
- **Lucide React** - Icons
- **date-fns 4** - Date manipulation
- **js-cookie 3** - Cookie management

## Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3001`

## Project Status

### ✅ Completed Phases

**Phase 1-3: Foundation** (100%)
- Vite + React + TypeScript setup
- Tailwind CSS with sage/gold design system
- Axios instance with token refresh
- API endpoints configuration
- Global types and utilities

**Phase 4: Authentication** (100%)
- AuthContext with login/logout
- Token management (cookies)
- LoginPage with form validation
- Protected routes

**Phase 5: Routing & Layout** (100%)
- React Router configuration
- AdminLayout with Sidebar + Header
- Navigation system
- Protected route guards

**Phase 6: UI Components** (100%)
- 15 core components migrated:
  - Button, Input, Card, Badge
  - Table, Modal, Pagination
  - Select, Textarea, Checkbox
  - Skeleton, LoadingSpinner
  - EmptyState

**Phase 7: Dashboard** (100%)
- Dashboard page with stats cards
- API integration
- Loading states

**Phase 8: Products** (80%)
- Products listing page
- Product service & hooks
- Table with pagination
- Basic CRUD setup

### 🚧 In Progress / Pending

**Products Feature** (Remaining 20%)
- Product create/edit forms
- Image upload component
- Bulk operations
- Filters and search

**Future Phases**
- Categories management
- Orders management
- Customers management
- Shipping (Andreani)
- Reports & Analytics
- Settings

## Architecture

```
src/
├── components/
│   ├── ui/              # 15 reusable components
│   └── layout/          # AdminLayout, Sidebar, Header
├── features/            # Feature modules
│   ├── auth/           # Authentication (✅ complete)
│   ├── dashboard/      # Dashboard (✅ complete)
│   └── products/       # Products (🚧 in progress)
├── hooks/              # Global hooks
├── lib/                # Utilities
├── router/             # React Router config
├── services/           # API client
├── store/              # Context providers
├── styles/             # Global styles
└── types/              # TypeScript types
```

## Key Features Implemented

✅ Token-based authentication with auto-refresh
✅ Sophisticated sage/gold design system
✅ Responsive admin layout with sidebar
✅ Loading states and skeleton loaders
✅ Toast notifications system
✅ Table component with sorting & selection
✅ Pagination component
✅ Protected routes
✅ Dashboard with stats
✅ Products listing with API integration

## API Integration

All requests go through `/api/v1` proxy:

- Authentication: `/auth/login`, `/auth/refresh`
- Dashboard: `/admin/dashboard`
- Products: `/admin/products`
- (More endpoints pending implementation)

Backend must be running on `http://localhost:8000`

## Design System

- **Colors**: Sage Black, Gold, Grayscale
- **Fonts**: Inter (sans), Playfair Display (serif)
- **Animations**: Fade, slide, scale, shimmer
- **Components**: Consistent sage/gold aesthetic

## License

Proprietary - Le Pas Sage
