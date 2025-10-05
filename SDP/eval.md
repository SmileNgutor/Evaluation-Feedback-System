# AUN Evaluation System - Evaluation Flow Documentation

## 🔑 How Shared Evaluation Keys Work

The AUN Evaluation System uses shared evaluation keys while maintaining individual student privacy and session isolation. Here's how user answers are stored and managed:

## Flow with Shared Keys

### 1. **Key Validation & Session Creation**
```python
# Student starts evaluation with shared key
POST /eval/start/
{
  "department_id": 1,
  "key": "ABC123XY"  // Shared key used by many students
} 
```

### 2. **Unique Session Per Student**
```python
# Backend creates individual session
EvaluationSession.objects.create(
    student=current_user,           # Individual student
    department=department,
    evaluation_key=eval_key,        # Same shared key
    anonymous_identity="hash123"    # Unique anonymous ID
)
# Returns: {"session_id": 456}
```

### 3. **Answers Linked to Session**
```python
# Student submits answers
POST /eval/submit/
{
  "session_id": 456,  // Unique to this student
  "responses": [
    {"question_id": 10, "score": 4},
    {"question_id": 11, "score": 5}
  ]
}
```

## 🗄️ Database Storage Structure

```
EvaluationKey (Shared)
├── key: "ABC123XY"
├── department: Computer Science
├── usage_count: 25  // Increments for each student
└── usage_limit: 100

EvaluationSession (Per Student)
├── id: 456
├── student: StudentA (A00023143)  // Internal FK for session creation
├── evaluation_key: "ABC123XY"
├── anonymous_identity: "hash123"  // THIS is what's used for privacy
└── EvaluationResponse (Individual Answers)
    ├── question_id: 10, score: 4
    └── question_id: 11, score: 5

EvaluationSession (Different Student)
├── id: 457  
├── student: StudentB (A00023144)  // Internal FK for session creation
├── evaluation_key: "ABC123XY"  // Same key!
├── anonymous_identity: "hash456"  // THIS is what's displayed/exported
└── EvaluationResponse (Different Answers)
    ├── question_id: 10, score: 2
    └── question_id: 11, score: 3
```

## 🔒 Privacy & Anonymity

- **Session Isolation**: Each student gets their own `EvaluationSession`
- **Anonymous Identity**: The `anonymous_identity` hash is used in reports/analytics instead of student ID
- **Consistent Hash**: Each student gets the SAME hash across all evaluations (based on SECRET_KEY + AUN_ID + user_id)
- **Student FK**: The `student` foreign key is only for session creation and admin access - NOT used in exports
- **Key Tracking**: Shared key tracks total usage but not individual responses
- **Data Export**: CSV exports show `anonymous_identity`, not actual student IDs
- **Cross-Department Tracking**: Same student gets same hash when evaluating different departments

## 📊 Analytics Example

```python
# Staff can see aggregated data without identifying individuals
sessions = EvaluationSession.objects.filter(
    department=dept, 
    status="submitted"
)

# Average score per question (anonymous)
averages = EvaluationResponse.objects.filter(
    session__in=sessions
).values('question_id').annotate(avg_score=Avg('score'))

# Export shows anonymous hashes, not student IDs
for session in sessions:
    csv_row = [
        session.id,
        session.anonymous_identity,  # "hash123" - NOT student ID
        session.submitted_at,
        # ... response data
    ]
```

## 🎯 Key Benefits

1. **Resource Efficient**: One key serves many students
2. **Privacy Preserved**: Individual responses are separate
3. **Easy Distribution**: Share one key via email/announcement
4. **Usage Tracking**: Monitor how many students participated
5. **Anonymous Analytics**: Aggregate insights without revealing identity

## 🚀 API Endpoints Summary

### Student Flow
1. **GET** `/eval/questions/?department_id=1` - List questions for department
2. **POST** `/eval/start/` - Start evaluation with key
3. **POST** `/eval/submit/` - Submit answers

### Staff/Admin Flow
1. **GET** `/eval/department/1/sessions/` - List submitted sessions
2. **GET** `/eval/session/456/` - View specific session responses
3. **POST** `/eval/session/456/respond/` - Respond to evaluation
4. **GET** `/eval/department/1/analytics/` - View analytics
5. **GET** `/eval/department/1/export.csv` - Export data

### Question Management (Admin/Dept Head)
1. **GET/POST** `/eval/questions/manage/` - List/create questions
2. **PUT/PATCH/DELETE** `/eval/questions/123/` - Update/delete questions

## 🔐 Security Notes

- Shared keys are the "entry ticket" - once inside, each student has their own private evaluation session
- Anonymous identity hashing ensures privacy while allowing audit trails
- CSRF protection should be enabled in production (currently disabled for development)
- Session-based authentication ensures only verified users can participate

---

**The shared key is just the "entry ticket" - once inside, each student has their own private evaluation session!** 🎫➡️🔒
