# Feedback System Frontend

This is the React frontend for the Evaluation Feedback System, converted from the original Laravel application.

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

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable components
│   └── Layout.tsx      # Main layout with sidebar
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── ITSupportStudent.tsx
│   ├── CourseEvaluation.tsx
│   ├── CafeteriaStudent.tsx
│   ├── ClassStudent.tsx
│   ├── CourseFeedbackFaculty.tsx
│   ├── ITSupport.tsx
│   └── UserManagement.tsx
├── App.tsx             # Main app component with routing
├── main.tsx            # Entry point
└── index.css           # Global styles with Tailwind
```

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

### Key Features

1. **Responsive Sidebar Navigation**: Collapsible sidebar with role-based navigation
2. **Modern UI Components**: Clean, accessible components
3. **Form Handling**: Controlled forms with validation
4. **State Management**: React hooks for local state
5. **Routing**: Client-side routing with React Router

## Deployment

To build for production:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Add proper error handling
4. Test your changes thoroughly
5. Update documentation as needed
