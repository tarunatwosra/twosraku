# Character Points Module (Poin Karakter)
Version: 2.0

---

# Purpose

Character Points is a character development engine that records, evaluates, and monitors student behavior throughout their educational journey.

Unlike traditional disciplinary systems, this module recognizes both positive and negative behaviors.

The objective is not merely to punish misconduct, but to encourage continuous character growth.

---

# Philosophy

Character is built through consistency.

Every recorded behavior contributes to a student's character profile.

Positive behavior should receive recognition.

Negative behavior should trigger guidance and improvement.

Character records should support education rather than punishment.

---

# Primary Objectives

Promote positive behavior.

Monitor disciplinary issues.

Provide transparent character history.

Support counseling.

Provide data for reports and dashboard.

Integrate with Student Registry.

---

# Scope

Character Categories

Behavior Types

Character Records

Reward Records

Violation Records

Counseling Records

Character Statistics

Reports

Analytics

Dashboard Integration

---

# Core Architecture

Character Category

↓

Behavior Type

↓

Character Event

↓

Student

↓

Character Record

↓

Character Summary

---

# Core Concepts

## Character Category

Groups similar behaviors.

Examples

Discipline

Responsibility

Leadership

Courtesy

Integrity

Teamwork

Attendance

Appearance

Safety

Religious Activities

Schools may create additional categories.

---

## Behavior Type

Defines a measurable behavior.

Examples

Helping Friends

Excellent Leadership

Outstanding Discipline

Late Arrival

Incomplete Uniform

Bullying

Fighting

Smoking

Cheating

Behavior Types belong to one category.

---

## Character Event

Represents a predefined event that may occur.

Examples

Morning Inspection

Flag Ceremony

School Competition

Community Service

Counseling Session

Dormitory Inspection

Leadership Camp

Events provide context for character records.

---

## Character Record

Represents one recorded behavior.

Each record belongs to

One Student

One Behavior Type

One Event

One Date

One Reporter

---

# Positive & Negative Points

Every behavior type defines

Point Value

Point Direction

Positive

Negative

Examples

Helping Friends

+10

Winning Competition

+50

Excellent Attendance

+20

Late Arrival

-5

Incomplete Uniform

-10

Smoking

-100

Schools determine their own point values.

---

# Business Rules

Every character record must reference an existing student.

Point values are determined by the Behavior Type.

Users may not manually modify point values during recording.

Character history must remain immutable.

Historical records cannot be deleted.

---

# Character Lifecycle

Behavior Occurs

↓

Record Created

↓

Reviewed

↓

Approved

↓

Included in Summary

↓

Archived

---

# Navigation

Character Points

├── Dashboard

├── Records

├── Categories

├── Behavior Types

├── Events

├── Reports

└── Settings

---

# Character Dashboard

Displays

Positive Points

Negative Points

Today's Records

Students Requiring Attention

Top Positive Students

Recent Activities

Pending Reviews

Quick Actions

---

# Categories

Properties

Name

Description

Color

Icon

Status

Display Order

---

# Behavior Types

Properties

Category

Name

Description

Point Value

Positive / Negative

Severity

Requires Approval

Requires Counseling

Status

---

# Severity Levels

Information

Minor

Moderate

Major

Critical

Severity determines notification priority.

---

# Character Events

Properties

Name

Description

Date

Location

Organizer

Academic Year

Semester

Status

Events may be reused.

---

# Character Record

Properties

Student

Behavior Type

Event

Date

Reporter

Description

Evidence

Status

Remarks

---

# Evidence

Optional

Supported

Photo

PDF

Video (Future)

Evidence strengthens transparency.

---

# Record Status

Draft

↓

Submitted

↓

Reviewed

↓

Approved

↓

Archived

---

# Character Summary

Each student automatically has

Positive Points

Negative Points

Net Score

Total Records

Positive Records

Negative Records

Highest Achievement

Most Frequent Violation

Recent Activities

Character Trend

---

# Character Formula

Net Score

=

Positive Points

-

Negative Points

Schools may define custom formulas.

---

# Counseling Integration

Certain behaviors automatically recommend counseling.

Example

Negative Points ≥ 100

↓

Counseling Recommendation

Counseling remains a separate workflow.

---

# Reward Integration

Positive achievements may trigger

Certificates

Awards

Recognition

Leaderboards

Reward criteria are configurable.

---

# Search

Search by

Student

Behavior

Category

Reporter

Event

Academic Year

Semester

---

# Filters

Academic Year

Semester

Class

Major

Category

Behavior Type

Severity

Reporter

Date Range

Status

---

# Reports

Student Character Report

Class Summary

Behavior Summary

Category Summary

Positive Leaderboard

Negative Leaderboard

Counseling Recommendation

Trend Analysis

---

# Import

Excel

CSV

Validation required.

---

# Export

Excel

CSV

PDF

Print

Exports respect filters.

---

# Dashboard Integration

Dashboard displays

Positive Points

Negative Points

Students Requiring Guidance

Outstanding Students

Recent Character Activities

Trend Analysis

Dashboard performs no calculations.

---

# Student Registry Integration

Character Records reference Student ID.

Deleting a student never deletes historical character records.

---

# Attendance Integration

Schools may configure

Repeated Absence

↓

Automatic Character Recommendation

Recommendations require manual approval.

---

# Assessment Integration

Character summaries may appear alongside assessment reports.

Character Points never modify academic scores automatically.

---

# Notifications

New Record

Review Required

Approval Required

Critical Violation

Outstanding Achievement

Counseling Recommendation

---

# Permissions

Administrator

Full Access

Vice Principal

Full Access

Counselor

Review

Teacher

Create Records

Homeroom Teacher

View Own Students

Staff

Read

Students

No Access

---

# Audit Log

Track

Created

Updated

Approved

Archived

Reporter

Reviewer

Timestamp

Reason

Historical records are immutable.

---

# Performance Requirements

Support

10 Million Character Records

Server-side Search

Server-side Filtering

Optimized Reports

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

Immutable Audit Trail

Encrypted Communication

Permission Validation

---

# Future Enhancements

AI Behavior Analysis

Behavior Prediction

Parent Notifications

Mobile Reporting

QR Event Recording

Teacher Mobile App

Badge System

Achievement Levels

Behavior Timeline

Student Portfolio

Gamification

House Point System

Dormitory Management

---

# Definition of Done

The Character Module is complete when

Positive and negative behaviors are supported.

Character history remains traceable.

Reports are reproducible.

Permissions are enforced.

Dashboard integration works.

Performance targets are achieved.

Accessibility standards are satisfied.

The module follows the Design System.

---

# Final Principle

Character Points is not a punishment system.

It is a student character development platform.

Every recorded behavior should help teachers understand, guide, and develop students into individuals with strong discipline, responsibility, leadership, and integrity.