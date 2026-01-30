# User Manual for NanoGen

## Getting Started

1.  **Open the Website**: Navigate to the homepage (e.g., `http://localhost:3000`).
2.  **Navigation**: The top bar allows you to switch between the Generator, Pricing, and Profile pages.

## Features

### 1. Authentication (Login)
-   Click the "Login" button in the top right.
-   **Note**: This is a mock login system for demonstration.
-   Enter **any email address** (e.g., `test@example.com`) to sign in.
-   If the email hasn't been used before, a new account is automatically created with **5 free credits**.

### 2. Generating Images
-   Go to the **Generate** page (Home).
-   **Prompt**: Type a description of the image you want (e.g., "A futuristic cyberpunk city with neon lights").
-   **Generate**: Click the "Generate Image" button.
    -   Cost: 1 Credit per image.
    -   Time: It usually takes about 10-20 seconds.
-   **Result**: The image will appear below. You can click "Download High Res" to save it.

### 3. Buying Credits
-   Go to the **Pricing** page.
-   You will see three tiers: Starter ($5), Pro ($15), and Ultimate ($50).
-   Click "Choose Plan" to simulate a purchase.
-   Confirm the popup dialogue.
-   Your credits will be instantly added to your account.

### 4. User Profile
-   Click "Profile" in the navigation bar.
-   **Overview**: View your Email, Current Credits, and Role.
-   **History**: See a gallery of your previously generated images.
-   **Transactions**: View a log of your credit purchases (Mock payments).

## Admin / Advanced

-   **Database**: The data is stored in `dev.db`. You can view it using a tool like "DB Browser for SQLite" or using Prisma Studio:
    ```bash
    npx prisma studio
    ```
    This opens a web interface to manage users and view raw data.
