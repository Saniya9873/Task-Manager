# Task-Manager
# Task Manager

A full-stack Task Manager web application to create, organize, and track daily tasks. The application provides a simple frontend connected to a FastAPI backend and MongoDB database.

## Features

* Create new tasks with title and description
* Set task priority: Low, Medium, or High
* Mark tasks as completed or pending
* Delete tasks
* View total, completed, and pending tasks
* Responsive and user-friendly interface
* REST API for task management
* MongoDB for persistent data storage

## Tech Stack

**Frontend**

* Next.js
* JavaScript
* HTML
* CSS

**Backend**

* Python
* FastAPI
* Pydantic

**Database**

* MongoDB

**Tools**

* Git & GitHub

## Project Structure

```text
Task-Manager/
│
├── frontend/
│   └── ...
│
├── task-manager-backend/
│   ├── main.py
│   └── requirements.txt
│
└── README.md
```

## API Endpoints

| Method | Endpoint           | Description        |
| ------ | ------------------ | ------------------ |
| GET    | `/`                | Check API status   |
| GET    | `/tasks`           | Get all tasks      |
| POST   | `/tasks`           | Create a task      |
| PUT    | `/tasks/{task_id}` | Update task status |
| DELETE | `/tasks/{task_id}` | Delete a task      |

## Setup

### Backend

```bash
cd task-manager-backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

## API Documentation

FastAPI provides interactive API documentation at:

```text
http://127.0.0.1:8000/docs
```

## Future Improvements

* User authentication
* Edit tasks
* Due dates and reminders
* Search and filtering
* Task categories
* Deployment

## Author

**Saniya Gupta**

GitHub: https://github.com/Saniya9873
