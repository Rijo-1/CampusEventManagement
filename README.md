# Event Management System

A modern event management system built with React, TypeScript, and Supabase. This application allows users to discover, register for, and manage events, with features like QR code ticketing, user authentication, and role-based access control.

## Features

- 🔐 **Authentication** - Secure user authentication with Supabase Auth
- 🎟️ **Event Management** - Create, view, and manage events
- 📱 **QR Code Tickets** - Generate and scan QR code tickets for event check-ins
- 📊 **User Profiles** - Personal profiles with event history and preferences
- 🏛️ **College Integration** - Connect with educational institutions
- 🤖 **AI Report Generator** - Automatically generate detailed event reports and insights

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **UI Components**: Lucide React Icons
- **PDF Generation**: jsPDF
- **QR Codes**: qrcode

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd project-directory
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/       # Reusable UI components
├── context/         # React context providers
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and API clients
└── App.tsx          # Main application component
```



## AI Guidance Screenshots

Here are some examples of the AI guidance in action:

1. ![AI Guidance 1](https://example.com/ai-guidance-1.png)
2. ![AI Guidance 2](https://example.com/ai-guidance-2.png)
3. ![AI Guidance 3](https://example.com/ai-guidance-3.png)
4. ![AI Guidance 4](https://example.com/ai-guidance-4.png)

## App Screenshots

### Dashboard
![Dashboard](https://example.com/dashboard-screenshot.png)

### Event Management
![Event Management](https://example.com/events-screenshot.png)

### User Profile
![User Profile](https://example.com/profile-screenshot.png)

### QR Ticket
![QR Ticket](https://example.com/ticket-screenshot.png)

## Environment Setup

1. Create a new project in [Supabase](https://supabase.com/)
2. Set up the required database tables using the SQL migrations in `supabase/migrations/`
3. Configure authentication providers in Supabase Dashboard
4. Update the environment variables in `.env`





---


