# Task Management System

A full-stack Task Management System built with FastAPI, React, PostgreSQL, SQLAlchemy, and Docker.

## Tech Stack

### Backend
- Python 3.11
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- JWT Authentication

### Frontend
- React
- Vite
- React Router
- Redux Toolkit
- Axios
- Nginx

### DevOps
- Docker
- Docker Compose

## Features

### Authentication
- User registration
- JWT-based login
- Current user profile
- Protected routes

### Project Management
- Create projects
- View projects
- Edit projects
- Delete projects
- Project ownership

### Task Management
- Create tasks
- Edit tasks
- Delete tasks
- Task status management
- Task priority management
- Status filtering
- Priority filtering
- Task search
- Pagination

## Project Structure

```text
Task_Management_System/
├── backend/
│   ├── app/
│   ├── alembic/
│   ├── Dockerfile
│   ├── alembic.ini
│   ├── requirements.txt
│   └── start.sh
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── package-lock.json
│
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md