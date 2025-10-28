# SapuLidi

SapuLidi is a web application built to manage and classify trash-related articles and data. It provides a platform for administrators to create and manage articles, and for users to browse articles and use a trash classification tool.

## Features

*   **User Authentication:** Secure user sign-up and login functionality using Supabase Auth.
*   **Role-Based Access Control:** Differentiates between regular users and administrators, with specific privileges for admins.
*   **Article Management (Admin):** Admins can create, edit, and delete articles.
*   **Public Article Viewing:** All users can browse and read articles.
*   **Trash Classification:** A tool to classify trash based on text input (Note: current implementation is a placeholder).
*   **User Profiles:** Users can view and edit their profiles, including uploading a custom avatar.
*   **Admin Dashboard:** A dashboard for administrators to view statistics like total users, articles, and classifications.

## Tech Stack

*   **Frontend:**
    *   **Framework:** [React](https://reactjs.org/)
    *   **Build Tool:** [Vite](https://vitejs.dev/)
    *   **Language:** [TypeScript](https://www.typescriptlang.org/)
    *   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
    *   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
*   **Backend & Database:**
    *   [Supabase](https://supabase.io/) - Used for database, authentication, and storage.
*   **Routing:**
    *   [React Router](https://reactrouter.com/)
*   **Data Fetching/State Management:**
    *   [TanStack Query](https://tanstack.com/query/v5)
*   **Form Handling:**
    *   [React Hook Form](https://react-hook-form.com/)
    *   [Zod](https://zod.dev/) (for validation)
*   **Data Visualization:**
    *   [Recharts](https://recharts.org/)
    *   [Chart.js](https://www.chartjs.org/)

## Getting Started

### Prerequisites

*   Node.js and npm (or bun)
*   A Supabase project

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/trash-talk-cms.git
    cd trash-talk-cms
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    or
    ```bash
    bun install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Supabase project URL and anon key:
    ```
    VITE_SUPABASE_URL=your-supabase-url
    VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

4.  **Set up the database:**
    Run the SQL scripts in the `database` directory in your Supabase SQL editor to create the necessary tables and policies.

    *   `articles_schema.sql`
    *   `profile_schema.sql`
    *   `classification_history.sql`

### Running the application

```bash
npm run dev
```

The application should now be running on `http://localhost:5173`.

## Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── integrations/    # Supabase client setup
│   ├── lib/             # Utility functions
│   ├── pages/           # Application pages/routes
│   └── ...
├── database/            # SQL schema files
└── ...
```
