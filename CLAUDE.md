# Sharkbox Frontend - Documentation

## Project Overview

This is a React frontend application for Sharkbox, a Reddit-like social platform. The frontend is built with modern React best practices, follows DRY principles, and is designed to be maintainable and extensible.

## Technology Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server (faster than Create React App)
- **React Router DOM 7** - Client-side routing
- **React OIDC Context** - OIDC/OAuth2 authentication (supports any OIDC provider)
- **Axios** - HTTP client for API calls
- **TanStack Query (React Query)** - Server state management and data fetching
- **date-fns** - Date formatting utilities
- **clsx** - Conditional class name utility

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.jsx   # Main navigation bar
│   ├── BoxCard.jsx     # Box (subreddit) preview card
│   ├── ThreadCard.jsx  # Thread (post) preview card
│   ├── Comment.jsx     # Comment component
│   ├── VoteButtons.jsx # Reusable voting UI
│   └── PrivateRoute.jsx # Route protection component
├── pages/              # Page components (route-level)
│   ├── HomePage.jsx    # Home page (all boxes)
│   ├── BoxPage.jsx     # Box detail page (threads list)
│   ├── ThreadPage.jsx  # Thread detail page (with comments)
│   ├── LoginPage.jsx   # Login redirect page
│   └── CallbackPage.jsx # OIDC callback handler
├── services/           # API service layer
│   ├── api.js          # Axios instance with interceptors
│   ├── boxService.js   # Box-related API calls
│   ├── threadService.js # Thread-related API calls
│   ├── commentService.js # Comment-related API calls
│   └── authService.js  # Auth-related API calls
├── hooks/              # Custom React hooks
│   └── useAuth.js      # Authentication hook wrapper
├── utils/              # Utility functions
│   ├── format.js       # Date/number formatting
│   └── cn.js           # Class name utility
├── config/             # Configuration files
│   ├── env.js          # Environment variables
│   └── oidc.js         # OIDC configuration
├── App.jsx             # Main app component with routing
└── main.jsx            # Application entry point
```

## Key Features

### Authentication
- **OIDC/OAuth2** support via `react-oidc-context`
- Configurable to work with any OIDC provider (currently Keycloak)
- Automatic token refresh
- Protected routes via `PrivateRoute` component
- Authentication state managed globally

### API Integration
- Centralized API client with interceptors
- Automatic token injection in requests
- Error handling (401 redirects to login)
- Service layer pattern for clean separation

### Data Fetching
- TanStack Query for server state management
- Automatic caching and refetching
- Optimistic updates for mutations
- Loading and error states handled consistently

### UI/UX
- Dark theme (Reddit-inspired)
- Responsive design
- Accessible components
- Consistent styling with CSS modules approach
- Loading states and error handling

## Configuration

### Environment Variables

Create a `.env` file (or copy from `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_OIDC_AUTHORITY=http://localhost:9080/realms/sharkbox
VITE_OIDC_CLIENT_ID=sharkbox-client
VITE_APP_BASE_URL=http://localhost:5173
```

**Note:** All environment variables must be prefixed with `VITE_` to be accessible in the browser (Vite requirement).

### OIDC Configuration

OIDC configuration is in `src/config/oidc.js`. To use a different OIDC provider:

1. Update `VITE_OIDC_AUTHORITY` to point to your provider
2. Update `VITE_OIDC_CLIENT_ID` with your client ID
3. Ensure your OIDC provider allows the redirect URI: `{VITE_APP_BASE_URL}/callback`

## Development

### Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see Configuration section)

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Testing

### Linting and Tests

Always lint before running tests in CI and locally for fast feedback.

```bash
# Lint (fail on warnings in CI)
npm run lint
```

The project uses two testing frameworks:

**Unit Tests (Vitest):**
```bash
# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

**E2E Tests (Playwright):**
```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run all tests (unit + E2E)
npm run test:all
```

### Testing Best Practices

⚠️ **IMPORTANT: Always run tests after making changes!**

#### Testing Checklist

**Before Every Commit:**
- ✅ Run `npm run lint` and fix issues
- ✅ Run `npm run test` to ensure all unit tests pass
- ✅ Run `npm run test:e2e` to ensure E2E tests pass
- ✅ Fix any failing tests before committing
- ✅ Ensure code coverage hasn't significantly decreased

**When Adding New Features:**
- ✅ **MUST** write unit tests for new components (`src/components/__tests__/`)
- ✅ **MUST** write unit tests for new utility functions (`src/utils/__tests__/`)
- ✅ **MUST** write unit tests for new service functions (`src/services/__tests__/`)
- ✅ **SHOULD** write E2E tests for new user-facing features (`e2e/`)
- ✅ **MUST** update existing tests if behavior changes

**When Fixing Bugs:**
- ✅ Write a test that reproduces the bug first (TDD approach)
- ✅ Fix the bug
- ✅ Ensure the test passes
- ✅ Run full test suite to ensure no regressions

**Test Coverage Goals:**
- Aim for >80% code coverage
- Focus on critical paths and business logic
- Test edge cases and error handling

**Writing Good Tests:**
- Use descriptive test names
- Test one thing per test case
- Keep tests independent and isolated
- Mock external dependencies (API calls, etc.)
- Use `@testing-library` best practices for React components

**Test File Organization:**
- Unit tests: `src/**/__tests__/*.test.jsx` or `*.test.js`
- E2E tests: `e2e/*.spec.js`
- Test utilities: `src/test/utils/`

### Test Commands Reference

