# Evaluation Feedback System - React Frontend

This is the React frontend for the Evaluation Feedback System, converted from the original Laravel application.

## Project Structure

```
Evaluation-Feedback-System/
├── frontend/           # React application
│   ├── src/           # React source code
│   ├── public/        # Static assets
│   ├── package.json   # Dependencies
│   └── README.md      # Frontend documentation
├── .git/              # Git repository
├── .gitignore         # Git ignore rules
├── .editorconfig      # Editor configuration
├── .gitattributes     # Git attributes
└── README.md          # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal)

## Features

- **Modern React with TypeScript**: Built with Vite and React 18
- **Tailwind CSS**: Modern utility-first CSS framework
- **React Router**: Client-side routing
- **Lucide React**: Beautiful icons
- **Responsive Design**: Mobile-first approach

## Pages

- **Dashboard**: Overview of all system sections (Student, Faculty, Admin, Staff)
- **IT Support**: Submit and track IT support tickets
- **Course Evaluation**: Student course evaluation forms
- **Cafeteria Feedback**: Cafeteria service feedback
- **Maintenance**: Facility maintenance requests
- **User Management**: Admin user management interface
- **Authentication**: Login and registration pages

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client (for API calls)

## Development

The application is structured to work with a Django backend API. The frontend makes API calls to the backend for data operations.

## Deployment

To build for production:

```bash
cd frontend
npm run build
```

The built files will be in the `frontend/dist/` directory, ready for deployment to any static hosting service.

## Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Add proper error handling
4. Test your changes thoroughly
5. Update documentation as needed
