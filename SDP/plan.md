# American University of Nigeria Evaluation System

## Student Flow
* Student signs in with their AUN details(ID Number, Email)
* Student selects what department they would like to evaluate
* Student enters a unique evaluation key
* Student selects a rating for each question related to their specific department evaluation.
* Student submits and awaits feedback (If applicable).

## Staff Flow
* Staff signs in with their unique AUN details(ID Number, Email)
* Staff selects department they belong to
* Staff views evaluations submitted for their department
* Staff responds to evaluations.* (Optional)
* Staff tracks evaluation trends and analytics for their department
* Staff manages their own profile and notification preferences
* Staff can escalate issues or feedback to admin (if needed)

## Dean/Chair/Cafeteria-Manager/IT Support Manager
* Everything in staff flow
* Addition of overlooking every evaluation in their departemnt.
* Manages evaluation questions (add, edit, delete)
* Generates and distributes unique evaluation keys
* exports evaluation data and reports

## Admin Flow
* Admin signs in with their unique AUN credentials (ID Number, Email)
* Admin selects the department or all departments to manage
* Admin views all submitted evaluations and analytics
* Admin manages evaluation questions (add, edit, delete)
* Admin generates and distributes unique evaluation keys
* Admin manages user accounts (students, staff)
* Admin exports evaluation data and reports
* Admin monitors system activity and feedback

### Application Flow
1. User accesses the application and selects their role (Student, Staff, Admin).
2. The backend authenticates the user using AUN credentials and assigns a session with role-based permissions.
3. Based on the authenticated role:
   - Student: Backend fetches available departments, validates evaluation key, retrieves department-specific questions, records submitted evaluations, and stores feedback.
   - Student: Backend fetches available departments, validates evaluation key, retrieves department-specific questions, records submitted evaluations, and stores feedback.
     - If the student is evaluating faculty, their identifying information (ID and email) is hashed and encrypted in the backend to ensure anonymity.
   - Staff: Backend retrieves evaluations for the staff's department, allows staff to submit responses/feedback, tracks analytics, and manages staff profile data.
   - Admin: Backend provides access to all evaluations and analytics, enables management of questions, departments, users, and evaluation keys, and supports data export and system monitoring.
4. All actions are logged for security and auditing. Backend enforces access control and data validation at every step.
5. Backend handles notifications, escalations, and feedback routing between users as needed.
6. The backend aggregates all submitted evaluations and periodically generates analytics reports (monthly and per semester) for departments and admins.
7. Users can log out, which ends their session and clears sensitive data from the backend.


