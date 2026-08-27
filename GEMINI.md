# Gemini Project Context: BBGAN Portfolio

This document provides context for the BBGAN Portfolio project. It is a Next.js application that serves as a personal portfolio.

## Project Overview

This is a modern, responsive personal portfolio website for a user who goes by "BBGAN309". The site is built with Next.js (using the App Router) and TypeScript. It features a clean, single-page design with multiple sections (Hero, About, Skills, etc.) and a special "Performance" section.

### Key Technologies

-   **Framework:** Next.js
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **UI Components:** Radix UI (for primitives like Dialog)
-   **Animations:** Framer Motion
-   **Linting/Formatting:** ESLint

### Architecture

The project follows the standard Next.js App Router structure:

-   **`src/app/`**: Contains the pages and API routes.
    -   `page.tsx`: The main landing page, which composes the different sections of the portfolio.
    -   `layout.tsx`: The root layout.
    -   `api/`: Contains backend API endpoints.
-   **`src/components/`**: Contains reusable React components used throughout the application.
-   **`src/lib/`**: Contains library code, including the database and authentication logic for the "Performance" feature.
-   **`public/`**: Contains static assets, including uploaded images for the "Performance" feature.
-   **`data/`**: Contains the JSON file that acts as the database for the "Performance" feature.

### "Performance" Feature

A key feature of this portfolio is a "Performance" gallery. This is a section where the user can showcase projects, performances, or other entries.

-   **Data Store:** The data is stored in a simple file-based database at `data/performance/entries.json`. The logic for interacting with this file (CRUD operations) is in `src/lib/performance-db.ts`.
-   **Authentication:** The admin area (`/performance/admin`) is protected by a session-based authentication system found in `src/lib/performance-auth.ts`. It uses a secret key defined in the `PERFORMANCE_ADMIN_KEY` environment variable.
-   **Image Uploads:** The system supports image uploads for entries, which are stored in `public/uploads/performance/`.

## Building and Running

### Prerequisites

-   Node.js
-   npm, yarn, or pnpm

### Running the Development Server

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Run the development server:
    ```bash
    npm run dev
    ```
    The application will be available at [http://localhost:3000](http://localhost:3000).

### Key Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Creates a production-ready build of the application.
-   `npm run start`: Starts the production server (requires a build to be created first).
-   `npm run lint`: Lints the codebase using ESLint.

## Development Conventions

-   **Components:** Reusable components are located in `src/components`.
-   **Styling:** Utility-first styling is done with Tailwind CSS.
-   **State Management:** Component-level state is managed with React hooks (`useState`, `useEffect`).
-   **API:** Backend logic is handled via API routes in `src/app/api`.
-   **Authentication:** The "Performance" admin feature has its own authentication logic. API routes related to this feature should be protected using the `isAdminAuthorized` function from `src/lib/performance-auth.ts`.
-   **Database:** All database interactions for the "Performance" feature should go through the functions provided in `src/lib/performance-db.ts`.
