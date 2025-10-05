# AUN Evaluation System - Authentication API

A Django-based REST API for the American University of Nigeria (AUN) evaluation platform authentication system. This backend provides secure user authentication, role-based access control, and evaluation key management.

## Features

- **Custom User Authentication**: AUN ID-based login system
- **Role-Based Access Control**: Support for Students, Staff, Department Heads, and Administrators
- **Evaluation Key Management**: Secure key generation and validation for evaluations
- **Supabase Integration**: PostgreSQL database with Supabase
- **Session Management**: Secure session tracking and management
- **Security Features**: Rate limiting, login attempt logging, and user verification
- **Interactive API Documentation**: Swagger UI, ReDoc, and OpenAPI 3.0 schema
- **RESTful API Design**: Clean, consistent API endpoints with proper HTTP methods

## User Roles

- **Student**: Can participate in department evaluations with anonymous options
- **Staff**: Can view and respond to evaluations for their department
- **Department Head**: Can manage evaluation keys for their department
- **Administrator**: Full system access including user management

## Setup Instructions

### Prerequisites

- Python 3.8+
- PostgreSQL (via Supabase)
- pip (Python package manager)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd SDP
   ```

2. **Create and activate virtual environment**

   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**

   Create a `.env` file in the root directory with the following variables:

   ```env
   # Django Settings
   SECRET_KEY=your-secret-key-here
   DEBUG=True

   # Supabase Database Configuration
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=your-supabase-password
   DB_HOST=db.your-project.supabase.co
   DB_PORT=5432

   # Supabase Project Settings
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. **Database Migration**

   ```bash
   python manage.py makemigrations auth
   python manage.py migrate
   ```

6. **Create Superuser**

   ```bash
   python manage.py createsuperuser
   ```

7. **Run Development Server**

   ```bash
   python manage.py runserver
   ```

8. **Access API Documentation**
   - **Swagger UI**: http://localhost:8000/api/docs/
   - **ReDoc**: http://localhost:8000/api/redoc/
   - **OpenAPI Schema**: http://localhost:8000/api/schema/

## API Endpoints

### Public Endpoints

#### `GET /auth/departments/`

Get list of departments for registration

- **Authentication:** None required
- **Payload:** None
- **Response:** List of active departments

#### `GET /auth/api/docs/`

Get complete API documentation (JSON format)

- **Authentication:** None required
- **Payload:** None
- **Response:** Detailed API documentation

#### `GET /api/docs/`

Interactive Swagger UI documentation

- **Authentication:** None required
- **Payload:** None
- **Response:** Interactive API documentation interface

#### `GET /api/redoc/`

ReDoc API documentation

- **Authentication:** None required
- **Payload:** None
- **Response:** ReDoc-styled API documentation

#### `GET /api/schema/`

OpenAPI 3.0 schema

- **Authentication:** None required
- **Payload:** None
- **Response:** OpenAPI 3.0 schema in JSON format

### Authentication

#### `POST /auth/register/`

User registration (requires admin verification)

- **Authentication:** None required
- **Payload:**
  ```json
  {
    "aun_id": "string (required) - AUN ID format A000xxx",
    "aun_email": "string (required) - Must end with @aun.edu.ng",
    "full_name": "string (required) - Full name",
    "password": "string (required) - User password",
    "role": "string (optional, default: student) - student|staff|department_head|admin",
    "department_id": "integer (optional) - Department ID for staff",
    "year_of_study": "integer (required for students) - Year of study",
    "major": "string (required for students) - Academic major",
    "position": "string (required for staff) - Job position",
    "phone_number": "string (optional) - Phone number"
  }
  ```

#### `POST /auth/login/`

User authentication

- **Authentication:** None required
- **Payload:**
  ```json
  {
    "aun_id": "string (required) - AUN ID",
    "password": "string (required) - User password"
  }
  ```

#### `POST /auth/logout/`

User logout

- **Authentication:** Required (logged in user)
- **Payload:** None

#### `GET /auth/dashboard/`

Get role-based dashboard data

- **Authentication:** Required (logged in user)
- **Payload:** None
- **Response:** User info, departments, role-specific data

### User Profile

#### `GET /auth/profile/`

Get user profile information

- **Authentication:** Required (logged in user)
- **Payload:** None
- **Response:** User profile data and recent sessions

#### `PUT|PATCH /auth/profile/`

Update user profile

- **Authentication:** Required (logged in user)
- **Payload:**
  ```json
  {
    "full_name": "string (optional) - Updated full name",
    "phone_number": "string (optional) - Updated phone number",
    "allow_feedback_contact": "boolean (optional) - Allow contact for feedback",
    "anonymous_evaluations": "boolean (optional, students only) - Enable anonymous evaluations",
    "year_of_study": "integer (optional, students only) - Year of study",
    "major": "string (optional, students only) - Academic major",
    "position": "string (optional, staff only) - Job position"
  }
  ```

### Evaluation Keys

#### `GET /auth/manage-keys/`

Get evaluation keys for management (Admin/Department Head only)

- **Authentication:** Required (admin or department_head role)
- **Payload:** None
- **Response:** List of evaluation keys and departments

#### `POST /auth/manage-keys/`

Create or manage evaluation keys (Admin/Department Head only)

- **Authentication:** Required (admin or department_head role)
- **Payload:**
  ```json
  {
    "action": "string (required) - create_key|deactivate_key",
    "department_id": "integer (required for create_key) - Department ID",
    "description": "string (optional) - Key description",
    "usage_limit": "integer (optional, default: 100) - Maximum uses",
    "valid_days": "integer (optional, default: 30) - Validity period in days",
    "key_id": "integer (required for deactivate_key) - Key ID to deactivate"
  }
  ```

