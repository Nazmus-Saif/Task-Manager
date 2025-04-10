# Task Management System

## Overview

The Task Management System is a role-based application designed for efficient user and task management. It allows administrators to create, update, delete, and read user and task information. The system provides dynamic roles that can be assigned to users at the time of creation, with permissions determined by the admin. Users receive real-time notifications when tasks are added, and email notifications for critical updates like new task assignments and user creation.

## Features

- **Role-Based Access Control**: Admins can assign dynamic roles to users, such as Developer, Project Manager, or any other custom role.
- **User Management**: Admins can create, update, delete, and read user information, including role assignments.
- **Task Management**: Admins and users can manage tasks with real-time updates and notifications.
- **Real-Time Notifications**: Admin and Users are notified when tasks and statua are added or updated.
- **Email Notifications**: Task assignments and new user creation trigger email notifications.
- **Forgot Password**: Users can reset their password if forgotten, with email-based verification.
- **Dynamic Roles**: Roles are flexible and can be modified in real-time as per the admin’s requirements.
- **Permissions**: Admins have full control, while users are restricted based on their assigned role.

## Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Django (Django REST Framework)
- **Database**: PostgreSQL
- **Authentication**: JWT (stored in cookies)
- **Email System**: SMTP (for sending notifications)
- **Real-Time Notifications**: WebSockets
