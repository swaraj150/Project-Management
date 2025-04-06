# API Documentation

## Base URL
```
http://localhost:8000/api/v1
```

---

## Users

### Sign In
**Endpoint:** `POST /users/signin`

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": { "...userObj" },
  "token": "string"
}
```

---

### Sign Up
**Endpoint:** `POST /users/signup`

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": { "...userObj" },
  "token": "string"
}
```

---

### Google Sign In/Sign Up
**Endpoint:** `POST /users/google`

**Request Body:**
```json
{
  "accessToken": "string"
}
```

**Response:**
```json
{
  "user": { "...userObj" },
  "token": "string"
}
```

---

### GitHub Sign In/Sign Up
**Endpoint:** `POST /users/github`

**Request Body:**
```json
{
  "code": "string"
}
```

**Response:**
```json
{
  "user": { "...userObj" },
  "token": "string"
}
```

---

### Get User Info (by access token)
**Endpoint:** `GET /users/me`

**Response:**
```json
{
  "user": { "...userObj" }
}
```

---

### Get User Info (by id)
**Endpoint:** `GET /users/{userId}`

**Response:**
```json
{
  "user": { "...userObj" }
}
```

---

### Update Project Role
**Endpoint:** `PATCH /users/project-role`

**Request Body:**
```json
{
  "userId": "string",
  "role": "string"
}
```

**Response:**
```json
{
  "message": "string"
}
```

---

## Organizations

### Create Organization
**Endpoint:** `POST /organizations`

**Request Body:**
```json
{
  "name": "string"
}
```

**Response:**
```json
{
  "organization": { "...organizationObj" }
}
```

---

### Get Organization Info
**Endpoint:** `GET /organizations/info`

**Response:**
```json
{
  "organization": { "...organizationObj" }
}
```

---

### Join Organization
**Endpoint:** `POST /organizations/join`

**Request Body:**
```json
{
  "code": "string",
  "role": "string"
}
```

**Response:**
```json
{
  "message": "string"
}
```

---

### Search Organizations
**Endpoint:** `GET /organizations/search`

**Query Parameters:**
```
query=string
```

**Response:**
```json
{
  "organizations": [ { "name": "string", "code": "string" } ]
}
```

---

### Fetch Organization Join Requests
**Endpoint:** `GET /organizations/requests`

**Response:**
```json
{
  "requests": [ "...requests" ]
}
```

---

### Accept Join Request
**Endpoint:** `PATCH /organizations/requests/accept`

**Request Body:**
```json
{
  "requestId": "string"
}
```

**Response:**
```json
{
  "message": "string"
}
```

---

### Reject Join Request
**Endpoint:** `PATCH /organizations/requests/reject`

**Request Body:**
```json
{
  "requestId": "string"
}
```

**Response:**
```json
{
  "message": "string"
}
```

---

### Remove Member from Organization
**Endpoint:** `DELETE /organizations/members`

**Request Body:**
```json
{
  "memberId": "string"
}
```

**Response:**
```json
{
  "message": "string"
}
```

---

## Teams

### Create a Team
**Endpoint:** `POST /teams`

**Request Body:**
```json
{
  "name": "string",
  "teamLead": "string",
  "developers": [ "string" ],
  "testers": [ "string" ]
}
```

**Response:**
```json
{
  "team": { "...teamObj" }
}
```

---

### Get Info of Team
**Endpoint:** `GET /teams/{teamId}`

**Response:**
```json
{
  "team": { "...teamObj" }
}
```

---

### Get All Teams
**Endpoint:** `GET /teams`

**Response:**
```json
{
  "teams": [ "...teamObj" ]
}
```

---

### Suggest Team Members
**Endpoint:** `GET /teams/suggestions`

**Query Parameters:**
```
projectId=string
```

**Response:**
```json
{
  "suggestedMembers": [ "...userIds" ]
}
```

---

## Projects

### Create Project
**Endpoint:** `POST /projects`

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "estimatedEndDate": "string",
  "budget": "number",
  "projectManagerId": "string"
}
```

**Response:**
```json
{
  "project": { "...projectObj" }
}
```

---

### Get Project Info
**Endpoint:** `GET /projects/{projectId}`

**Response:**
```json
{
  "project": { "...projectObj" }
}
```

---

### Get All Projects
**Endpoint:** `GET /projects`

**Response:**
```json
{
  "projects": [ "...projectObj" ]
}
```

---

### Add Teams to Project
**Endpoint:** `PATCH /projects/teams`

**Request Body:**
```json
{
  "projectId": "string",
  "teamIds": [ "string" ]
}
```

**Response:**
```json
{
  "message": "string"
}
```

---

## Tasks

### Create a Task
**Endpoint:** `POST /tasks`

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "startDate": "string",
  "estimatedDays": "number",
  "assignedTo": [ "string" ],
  "priority": "string",
  "type": "string",
  "level": "string",
  "projectId": "string",
  "parentTaskId": "string"
}
```

**Response:**
```json
{
  "task": { "...taskObj" }
}
```

---

### Get Task Info
**Endpoint:** `GET /tasks/{taskId}`

**Response:**
```json
{
  "task": { "...taskObj" }
}
```

---

### Get All Tasks
**Endpoint:** `GET /tasks`

**Response:**
```json
{
  "tasks": [ "...taskObj" ]
}
```

---

### Get Tasks by Project
**Endpoint:** `GET /tasks/project/{projectId}`

**Response:**
```json
{
  "tasks": [ "...taskIds" ]
}
```

---

### Modify a Task
**Endpoint:** `PUT /tasks/{taskId}`

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "startDate": "string",
  "estimatedDays": "number",
  "assignedTo": [ "string" ],
  "priority": "string",
  "type": "string",
  "level": "string",
  "projectId": "string",
  "parentTaskId": "string",
  "progress": "number"
}
```

**Response:**
```json
{
  "message": "string"
}
```

### Delete a Task
**Endpoint:** `DELETE /tasks/{taskId}`

**Response:**
```json
{
  "message": "string"
}
```

