````markdown
```markdown
# Server - Simple Project Task

Setup:
1. Copy .env.example to .env and set MONGO_URI and JWT_SECRET.
2. Install dependencies:
   cd server
   npm install
3. Run:
   npm run dev

Endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/tasks?page=1&limit=10 (default assignedOnly=true)
- POST /api/tasks
- GET /api/tasks/:id
- PUT /api/tasks/:id
- PATCH /api/tasks/:id/status
- DELETE /api/tasks/:id
```
````
