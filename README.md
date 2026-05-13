# EchoPrep Frontend

React + Vite single-page app for the EchoPrep interview practice experience.

## Stack

- React 18
- Vite 5
- React Router 6
- Tailwind CSS
- Axios
- Vitest + Testing Library

## Prerequisites

- Node.js `>= 20.11.0`
- npm `>= 10`
- The monorepo dependencies installed from the repo root

## Setup

From the repository root:

```bash
npm install
cp echoprep-frontend/.env.example echoprep-frontend/.env
```

Frontend env:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Run locally

```bash
npm run dev
```

Default Vite dev URL:

- `http://localhost:5173`

## Build and preview

```bash
npm run build --workspace echoprep-frontend
npm run preview --workspace echoprep-frontend
```

## Scripts

- `npm run dev` - start the Vite dev server
- `npm run build` - create a production build
- `npm run preview` - serve the production build locally
- `npm test` - run Vitest once
- `npm run test:watch` - run Vitest in watch mode
- `npm run lint` - lint `src` and `test`
- `npm run format` - format supported files with Prettier
- `npm run format:check` - check formatting without writing

## App structure

- [`src/main.jsx`](./src/main.jsx) - React entry point
- [`src/App.jsx`](./src/App.jsx) - app shell and providers
- [`src/router.jsx`](./src/router.jsx) - route definitions and auth guards
- [`src/pages/`](./src/pages) - top-level screens
- [`src/components/`](./src/components) - shared UI and page sections
- [`src/hooks/`](./src/hooks) - data-fetching and client-side state hooks
- [`src/services/`](./src/services) - API client and request wrappers
- [`src/context/`](./src/context) - React context providers
- [`test/`](./test) - property-style and integration-style frontend tests

## Routes

Public routes:

- `/`
- `/login`
- `/register`
- `/forgot-password`

Protected routes:

- `/dashboard`
- `/sessions/new`
- `/sessions/:sessionId/run`
- `/sessions/:sessionId/review`
- `/settings`

## Backend contract

The frontend expects the backend API to live under `VITE_API_BASE_URL` and to
return the shared response envelope:

- success: `{ success: true, data: ... }`
- failure: `{ success: false, error: { code, message } }`

Authentication is JWT-based and the token is stored in `localStorage` under
`echoprep_token`.

## Notes

- This workspace reads its own `.env` file.
- For a full local run, start the backend workspace as well.
- Lint passes in the current repo state. Some existing UI tests are currently
  stricter than the rendered copy and formatting in a few review/score views, so
  treat failing Vitest output there as test drift before assuming a broken app.
