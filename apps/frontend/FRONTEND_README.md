# Sales Dashboard Frontend

A modern Angular application for the Sales Dashboard with authentication and dashboard functionality.

## Features

- **Login Page**: Secure authentication with demo credentials
- **Home Dashboard**: Overview of sales data with key metrics
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations

## Pages

### Login Page (`/login`)

- Beautiful gradient background
- Form validation
- Loading states
- Error handling
- Demo credentials display

**Demo Credentials:**

- Username: `admin`
- Password: `password`

### Home Dashboard (`/home`)

- **Header**: Navigation with user info and logout button
- **Stats Cards**: Key metrics display
  - Total Records
  - Total Revenue
  - Total Profit
  - Number of Regions
- **Quick Actions**: Buttons for common tasks
  - View Sales Data
  - View Analytics
  - Export Data
- **System Status**: Real-time status indicators
- **Responsive Layout**: Adapts to different screen sizes

## Getting Started

### Prerequisites

- Node.js and npm/yarn
- Angular CLI
- Backend server running on port 3000

### Installation

```bash
# Install dependencies
yarn install

# Start the frontend development server
nx serve frontend

# Start the backend server (in another terminal)
nx serve backend
```

### Access the Application

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api

## Development

### Project Structure

```
apps/frontend/src/app/
├── components/
│   ├── login/
│   │   ├── login.component.ts
│   │   ├── login.component.html
│   │   └── login.component.scss
│   └── home/
│       ├── home.component.ts
│       ├── home.component.html
│       └── home.component.scss
├── app.ts
├── app.html
├── app.scss
└── app.routes.ts
```

### Key Components

#### LoginComponent

- Handles user authentication
- Form validation and error handling
- Redirects to dashboard on successful login
- Stores authentication state in localStorage

#### HomeComponent

- Displays sales dashboard overview
- Fetches data from backend API
- Shows loading states and error handling
- Provides logout functionality

### Styling

- Uses SCSS for styling
- Responsive design with CSS Grid and Flexbox
- Modern color scheme and typography
- Smooth animations and transitions

### Authentication

- Simple localStorage-based authentication
- Route guards for protected pages
- Automatic redirect to login for unauthenticated users

## API Integration

The frontend integrates with the backend API endpoints:

- `GET /api/sales/summary` - Dashboard overview data
- Additional endpoints for future features

## Future Enhancements

- [ ] Sales data table view
- [ ] Analytics charts and graphs
- [ ] Data export functionality
- [ ] User management
- [ ] Advanced filtering and search
- [ ] Real-time data updates
- [ ] Dark mode theme
- [ ] Multi-language support

## Technologies Used

- **Angular 20**: Modern web framework
- **TypeScript**: Type-safe JavaScript
- **SCSS**: Advanced CSS preprocessing
- **Angular Router**: Client-side routing
- **Fetch API**: HTTP requests to backend
- **LocalStorage**: Client-side data persistence
