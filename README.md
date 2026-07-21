# Al Mairaaj

Al Mairaaj is a Learning Management System (LMS) built with Laravel to simplify the management of educational institutions. It provides an administrative dashboard for managing students, teachers, academic structures, live classes, examinations, attendance, and other educational activities from a single platform.

---

## Features

### Academic Management
- Multi-board support
- Grade/Class management
- Subject management
- Academic sessions
- Batch management

### User Management
- Admin management
- Teacher management
- Student management
- Parent management
- Role & Permission management

### Live Classes
- Create live class batches
- Assign teachers
- Schedule classes
- Manage class timings
- Track live sessions

### Student Management
- Student registration
- Student profiles
- Class assignments
- Enrollment management

### Teacher Management
- Teacher profiles
- Subject allocation
- Grade/Class allocation
- Schedule management

### Attendance
- Student attendance
- Teacher attendance
- Attendance reports

### Examination
- Exam creation
- Marks management
- Result generation
- Report cards

### Learning Resources
- Notes
- Assignments
- Course materials
- Announcements

### Communication
- Notifications
- Announcements
- Student and parent communication

### Reports
- Student reports
- Teacher reports
- Attendance reports
- Academic reports

---

# Technology Stack

## Backend
- Laravel
- PHP
- MySQL

## Frontend
- Blade Templates
- Bootstrap
- JavaScript
- Vite

## Authentication
- Laravel Authentication
- Role Based Access Control (RBAC)

---

# Project Structure

```
app/
bootstrap/
config/
database/
public/
resources/
routes/
storage/
tests/
vendor/
```

---

# Requirements

- PHP 8.2+
- Composer
- MySQL 8+
- Node.js 18+
- npm

---

# Installation

## 1. Clone the repository

```bash
git clone https://github.com/yourusername/al-mairaaj.git

cd al-mairaaj
```

## 2. Install PHP dependencies

```bash
composer install
```

## 3. Install JavaScript dependencies

```bash
npm install
```

## 4. Copy environment file

```bash
cp .env.example .env
```

Windows

```bash
copy .env.example .env
```

---

## 5. Generate application key

```bash
php artisan key:generate
```

---

## 6. Configure database

Update your `.env` file.

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=al_mairaaj
DB_USERNAME=root
DB_PASSWORD=
```

---

## 7. Run migrations

```bash
php artisan migrate
```

If seeders are available:

```bash
php artisan db:seed
```

or

```bash
php artisan migrate --seed
```

---

## 8. Build frontend assets

Development

```bash
npm run dev
```

Production

```bash
npm run build
```

---

## 9. Start Laravel

```bash
php artisan serve
```

The application will be available at:

```
http://127.0.0.1:8000
```

---

# Useful Commands

Clear cache

```bash
php artisan optimize:clear
```

Run migrations

```bash
php artisan migrate
```

Rollback migrations

```bash
php artisan migrate:rollback
```

Create migration

```bash
php artisan make:migration
```

Create model

```bash
php artisan make:model ModelName
```

Create controller

```bash
php artisan make:controller ControllerName
```

Run queue worker

```bash
php artisan queue:work
```

---

# Folder Overview

| Folder | Description |
|---------|-------------|
| app | Application logic |
| routes | Application routes |
| resources | Blade views, CSS and JS |
| database | Migrations and seeders |
| public | Public assets |
| storage | Logs and uploaded files |
| config | Configuration files |

---

# Security

- Authentication
- Authorization using Roles & Permissions
- CSRF Protection
- Form Validation
- Password Hashing

---

# Future Enhancements

- Mobile Application
- Parent Portal
- Student Portal
- Online Fee Payment
- AI-powered Learning Assistant
- Analytics Dashboard
- SMS Integration
- Email Notifications
- Video Library
- Certificate Generation

---

# Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push to your branch.
5. Open a Pull Request.

---

# License

This project is licensed under the MIT License.

---

# Author

**Al Mairaaj Development Team**