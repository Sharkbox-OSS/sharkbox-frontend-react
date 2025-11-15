# Sharkbox Frontend

A modern React frontend for Sharkbox, a Reddit-like social platform.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your settings:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_OIDC_AUTHORITY=http://localhost:9080/realms/sharkbox
   VITE_OIDC_CLIENT_ID=sharkbox-client
   VITE_APP_BASE_URL=http://localhost:5173
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## Prerequisites

- Node.js 18+ 
- Backend API running at `http://localhost:8080`
- Keycloak (or OIDC provider) running at `http://localhost:9080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- React 19
- Vite
- React Router DOM 7
- TanStack Query
- React OIDC Context
- Axios
- Tailwind CSS

## Project Structure

See [CLAUDE.md](./CLAUDE.md) for detailed documentation.

## Authentication

The app uses OIDC for authentication. Currently configured for Keycloak, but can work with any OIDC provider by updating the environment variables.

## License

[Add your license here]
