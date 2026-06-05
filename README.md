# Resume Builder Application

A full-stack Resume Builder application that allows users to create, preview, and download professional resumes.

## Features
- **User Authentication**: Secure signup and login.
- **Real-Time Live Preview**: See changes to your resume as you type.
- **PDF Export**: Download the generated resume instantly.
- **Premium Design**: Modern, clean, and ATS-friendly UI.

## Prerequisites
- Node.js (v18+)
- npm (Node Package Manager)

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory.
   ```bash
   cd backend
   ```
2. Install dependencies.
   ```bash
   npm install
   ```
3. Start the server. This will also automatically create the `resume_builder.db` SQLite database file.
   ```bash
   node server.js
   ```
   The backend will run on `http://localhost:5000`.

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory.
   ```bash
   cd frontend
   ```
2. Install dependencies.
   ```bash
   npm install
   ```
3. Start the development server.
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

## Usage Guide
1. Open the frontend URL in your browser.
2. Click **Sign up** to create a new account, or **Log in** if you already have one.
3. Once logged in, you will be taken to the Resume Builder Workspace.
4. Fill out the **Personal Details**, **Work Experience**, **Education**, and **Skills** in the left-hand form pane.
5. Watch the **Live Preview** pane update instantly.
6. Click **Save Draft** to save your progress to the database.
7. Click **Export PDF** to download your finalized resume to your computer.

## Documentation
- Detailed Software Requirements Specification (SRS) can be found in `docs/SRS.md`.
- Database Schema details can be found in `docs/schema.md`.
