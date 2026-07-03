# Student Registry Module (Buku Induk)
Version: 1.0

---

# Purpose

Student Registry is the master data module of Twosraku.

This module stores and manages all student information required by the entire system.

Every operational module depends on this data.

Student Registry is the single source of truth for student identity.

---

# Scope

Student Registry manages:

- Student Identity
- Academic Information
- Personal Information
- Parent Information
- Contact Information
- Health Information
- Status
- Historical Records

This module is responsible only for maintaining student data.

Attendance, Assessment, Character Points, and other operational records are managed in their respective modules.

---

# Primary Objectives

Provide one centralized student database.

Prevent duplicate identities.

Maintain historical records.

Support reporting.

Support integration with all modules.

---

# Supported Users

Administrator

Full Access

Vice Principal

Read

Create

Update

Teacher

Read Only

Homeroom Teacher

Read

Limited Update

Staff

Read

Import

Export

---

# Dependencies

This module is the parent of:

Attendance

Assessment

Character Points

Dashboard

Reports

Notifications

Authentication

Deleting student data affects every dependent module.

Soft Delete is recommended.

---

# Navigation

Main Navigation

↓

Student Registry

Sub Pages

Student List

Student Detail

Student Form

Import Students

Export Students

Inactive Students

---

# Student Lifecycle

Active

↓

Inactive

Students can be toggled between active and inactive status.

Inactive students retain historical records but are not included in active lists.

---

# Main Pages

Student List

Student Detail

Create Student

Edit Student

Student History

Import

Export

Inactive Students

---

# Student List

Purpose

Display all active students by default.

Functions

Search

Filter

Sort

Pagination

Bulk Action

Export

Import

Quick View

Quick Edit

---

# Search

Search by

Student Name

Student Number

NISN

National ID

Class

Major

Parent Name

Phone Number

Search should be instantaneous.

---

# Filters

Academic Year

Class

Major

Gender

Religion

Active Status (Aktif / Tidak Aktif)

Enrollment Year

Multiple filters may be combined.

---

# Sorting

Student Name

Student Number

Enrollment Date

Class

Major

---

# Columns

Student Photo

Student Number

Student Name

Gender

Class

Major

Active Status

Phone Number

Actions

Columns should be configurable.

---

# Bulk Actions

Archive (set inactive)

Export

Move Class

Print Cards

---

# Student Detail

Contains

Header

Tabs

Activity Timeline

Related Modules

---

# Header

Student Photo

Student Name

Student Number

Class

Major

Status Badge

Quick Actions

---

# Tabs

Overview

Personal Information

Academic Information

Parents

Guardian

Documents

Attendance Summary

Assessment Summary

Character Summary

Activity

---

# Personal Information

Contains

NIS

NISN

Full Name

Nickname

Gender

Birth Place

Birth Date

Religion

Nationality

Blood Type

Height (cm)

Weight (kg)

Vision

Hearing

Teeth Condition

Physical Disability

Address

Phone Number (WhatsApp)

Email

---

# Academic Information

Student Number

Enrollment Year

Current Grade

Class

Homeroom Teacher

Graduation Year

---

# Health Information

Vision (Normal / Tidak Normal)

Hearing (Normal / Tidak Normal)

Teeth Condition (Normal / Tidak Normal)

Physical Disability (None / Ada)

Illness History

Allergies

Health Notes

---

# Parent Information

Father

Mother

Guardian

Full Name

Phone Number

Guardian Relation (for guardian only)

---

# Documents

Student Photo

Birth Certificate

Family Card

National ID

Previous School Certificate

Other Attachments

Support preview.

Support download.

---

# Student History

Track

Class Changes

Status Changes

Updates

Nothing should be permanently lost.

---

# CRUD Operations

Create

Read

Update

Toggle Active Status

Restore

Delete (Soft Delete)

Hard Delete is prohibited except by Super Administrator.

---

# Business Rules

Student Number must be unique.

NISN must be unique when available.

National ID must be unique when available.

A student cannot belong to multiple active classes.

Inactive students retain historical records.

Archived students cannot receive attendance.

---

# Validation Rules

Required

Student Number

Full Name

Gender

Birth Date

Class

Major

Enrollment Year

Optional

NISN

Email

Phone

Blood Type

Height

Weight

Vision

Hearing

Teeth Condition

Physical Disability

Guardian

---

# Relationships

One Student

↓

Many Attendance Records

↓

Many Assessments

↓

Many Character Records

↓

Many Notifications

↓

One Savings Account

---

# Import

Supported

Excel

CSV

Validation

Duplicate Check

Preview

Rollback on failure

Import Report

---

# Export

Excel

CSV

PDF

Print

Export respects active filters.

---

# Permissions

Administrator

Full Access

Principal

Read Only

Homeroom Teacher

Read

Limited Update

Teacher

Read

Staff

Import

Export

Guests

No Access

---

# Audit Log

Record

Created By

Created At

Updated By

Updated At

Inactive By

Inactive At

Restored By

Deleted By

Every important change should be traceable.

---

# Notifications

Display

Successful Import

Duplicate Student

Missing Required Data

Student Created

Student Updated

Student Archived

Student Restored

---

# Dashboard Integration

Dashboard retrieves

Total Students

Active Students

Inactive Students

Students by Class

Students by Major

Gender Distribution

New Students

No calculations should occur inside Dashboard.

---

# Attendance Integration

Attendance cannot exist without an active student.

Student status determines attendance eligibility.

---

# Assessment Integration

Assessment records are linked by Student ID.

Changing student identity must not invalidate assessments.

---

# Character Points Integration

Character records always reference Student ID.

Inactive students retain historical records.

---

# Reports

Student Master Report

Student Card

Inactive Students List

Student Statistics

Enrollment Report

---

# Performance Requirements

Support

50,000+ Students

Server-side Pagination

Lazy Loading

Optimized Search

Optimized Filtering

---

# Accessibility

Keyboard Navigation

Visible Focus

ARIA Labels

Screen Reader Support

Responsive Tables

---

# Responsive Behavior

Desktop

Full Table

Tablet

Horizontal Scroll

Mobile

Card Layout

---

# Loading State

Skeleton Table

Skeleton Detail

Progress Indicator

---

# Empty State

No Students

No Search Results

No Inactive Students

Each state should recommend the next action.

---

# Error Handling

Duplicate Student Number

Duplicate NISN

Missing Required Fields

Import Failure

Permission Denied

Connection Error

Messages should be understandable by school staff.

---

# Security

Sensitive personal data should be protected.

Role-based access is mandatory.

Soft Delete only.

Never expose internal identifiers.

---

# Future Enhancements

QR Student Card

RFID Integration

Face Recognition

Parent Portal

Student Portal

Bulk Promotion

Digital Documents

Medical Records

Scholarship Records

Dormitory Management

---

# Definition of Done

Student Registry is complete when it:

Stores all student master data.

Supports the complete student lifecycle.

Integrates with every operational module.

Maintains historical integrity.

Supports import and export.

Provides responsive performance.

Follows the Design System.

Maintains data consistency.

---

# Final Principle

Student Registry is the foundation of Twosraku.

Every operational module depends on the accuracy and consistency of the data managed here.

Protecting the integrity of student data is more important than adding new features.
