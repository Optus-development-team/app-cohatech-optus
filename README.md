# app-cohatech-optus

Frontend base built with Next.js, React, TypeScript and pnpm.

## Stack

- Next.js as the application framework and routing layer.
- React for the UI component model.
- TypeScript for static typing and safer refactors.
- pnpm as the package manager.

## Project Structure

- `src/app` for the app shell, pages and global styles.
- `src/components` for reusable UI components.
- `src/features` for feature-oriented modules and business UI.
- `src/services` for API clients and external integrations.
- `src/lib` for shared utilities and framework helpers.
- `src/config` for environment and app configuration.
- `src/constants` for shared constants.
- `src/hooks` for reusable React hooks.
- `src/providers` for context providers and app-level wrappers.
- `src/styles` for design tokens, styles and CSS helpers.
- `src/types` for shared TypeScript types.
- `src/utils` for general-purpose helper functions.

## Scripts

- `pnpm dev` starts the development server.
- `pnpm build` creates a production build.
- `pnpm start` runs the production server.
- `pnpm lint` runs linting.
- `pnpm typecheck` validates TypeScript types.

## Notes

- The project is prepared to grow as a structured frontend, with clear separation between UI, features and shared utilities.
- The default app entry lives in `src/app/page.tsx` and can be replaced by feature-driven pages as the project grows.