#### `POST /auth/validate-key/`

Validate an evaluation key

- **Authentication:** None required
- **Payload:**
  ```json
  {
    "key": "string (required) - Evaluation key to validate",
    "department_id": "integer (required) - Department ID"
  }
  ```

### Administration

#### `GET /auth/admin/users/`

Get users list with filtering and pagination (Admin only)

- **Authentication:** Required (admin role)
- **Payload:** None
- **Query Parameters:**
  - `page`: integer (optional, default: 1) - Page number
  - `page_size`: integer (optional, default: 20) - Items per page
  - `search`: string (optional) - Search by AUN ID, name, or email
  - `role`: string (optional) - Filter by user role
  - `department`: string (optional) - Filter by department ID
- **Response:** Paginated user list with departments and roles

#### `PUT|PATCH /auth/admin/users/`

Manage user accounts (Admin only)

- **Authentication:** Required (admin role)
- **Payload:**
  ```json
  {
    "action": "string (required) - verify|deactivate|activate|change_role|change_department",
    "user_id": "integer (required) - Target user ID",
    "new_role": "string (required for change_role) - New user role",
    "department_id": "integer (optional for change_department) - New department ID (null to remove)"
  }
  ```

### Utility

#### `GET /auth/switch-role/`

Get user role context and permissions

- **Authentication:** Required (logged in user)
- **Payload:** None
- **Response:** Current role and available contexts with permissions

## Usage Examples

### User Registration

```javascript
const response = await fetch("/auth/register/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    aun_id: "A00023143",
    aun_email: "student.name@aun.edu.ng",
    full_name: "Student Name",
    password: "securepassword",
    role: "student",
    year_of_study: 3,
    major: "Computer Science",
    phone_number: "+2348012345678",
  }),
});
const data = await response.json();
// Note: User will need admin verification before full access
```

### Login

```javascript
const response = await fetch("/auth/login/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    aun_id: "A00023143",
    password: "userpassword",
  }),
});
const data = await response.json();
```

### Get Dashboard Data

```javascript
const response = await fetch("/auth/dashboard/", {
  credentials: "include", // Include session cookies
});
const data = await response.json();
```

### Create Evaluation Key (Admin/Dept Head)

```javascript
const response = await fetch("/auth/manage-keys/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  body: JSON.stringify({
    action: "create_key",
    department_id: 1,
    description: "Semester evaluation",
    usage_limit: 100,
    valid_days: 30,
  }),
});
```

## Database Models

### AUNUser

Custom user model with AUN-specific fields:

- `aun_id`: Unique AUN identifier
- `aun_email`: Official AUN email
- `role`: User role (student, staff, department_head, admin)
- `department`: Associated department
- `is_verified`: Account verification status

### Department

Academic/administrative departments:

- `name`: Department name
- `code`: Department code
- `description`: Department description

### EvaluationKey

Secure keys for accessing evaluations:

- `key`: Unique evaluation key
- `department`: Associated department
- `usage_limit`: Maximum number of uses
- `valid_until`: Expiration date

## Security Features

- **Rate Limiting**: Protection against brute force attacks
- **Session Management**: Secure session tracking
- **Login Logging**: All login attempts are logged
- **CORS Configuration**: Proper cross-origin resource sharing
- **Role-based Permissions**: Granular access control

## Frontend Integration

This API is designed to work with any frontend framework (React, Vue, Angular, etc.). Key considerations:

1. **Session-based Authentication**: Include credentials in requests
2. **CSRF Protection**: Handle CSRF tokens for state-changing operations
3. **Error Handling**: Check response status codes and handle errors appropriately
4. **Role-based UI**: Use user role information to show/hide features

## Environment Variables

Key environment variables for deployment:

- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode (False in production)
- `DB_*`: Database connection parameters
- `SUPABASE_*`: Supabase project configuration
- `ALLOWED_HOSTS`: Allowed hostnames

## Production Deployment

1. Set `DEBUG=False`
2. Configure proper `ALLOWED_HOSTS`
3. Use environment variables for sensitive data
4. Enable SSL/HTTPS
5. Set up proper logging
6. Configure static file serving

## API Documentation

The AUN Evaluation System provides comprehensive interactive API documentation:

- **Swagger UI** (`/api/docs/`): Interactive API documentation with try-it-out functionality
- **ReDoc** (`/api/redoc/`): Clean, responsive API documentation
- **OpenAPI Schema** (`/api/schema/`): Machine-readable OpenAPI 3.0 specification
- **Built-in Docs** (`/auth/api/docs/`): Custom JSON API documentation

### Using Swagger UI

1. Start the development server: `python manage.py runserver`
2. Open your browser to: `http://localhost:8000/api/docs/`
3. Explore all available endpoints with detailed schemas
4. Test API calls directly from the browser interface
5. View request/response examples for each endpoint

The Swagger UI includes:

- ✅ **Request/Response Schemas**: Detailed field specifications
- ✅ **Interactive Testing**: Try API calls directly from the browser
- ✅ **Authentication Support**: Test authenticated endpoints
- ✅ **Example Data**: Sample requests and responses
- ✅ **Role-Based Grouping**: Endpoints organized by functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is developed for the American University of Nigeria evaluation system.

## Support

For technical support or questions about the AUN evaluation system, contact the development team.