| Command | Description |
|---------|-------------|
| `npm run test` | Run unit tests in watch mode |
| `npm run test:ui` | Run unit tests with Vitest UI |
| `npm run test:coverage` | Run unit tests with coverage report |
| `npm run test:e2e` | Run all E2E tests |
| `npm run test:e2e:ui` | Run E2E tests with Playwright UI |
| `npm run test:all` | Run both unit and E2E tests |

## Architecture Decisions

### Why Vite over Create React App?
- Faster development server
- Faster builds
- Better developer experience
- Modern tooling

### Why TanStack Query?
- Reduces boilerplate for data fetching
- Built-in caching and refetching
- Optimistic updates
- Better error handling
- Reduces need for global state management

### Why Service Layer Pattern?
- Separation of concerns
- Easy to test
- Centralized API logic
- Easy to mock for testing
- DRY principle (no duplicate API calls)

### Why Component-Based Architecture?
- Reusability (VoteButtons, BoxCard, etc.)
- Easy to maintain
- Clear responsibilities
- Testable components

### Authentication Approach
- `react-oidc-context` handles all OIDC flows
- Wrapped in custom `useAuth` hook for consistent interface
- Tokens stored securely by the library
- Automatic token refresh
- Works with any OIDC provider (not just Keycloak)

## API Integration

The backend API is documented via OpenAPI 3.0 at `http://localhost:8080/api/docs`.

### Endpoints Used

- `GET /api/v1/box` - Get all boxes
- `GET /api/v1/box/{slug}` - Get box by slug
- `GET /api/v1/box/{slug}/threads` - Get threads in a box
- `GET /api/v1/thread/{id}` - Get thread by ID
- `POST /api/v1/box/{slug}/thread` - Create thread
- `PATCH /api/v1/thread/{id}` - Vote on thread
- `GET /api/v1/comment/{threadId}` - Get comments
- `POST /api/v1/comment/{threadId}` - Create comment
- `PATCH /api/v1/comment/{threadId}/{commentId}` - Vote on comment

### Authentication
- All authenticated endpoints require a Bearer token
- Token is automatically injected via axios interceptor
- Token is obtained from OIDC authentication flow

## Styling Approach

- CSS files co-located with components
- Dark theme with Reddit-inspired color scheme
- Consistent spacing and typography
- Responsive design with flexbox/grid
- No CSS-in-JS to keep bundle size small

### Color Palette
- Background: `#030303`
- Card Background: `#1a1a1b`
- Border: `#343536`
- Text Primary: `#d7dadc`
- Text Secondary: `#818384`
- Accent (Orange): `#ff4500`
- Accent (Blue): `#7193ff`

## Best Practices Followed

1. **DRY (Don't Repeat Yourself)**
   - Reusable components (VoteButtons, BoxCard, etc.)
   - Service layer for API calls
   - Utility functions for common operations
   - Custom hooks for shared logic

2. **Single Responsibility Principle**
   - Each component has a clear purpose
   - Services handle specific domains
   - Utils are pure functions

3. **Separation of Concerns**
   - Components handle UI
   - Services handle API calls
   - Hooks handle state/logic
   - Config handles configuration

4. **Error Handling**
   - Try-catch in service layer
   - Error states in UI
   - 401 redirects to login
   - User-friendly error messages

5. **Performance**
   - Code splitting via React.lazy (can be added)
   - Query caching via TanStack Query
   - Optimistic updates for better UX
   - Memoization where appropriate

6. **Maintainability**
   - Clear file structure
   - Consistent naming conventions
   - JSDoc comments for functions
   - Modular architecture

7. **Accessibility**
   - Semantic HTML
   - ARIA labels where appropriate
   - Keyboard navigation support
   - Focus management

## Future Enhancements

### Completed Improvements ✅

- [x] Add code splitting with React.lazy - **COMPLETED**: All pages are lazy-loaded with Suspense fallbacks
- [x] Add loading skeletons - **COMPLETED**: Skeleton components for ThreadCard, BoxCard, Comment, and Page
- [x] Add error boundaries - **COMPLETED**: ErrorBoundary component wraps the entire app
- [x] Add thread creation page - **COMPLETED**: CreateThreadPage at `/b/:slug/submit` with full form
- [x] Add box creation page - **COMPLETED**: CreateBoxPage at `/create-box` with validation
- [x] Add edit functionality - **COMPLETED**: EditThreadPage and EditableComment component for inline editing
- [x] Add infinite scroll for pagination - **COMPLETED**: BoxPage uses useInfiniteQuery with Intersection Observer
- [x] Add dark/light theme toggle - **COMPLETED**: ThemeContext with toggle button, CSS variables throughout

### Completed Improvements (Continued) ✅

- [x] Add unit tests with Vitest - **COMPLETED**: Test framework configured with example tests for components, utils, and services
- [x] Add E2E tests with Playwright - **COMPLETED**: E2E test suite configured with tests for homepage, navigation, and auth flows

### Remaining Improvements

- [ ] Add delete functionality - Delete buttons for threads/comments (requires backend API support)
- [ ] Add search functionality - Search threads, boxes, and comments
- [ ] Add real-time updates (WebSocket) - Real-time notifications and live updates
- [ ] Add notifications - Notification system for replies, votes, etc.
- [ ] Add user profiles - User profile pages with activity history
- [ ] Add i18n support - Internationalization for multiple languages

## Troubleshooting

### Authentication not working
- Check that Keycloak is running at `http://localhost:9080`
- Verify client ID is correct
- Check redirect URI is allowed in Keycloak client config
- Check browser console for errors

### API calls failing
- Verify backend is running at `http://localhost:8080`
- Check CORS settings on backend
- Verify token is being sent (check Network tab)
- Check API base URL in `.env`

### Build errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check Node.js version (should be 18+)

## License

[Add your license here]

## Contributing

[Add contributing guidelines here]

