# Module 03 — Examination Management Documentation

## 1. Overview
Module 3 controls exam scheduling, hall ticket generation, mark entry, result publication, and student re-evaluation requests under zero-trust authorization.

## 2. RBAC Enforcement
- **Admin**: Create schedules, approve marks, declare results.
- **Teacher**: Mark entry for assigned subjects.
- **Student**: View schedules, download hall tickets, view published results, apply for re-checking.

## 3. Database Entities
- `exam_schedules`: Holds session configurations, windows, and approval status.
- `exam_subjects`: Subject timetable, max/pass marks, teacher assignments.
- `exam_enrollments`: Roll numbers and admit card statuses.
- `exam_marks`: Internal/external scores, grades, and declaration flags.
- `exam_rechecking_requests`: Re-evaluation appeals submitted by students.

## 4. API Endpoints
- `GET /api/examination/schedules`
- `POST /api/examination/schedules`
- `POST /api/examination/marks/entry`
- `POST /api/examination/results/declare`
- `GET /api/examination/my-results`
- `POST /api/examination/rechecking`