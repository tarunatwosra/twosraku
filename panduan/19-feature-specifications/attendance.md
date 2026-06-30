# Attendance Module (Presensi)
Version: 1.0

---

# Purpose

Attendance is the operational module responsible for recording, monitoring, and reporting student attendance throughout the academic year.

It provides accurate attendance records for every student and becomes the primary source for attendance reports, dashboard statistics, and discipline monitoring.

---

# Scope

Attendance manages:

- Daily Attendance
- Attendance Recap
- Attendance Reports
- Attendance History
- Attendance Analytics

Attendance only records student presence.

Behavior, grades, and discipline are managed in separate modules.

---

# Primary Objectives

Record attendance accurately.

Prevent duplicate attendance.

Provide attendance statistics.

Support reporting.

Provide attendance history.

Integrate with Dashboard and Character Points.

---

# Supported Users

Administrator

Full Access

Homeroom Teacher

Own Classes

Teacher

Own Subjects (Optional)

Staff

Read Only

Principal

Read Only

---

# Dependencies

Attendance depends on:

Student Registry

Academic Calendar

Class

Academic Year

Semester

Attendance cannot exist without an active student.

---

# Navigation

Main Navigation

↓

Attendance

Sub Pages

Attendance Input

Attendance Recap

Attendance Report

Attendance History

Attendance Settings

---

# Attendance Workflow

Select Academic Year

↓

Select Semester

↓

Select Class

↓

Select Date

↓

Display Student List

↓

Record Attendance

↓

Save

↓

Generate Statistics

---

# Attendance Status

Present (H)

Student attends normally.

Late (T)

Student arrives after the allowed time.

Permission (I)

Student has official permission.

Sick (S)

Student is absent due to illness.

Absent (A)

Student is absent without explanation.

Schools may rename labels according to internal policy.

---

# Business Rules

One student may only have one attendance record per date.

Attendance cannot be duplicated.

Attendance cannot be recorded for future dates.

Attendance cannot be edited after the academic period is locked.

Archived students cannot receive attendance.

Transferred students cannot receive attendance after transfer date.

Graduated students become read-only.

---

# Attendance Input Page

Contains

Academic Year

Semester

Class

Attendance Date

Student Table

Attendance Status

Notes

Save Button

---

# Student Table

Columns

Attendance Status

Student Number

Student Name

Gender

Photo (Optional)

Notes

Quick Actions

Default sorting follows class attendance number.

---

# Attendance Entry

Default status

Present

Users only change students with different attendance status.

This minimizes data entry.

---

# Bulk Actions

Mark All Present

Mark Selected Sick

Mark Selected Permission

Mark Selected Absent

Reset Attendance

---

# Notes

Optional.

Can contain explanations for:

Late

Permission

Special circumstances

Maximum 255 characters.

---

# Attendance Recap

Displays

Daily Recap

Weekly Recap

Monthly Recap

Semester Recap

Annual Recap

---

# Attendance Statistics

Displays

Attendance Percentage

Present Count

Late Count

Permission Count

Sick Count

Absent Count

Most Frequent Status

---

# Attendance Formula

Attendance Percentage

=

Present Days

/

Total School Days

×

100

Late may optionally count as Present according to school policy.

---

# Student Attendance Summary

Each student has

Attendance Percentage

Present

Late

Permission

Sick

Absent

Attendance Trend

---

# Reports

Daily Attendance

Weekly Attendance

Monthly Attendance

Semester Attendance

Annual Attendance

Student Attendance Report

Class Attendance Report

School Attendance Report

---

# Search

Search by

Student Name

Student Number

Class

Major

Date

---

# Filters

Academic Year

Semester

Class

Major

Date Range

Attendance Status

Homeroom Teacher

Multiple filters supported.

---

# Import

Supported

Excel

CSV

Import validates:

Duplicate attendance

Student existence

Class consistency

Attendance date

---

# Export

Excel

CSV

PDF

Print

Export respects active filters.

---

# Validation Rules

Required

Academic Year

Semester

Class

Attendance Date

Attendance Status

Student

Optional

Notes

---

# Relationships

One Student

↓

Many Attendance Records

↓

Attendance Summary

↓

Dashboard

↓

Reports

---

# Permissions

Administrator

Full Access

Homeroom Teacher

Own Classes

Teacher

Read

Staff

Read

Principal

Read

---

# Dashboard Integration

Dashboard displays

Attendance Today

Attendance Trend

Attendance Percentage

Attendance by Class

Attendance Distribution

Students Requiring Attention

Dashboard does not calculate attendance independently.

---

# Character Point Integration

Excessive absences may trigger Character Point recommendations.

Example

Absent ≥ 3 times within one month

↓

Suggested Character Review

Actual character points remain under manual approval.

---

# Assessment Integration

Attendance may be displayed alongside assessment summaries.

Attendance does not affect grades automatically unless configured by school policy.

---

# Notifications

Attendance Not Submitted

Attendance Completed

Duplicate Attendance

Attendance Locked

Late Attendance Entry

---

# Audit Log

Record

Created By

Created At

Updated By

Updated At

Locked By

Deleted By

All attendance modifications must be traceable.

---

# Loading State

Skeleton Table

Skeleton Statistics

Skeleton Charts

Each widget loads independently.

---

# Empty State

No Students

No Attendance

No Reports

No Search Results

Provide a recommended next action.

---

# Error Handling

Duplicate Attendance

Student Not Found

Academic Period Locked

Permission Denied

Network Error

Display clear, non-technical messages.

---

# Performance Requirements

Support

100,000+ attendance records.

Use

Server-side pagination

Server-side filtering

Server-side search

Lazy loading

Optimized indexing

---

# Accessibility

Keyboard Navigation

Visible Focus

Accessible Tables

ARIA Labels

High Contrast

Reduced Motion

---

# Responsive Behavior

Desktop

Full Table

Tablet

Horizontal Scroll

Mobile

Card Layout

Attendance actions remain accessible on all devices.

---

# Security

Attendance records cannot be permanently deleted by standard users.

Soft Delete is recommended.

Every modification must be logged.

Role-based permissions are mandatory.

---

# Future Enhancements

QR Code Attendance

RFID Attendance

Face Recognition

GPS Attendance

Teacher Mobile App

Offline Attendance

Automatic Attendance Reminder

Attendance Approval Workflow

Parent Notifications

AI Attendance Analysis

---

# Definition of Done

Attendance is complete when it:

Records attendance accurately.

Prevents duplicate entries.

Supports bulk input.

Provides comprehensive reports.

Integrates with Dashboard.

Supports responsive layouts.

Maintains audit history.

Follows the Design System.

---

# Final Principle

Attendance is one of the most frequently used modules in Twosraku.

It must prioritize speed, simplicity, and reliability while ensuring every attendance record is accurate, traceable, and immediately available for reporting and analytics.