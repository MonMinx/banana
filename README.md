# NanoGen - AI Image Generator

NanoGen is a full-stack web application that mimics the functionality of NanoBanana Pro. It allows users to generate AI images, manage their profile, and purchase credits.

## Features

-   **AI Image Generation**: Integrated with Nano Banana API (Mock/Proxy).
-   **User Management**: Sign up, Login (Mock), and Profile management.
-   **Credit System**: Pay-per-use model with mock payment integration.
-   **Responsive UI**: Modern, dark-themed interface built with Tailwind CSS.

## Quick Links

-   [Installation Guide (For Beginners)](./INSTALL.md)
-   [User Manual](./USAGE.md)

## Tech Stack

-   **Frontend**: Next.js 16 (React), Tailwind CSS
-   **Backend**: Next.js API Routes
-   **Database**: SQLite with Prisma ORM
-   **Language**: TypeScript

## Project Structure

-   `app/`: Main application code (Pages, API routes, Components).
-   `prisma/`: Database schema and configuration.
-   `scripts/`: Utility scripts for testing.

## Getting Started

1.  `npm install`
2.  `npx prisma migrate dev --name init`
3.  `npm run dev`

See `INSTALL.md` for detailed instructions.
