# Installation Guide for NanoGen

Welcome to NanoGen! This guide will help you set up the website on your computer or server. It is designed for complete beginners.

## Prerequisites

Before you start, you need to have the following installed on your computer:

1.  **Node.js**: This is the environment that runs the website.
    -   Download and install the "LTS" version from [nodejs.org](https://nodejs.org/).
2.  **Git**: (Optional) To download the code if you haven't already.
    -   Download from [git-scm.com](https://git-scm.com/).

## Step 1: Download the Project

If you have the project folder already, open your terminal (Command Prompt on Windows, Terminal on Mac/Linux) and navigate to the project folder:

```bash
cd path/to/project
```

## Step 2: Install Dependencies

Run the following command to install all the necessary libraries. This might take a few minutes.

```bash
npm install
```

## Step 3: Configure the Database

This project uses a local SQLite database, so you don't need to install any external database software.

1.  **Create the Environment File**:
    Create a file named `.env` in the root folder (where `package.json` is).
    Add the following line to it:

    ```env
    DATABASE_URL="file:./dev.db"
    NANO_API_KEY="sk-5bcff1f3bfd34e7788d1210688f9a38f"
    ```
    *(Note: Replace the API key if you have your own)*

2.  **Set up the Database Tables**:
    Run this command to create the database file (`dev.db`) and set up the tables:

    ```bash
    npx prisma migrate dev --name init
    ```

    You should see a message saying "Your database is now in sync with your schema."

## Step 4: Run the Application

Now you are ready to start the website!

1.  **Start the development server**:

    ```bash
    npm run dev
    ```

2.  **Open your browser**:
    Go to `http://localhost:3000`.

    You should see the NanoGen homepage!

## Troubleshooting

-   **"Command not found"**: Make sure Node.js is installed and you restarted your terminal.
-   **Database errors**: Try deleting the `dev.db` file and running `npx prisma migrate dev --name init` again.
-   **Port in use**: If port 3000 is taken, the app will try 3001. Check the terminal output.

## Building for Production

If you want to run this on a public server:

1.  Run `npm run build`
2.  Run `npm start`
