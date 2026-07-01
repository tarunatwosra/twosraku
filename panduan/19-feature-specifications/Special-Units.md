# Special Units Module (Pasukan Khusus)
Version: 1.0

---

# Purpose

Special Units is the management module for the Special Force (Pasukan Khusus) of Taruna SMKN 2 Sragen.

This module is designed exclusively for internal use and is not intended to manage extracurricular organizations such as PMR, OSIS, Pramuka, or Paskibra.

Its purpose is to manage membership, organizational structure, assignments, administrative records, and historical data of Special Unit members.

---

# Philosophy

Special Units represents the school's elite student organization.

Membership is selective.

Every member has responsibilities.

Every assignment is recorded.

Every position has accountability.

Historical records should never be lost.

---

# Primary Objectives

Manage Special Unit membership.

Track organizational positions.

Manage membership status.

Record duty assignments.

Record achievements.

Record disciplinary history.

Provide administrative reports.

Integrate with Student Registry.

---

# Scope

Member Management

Organizational Structure

Position Management

Batch Management

Membership Status

Duty Assignment

Training History

Achievements

Character Summary

Assessment Summary

Attendance Summary

Documents

Reports

Dashboard

---

# Core Architecture

Student Registry

↓

Special Unit Membership

↓

Position

↓

Assignments

↓

Activity History

↓

Reports

Every Special Unit member must originate from Student Registry.

---

# Membership Rules

A student may become a Special Unit member only after being registered.

A student may only have one active Special Unit membership.

Inactive members remain in historical records.

Membership history is never deleted.

---

# Navigation

Special Units

├── Dashboard

├── Members

├── Positions

├── Assignments

├── Training History

├── Achievements

├── Documents

├── Reports

└── Settings

---

# Dashboard

Purpose

Provide an overview of Special Unit activities.

---

## Widgets

Total Members

Active Members

Inactive Members

New Members

Training Schedule

Upcoming Assignments

Recent Activities

Outstanding Members

Quick Actions

---

## Quick Actions

Add Member

Assign Position

Create Assignment

Upload Document

Generate Report

Search Member

---

# Members

Purpose

Maintain the official database of all Special Unit members.

---

## Member Profile

Student

Student Number

Photo

Current Class

Major

Academic Year

Membership Status

Join Date

Leave Date

Current Position

Notes

---

## Membership Status

Candidate

Active

Inactive

Graduated

Transferred

Removed

Historical records remain accessible.

---

# Position Management

Purpose

Manage organizational responsibilities.

Positions define duties, not ranks.

---

## Examples

Commander

Vice Commander

Secretary

Treasurer

Training Coordinator

Discipline Coordinator

Logistics Coordinator

Equipment Coordinator

Member

Schools may customize position names.

---

## Position Properties

Position Name

Description

Display Order

Status

Responsibilities

---

## Business Rules

One student may hold one active primary position.

Temporary assignments are allowed.

Position history must be recorded.

---

# Assignment Management

Purpose

Manage operational duties.

Assignments are temporary responsibilities.

---

## Examples

Morning Assembly

Flag Ceremony

School Event

Guest Reception

Security Duty

Training Session

Competition Support

Special Ceremony

---

## Assignment Properties

Assignment Name

Description

Date

Time

Location

Supervisor

Assigned Members

Status

Notes

---

## Assignment Status

Scheduled

In Progress

Completed

Cancelled

Archived

---

# Training History

Purpose

Maintain historical training records.

---

## Training Record

Training Name

Instructor

Date

Location

Attendance

Notes

Evaluation

Certificate

---

Training history is read-only after completion.

---

# Achievement Management

Purpose

Record accomplishments of members.

---

## Achievement Types

Competition

School Recognition

Leadership

Discipline

Community Service

Special Award

---

## Achievement Properties

Title

Category

Date

Organizer

Description

Certificate

Evidence

---

Achievements become part of the permanent member profile.

---

# Character Integration

Display

Positive Points

Negative Points

Recent Character Records

Character Trend

Character data is read-only.

Updates occur in Character Points Module.

---

# Assessment Integration

Display

Assessment Average

Recent Assessments

Leadership Assessment

Training Assessment

Assessment data remains read-only.

---

# Attendance Integration

Display

Attendance Percentage

Training Attendance

Assignment Attendance

Recent Absence

Attendance is synchronized from Attendance Module.

---

# Member Timeline

Display chronological history.

Examples

Joined Special Unit

Position Assigned

Assignment Completed

Training Completed

Achievement Received

Membership Updated

Graduated

Timeline cannot be edited manually.

---

# Documents

Purpose

Store administrative documents.

---

## Supported Documents

Selection Result

Membership Letter

Assignment Letter

Certificate

Photo

Evaluation Form

Supporting Documents

---

Supported Formats

PDF

JPG

PNG

DOCX

Maximum upload size is configurable.

---

# Search

Search by

Student Name

Student Number

Class

Major

Position

Status

Academic Year

---

# Filters

Academic Year

Class

Major

Position

Membership Status

Training

Assignment

Achievement

---

# Reports

Member Directory

Active Members

Inactive Members

Position List

Assignment Report

Training Report

Achievement Report

Membership Statistics

Annual Summary

---

# Import

Supported

Excel

CSV

Validation required before import.

---

# Export

Excel

CSV

PDF

Print

Export respects applied filters.

---

# Dashboard Integration

Dashboard displays

Total Members

Today's Assignments

Training Progress

Recent Activities

Outstanding Members

Upcoming Events

Dashboard displays summarized information only.

---

# Notifications

Member Added

Assignment Created

Training Scheduled

Achievement Recorded

Membership Updated

Document Uploaded

---

# Permissions

Administrator

Full Access

Coordinator

Manage Members

Instructor

Training Records

Teacher

View

Staff

Limited Access

Guest

No Access

---

# Audit Log

Track

Member Added

Member Updated

Position Changed

Assignment Created

Document Uploaded

Status Changed

All actions include

User

Timestamp

Reason

---

# Performance Requirements

Support

2,000+ Members

100,000+ Assignment Records

Fast Search

Server-side Filtering

Lazy Loading

---

# Accessibility

Keyboard Navigation

Screen Reader Support

High Contrast

Visible Focus

Responsive Layout

WCAG AA

---

# Security

Role-based Access

Soft Delete

Immutable History

Audit Logging

Permission Validation

Encrypted Communication

---

# Future Enhancements

Training Evaluation

Equipment Inventory

Uniform Management

Digital ID Card

QR Member Verification

Attendance via QR

Mobile Companion

Member Skill Matrix

Leadership Development

Event Management

---

# Definition of Done

The Special Units Module is complete when

Membership is fully manageable.

Historical records remain immutable.

Assignments are traceable.

Reports are reproducible.

Dashboard integration works.

Permissions are enforced.

Performance targets are met.

Accessibility standards are satisfied.

The module follows the Design System.

---

# Final Principle

Special Units is the official administrative system for the Pasukan Khusus of Taruna SMKN 2 Sragen.

It is not an extracurricular management module.

Its primary purpose is to maintain accurate membership records, organizational responsibilities, operational activities, and historical information while integrating seamlessly with the Student Registry and other core modules of Twosraku.