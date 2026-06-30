# Assessment Module (Penilaian)
Version: 2.0

---

# Purpose

Assessment is the central evaluation engine of Twosraku.

Unlike traditional grading systems, Assessment is designed as a configurable engine capable of supporting multiple evaluation models without requiring changes to the application's architecture.

The module should support:

- Academic Assessment
- Character Assessment
- Discipline Assessment
- Military Training Assessment
- Practical Assessment
- Extracurricular Assessment
- Competition Assessment
- Custom Assessment

The same engine should be reusable for every assessment scenario.

---

# Philosophy

Assessment is **not** a score-entry page.

Assessment is an engine that manages the complete lifecycle of an evaluation.

The engine separates:

• Assessment Design

↓

• Assessment Execution

↓

• Assessment Result

↓

• Assessment Analysis

This separation ensures scalability and long-term maintainability.

---

# Objectives

The Assessment Engine should:

- Eliminate duplicated assessment structures.
- Allow reusable assessment templates.
- Support unlimited assessment sessions.
- Support different scoring models.
- Maintain complete assessment history.
- Integrate seamlessly with other modules.
- Provide reliable reporting and analytics.

---

# Scope

The Assessment Module manages:

Assessment Categories

Assessment Templates

Assessment Items

Assessment Sessions

Assessment Participants

Student Scores

Calculation Rules

Grade Conversion

Reports

Analytics

Dashboard Integration

The module **does not** manage:

Student Identity

Attendance

Character Violations

Authentication

These remain in their respective modules.

---

# Core Concepts

The engine is built around five fundamental concepts.

## Category

A high-level grouping of assessments.

Examples

Academic

Character

Leadership

Discipline

Physical

Practical

Extracurricular

Health

Categories rarely change.

---

## Template

A reusable assessment blueprint.

Templates define:

- assessment structure
- assessment items
- scoring configuration
- weighting

Templates contain no student data.

A template can be reused indefinitely.

Example

Leadership Evaluation

can be used every semester.

---

## Assessment Item

The smallest measurable component.

Examples

Discipline

Uniform

Voice Command

Push Up

Knowledge Test

Teamwork

Responsibility

Every item belongs to exactly one template.

Items define:

Name

Description

Score Type

Weight

Maximum Score

Minimum Score

Display Order

Items should remain reusable.

---

## Assessment Session

A real implementation of a template.

Template

↓

Session

Example

Template

Weekly Inspection

↓

Session

Week 1

↓

Week 2

↓

Week 3

↓

Week 4

The template never changes.

Only sessions increase.

---

## Student Score

Actual student results.

Each score belongs to

One Session

↓

One Student

↓

One Assessment Item

Scores never exist independently.

---

# Assessment Engine Architecture

```

Assessment Category
│
▼

Assessment Template
│
▼

Assessment Item
│
▼

Assessment Session
│
▼

Assessment Participant
│
▼

Student Score

```

Every layer has a single responsibility.

No layer should perform another layer's responsibility.

---

# Why Assessment Session Exists

Without sessions,

an assessment item can only have one score.

Example

Uniform

↓

95

What happens next week?

Should the score overwrite?

Should another item be created?

Neither is correct.

Instead,

create another session.

Template

Weekly Inspection

↓

Session

Week 1

↓

Uniform

↓

95

Next week

Template

Weekly Inspection

↓

Session

Week 2

↓

Uniform

↓

91

Unlimited history.

Unlimited reporting.

No duplicated templates.

---

# Assessment Participant

A session does not automatically include every student.

Instead,

participants are registered first.

Benefits

Supports

Selected Classes

Selected Students

Organizations

Competitions

PMR

Paskibra

Special Training

Without participants,

large assessments become inefficient.

---

# Student Score

Scores are attached only after

Participant

exists.

Relationship

Session

↓

Participant

↓

Score

This prevents orphan data.

---

# Entity Relationship

```

Category

│

1

│

∞

Template

│

1

│

∞

Item

│

1

│

∞

Session

│

1

│

∞

Participant

│

1

│

∞

Score

```

Every entity has one clear responsibility.

---

# Assessment Lifecycle

Every assessment follows the same lifecycle.

```

Create Category

↓

Create Template

↓

Create Assessment Items

↓

Create Session

↓

Assign Participants

↓

Input Scores

↓

Review Scores

↓

Calculate Results

↓

Lock Session

↓

Generate Reports

↓

Archive

```

No assessment should skip these stages.

---

# Session Status

Draft

Assessment structure is being prepared.

↓

Open

Assessment is active.

↓

In Progress

Scores are being entered.

↓

Completed

All scores submitted.

↓

Reviewed

Scores verified.

↓

Locked

No further edits allowed.

↓

Archived

Historical reference only.

---

# Locking Mechanism

Once locked,

the session becomes read-only.

Editing requires

Administrator Permission.

Locking protects

reports

statistics

historical integrity

dashboard consistency

---

# General Business Rules

Categories must exist before templates.

Templates must exist before sessions.

Sessions must exist before participants.

Participants must exist before scores.

Scores cannot exist without a participant.

Locked sessions cannot receive new scores.

Templates never store student data.

Historical sessions cannot be modified after locking.

---

# Design Principles

Assessment structures should be reusable.

Sessions should be disposable.

Scores should be permanent.

History should never be lost.

Configuration should outlive operational data.

---

# Module Dependencies

Assessment depends on

Student Registry

Academic Year

Semester

Class

Authentication

Permissions

Dashboard

Reports

Assessment should never duplicate master data.

---

# Success Criteria

The Assessment Engine is considered successful when:

Templates are reusable.

Sessions are independent.

Scores are traceable.

Reports remain historically accurate.

New assessment models can be added without modifying the database architecture.

---

# End of Part 1

# Assessment Configuration

Assessment configuration defines the reusable structures that become the foundation of every assessment.

Configuration consists of five entities.

Assessment Category

↓

Assessment Template

↓

Assessment Item

↓

Assessment Session

↓

Assessment Participant

Operational data (Student Score) is created only after these entities exist.

---

# Assessment Category

## Purpose

Assessment Category is the highest level of organization.

Categories classify assessments into broad evaluation domains.

Categories rarely change and should remain stable throughout the lifetime of the application.

---

## Examples

Academic

Character

Discipline

Leadership

Military Training

Extracurricular

Health

Physical Fitness

Practical Skills

Behavior

Schools may create additional categories according to institutional needs.

---

## Category Properties

Each category contains:

Name

Description

Icon

Color

Display Order

Status

Created By

Created At

Updated By

Updated At

---

## Business Rules

Category names must be unique.

Categories cannot be deleted when templates exist.

Inactive categories cannot create new templates.

Historical data remains accessible even when a category becomes inactive.

Categories should be sortable.

---

## CRUD

Create

Read

Update

Deactivate

Restore

Hard Delete is prohibited.

---

# Assessment Template

## Purpose

Templates define reusable assessment structures.

A template contains:

assessment items

default weights

default scoring rules

calculation methods

Templates contain no student scores.

---

## Examples

Mid Semester Examination

Final Semester Examination

Weekly Discipline Inspection

Morning Parade Evaluation

PMR Skill Test

PBB Competition

Leadership Evaluation

Dormitory Inspection

Templates should be reused for many assessment sessions.

---

## Template Properties

Template Name

Category

Description

Academic Year Scope

Scoring Method

Passing Score

Maximum Score

Minimum Score

Allow Decimal

Auto Calculate

Display Order

Status

---

## Business Rules

Every template belongs to one category.

Template names must be unique inside the same category.

Templates may contain unlimited assessment items.

Templates cannot be deleted after being used by a session.

Inactive templates cannot create new sessions.

Editing a template must never modify completed sessions.

---

## Template Lifecycle

Draft

↓

Active

↓

Inactive

↓

Archived

Historical templates remain readable.

---

## Copy Template

Administrators may duplicate an existing template.

Copied templates inherit:

Items

Weights

Configuration

Scoring Rules

Copied templates never inherit:

Sessions

Participants

Scores

Reports

---

# Assessment Item

## Purpose

Assessment Items represent the smallest measurable components of an evaluation.

Each template contains one or more items.

---

## Examples

Uniform

Discipline

Attendance

Leadership

Voice Command

Knowledge

Teamwork

Responsibility

Push Up

Running

First Aid Skill

Communication

Problem Solving

Schools may create unlimited items.

---

## Item Properties

Item Name

Description

Score Type

Weight

Minimum Score

Maximum Score

Passing Score

Display Order

Required

Status

---

## Score Types

Numeric

Example

0–100

---

Percentage

Example

0–100%

---

Boolean

Pass

Fail

---

Rating

1–5

1–10

---

Letter Grade

A

B

C

D

E

---

Custom Scale

Administrator Defined

---

## Weight Rules

Each item may define its own weight.

Example

Discipline

30%

Leadership

20%

Knowledge

30%

Physical

20%

Total weight should equal 100%.

The system should warn when weights exceed or fall below 100%.

---

## Business Rules

Item names must be unique inside a template.

Items may be reordered.

Inactive items remain visible in historical sessions.

Items cannot be deleted after receiving scores.

Display Order determines UI arrangement.

---

## Item Lifecycle

Draft

↓

Active

↓

Inactive

↓

Archived

---

# Assessment Session

## Purpose

A Session represents one execution of a template.

Every real assessment is performed inside a session.

Templates define structure.

Sessions define execution.

---

## Examples

Weekly Inspection
Week 1

Weekly Inspection
Week 2

Semester Examination
Odd Semester

Semester Examination
Even Semester

Leadership Evaluation
Class X TKJ 1

PMR Skill Test
2027

---

## Session Properties

Session Name

Template

Academic Year

Semester

Class

Evaluator

Start Date

End Date

Status

Locked

Notes

---

## Business Rules

Sessions always use one template.

Sessions cannot change templates after participants exist.

Sessions may only belong to one academic period.

Sessions may be duplicated.

Duplicated sessions copy:

Configuration

Items

Weights

Participants (Optional)

Duplicated sessions never copy scores.

---

## Session Lifecycle

Draft

↓

Open

↓

In Progress

↓

Completed

↓

Reviewed

↓

Locked

↓

Archived

---

## Session Lock

Locked sessions become read-only.

Unlocking requires Administrator permission.

Every unlock operation must be recorded in the audit log.

---

# Assessment Participant

## Purpose

Participants determine who is evaluated within a session.

Not every student must participate in every assessment.

Participants make assessments flexible and scalable.

---

## Participant Sources

Entire School

Grade

Class

Major

Organization

Extracurricular

PMR

Paskibra

Selected Students

Imported List

---

## Participant Properties

Student

Class

Participation Status

Assigned At

Assigned By

Notes

---

## Participation Status

Assigned

Present

Absent

Completed

Excluded

Withdrawn

---

## Business Rules

One student may only participate once in the same session.

Duplicate participants are prohibited.

Removing participants does not remove historical scores.

Participants may be imported.

Participants may be selected manually.

---

## Bulk Operations

Add Entire Class

Add Multiple Classes

Add Organization Members

Import Participants

Remove Selected

Replace Participants

---

# Entity Relationships

Category

1

↓

∞

Template

1

↓

∞

Item

1

↓

∞

Session

1

↓

∞

Participant

1

↓

∞

Student Score

Each entity has exactly one responsibility.

No entity should duplicate another entity's functionality.

---

# Validation Summary

Category

Unique Name

---

Template

Category Required

Unique Name

Status Required

---

Item

Template Required

Valid Score Type

Weight Validation

---

Session

Template Required

Academic Year Required

Semester Required

Evaluator Required

---

Participant

Student Required

Session Required

Duplicate Prevention

---

# Configuration Principles

Configuration should be created once.

Templates should be reused many times.

Sessions should be temporary.

Participants should represent real assessment targets.

Scores should always reference configuration instead of duplicating it.

---

# End of Part 2

# Student Score

## Purpose

Student Score stores the actual assessment results obtained by each participant for every assessment item.

Student Score is the operational data of the Assessment Engine.

Configuration entities (Category, Template, Item, Session, Participant) define how an assessment works.

Student Score records the outcome.

---

# Relationship

Assessment Session

↓

Assessment Participant

↓

Assessment Item

↓

Student Score

Every score must belong to:

One Session

One Participant

One Assessment Item

---

# Score Properties

Student

Assessment Item

Raw Score

Final Score

Grade

Remark

Evidence (Optional)

Evaluator

Scored At

Updated At

Status

---

# Score Status

Draft

↓

Saved

↓

Reviewed

↓

Approved

↓

Locked

Only Draft and Saved scores may be edited.

Approved and Locked scores become read-only.

---

# Score Input

Scores may be entered using:

Manual Input

Spreadsheet-like Table

Import Excel

CSV Import

Mobile Input

API Integration (Future)

The interface should prioritize speed and keyboard navigation.

---

# Score Validation

Before saving a score, validate:

Student exists.

Participant exists.

Assessment Item exists.

Score is within allowed range.

Session is open.

User has permission.

No duplicate score exists.

---

# Duplicate Rule

Only one score may exist for:

One Student

+

One Session

+

One Assessment Item

Duplicate entries are prohibited.

Existing scores should be updated instead.

---

# Score Revision

Scores may be revised while the session remains unlocked.

Every revision records:

Previous Score

New Score

Updated By

Updated At

Revision Reason

Historical values must never be overwritten without trace.

---

# Evidence

Assessment evidence is optional.

Supported types

Image

PDF

Video (Future)

Audio (Future)

Evidence helps support score transparency.

---

# Formula Engine

## Purpose

The Formula Engine calculates results automatically based on assessment configuration.

Manual calculations should be avoided whenever possible.

---

# Formula Components

Raw Score

↓

Weight

↓

Weighted Score

↓

Category Total

↓

Final Score

↓

Grade Conversion

---

# Weighted Score

Formula

Weighted Score

=

Raw Score

×

Weight

Example

Discipline

90

Weight

30%

Weighted Result

27

---

# Category Score

If a template contains multiple items:

Discipline

30%

Leadership

20%

Knowledge

50%

Category Score

=

Sum of all weighted scores

---

# Final Score

Default Formula

Final Score

=

Total Weighted Score

Schools may define custom formulas.

---

# Formula Types

Weighted Average

Simple Average

Highest Score

Lowest Score

Manual Formula

Custom Formula (Future)

The formula type belongs to the Template.

---

# Grade Conversion Engine

## Purpose

Convert numeric scores into grades.

---

## Default Example

90–100

A

80–89

B

70–79

C

60–69

D

Below 60

E

Grade intervals must be configurable.

---

# Grade Properties

Grade

Minimum Score

Maximum Score

Description

Color

Passing Status

---

# Passing Rule

Passing may be determined by

Minimum Score

Minimum Grade

Administrator-defined Rule

Schools may customize passing criteria.

---

# Ranking Engine

Ranking is optional.

Ranking may be calculated

Per Session

Per Class

Per Grade

Per Category

Per Academic Year

Ranking should never modify student scores.

It is only an analytical result.

---

# Score Summary

Each participant automatically receives:

Average Score

Highest Score

Lowest Score

Passing Status

Grade

Completion Percentage

Summary updates automatically whenever scores change.

---

# Assessment Completion

Each Session tracks completion progress.

Formula

Completed Scores

/

Expected Scores

×

100%

Dashboard displays

Completion Percentage

Remaining Scores

Completed Participants

Pending Participants

---

# Approval Workflow

Scores should pass through an approval process.

Draft

↓

Saved

↓

Reviewed

↓

Approved

↓

Locked

Teachers may review.

Administrators may approve.

Locked scores cannot change.

---

# Lock Strategy

Individual Score

↓

Participant

↓

Session

↓

Academic Period

Higher-level locks automatically protect lower-level data.

---

# Score History

Every score modification creates history.

History includes

Old Value

New Value

Changed By

Changed At

Reason

History cannot be deleted.

---

# Bulk Operations

Supported actions

Import Scores

Export Scores

Copy Previous Scores

Reset Scores

Approve Selected

Lock Selected

Unlock Selected

Bulk operations must validate every record individually.

---

# Auto Save

Optional feature.

If enabled,

scores save automatically after editing.

Auto Save should never bypass validation.

---

# Calculation Trigger

Recalculate automatically when

Score changes

Item weight changes

Formula changes

Grade intervals change

Manual recalculation should also be available.

---

# Notifications

Score Saved

Review Required

Approval Required

Session Completed

Session Locked

Import Completed

Import Failed

---

# Reports

Generate

Student Score Sheet

Class Summary

Category Summary

Template Summary

Session Summary

Ranking Report

Score Distribution

All reports reflect the latest approved scores.

---

# Dashboard Integration

Dashboard displays

Average Score

Highest Score

Lowest Score

Assessment Completion

Pending Reviews

Pending Approvals

Top Categories

Weakest Categories

Dashboard never performs calculations.

All values come from the Assessment Engine.

---

# Performance Requirements

Support

1,000,000+ Score Records

Server-side Calculation

Lazy Loading

Incremental Updates

Batch Processing

Optimized Indexes

---

# Security

Scores cannot be permanently deleted.

Soft Delete is recommended.

Approval history is immutable.

Every score change must be audited.

Permissions apply to every operation.

---

# Design Principles

Scoring should be simple.

Calculations should be automatic.

History should be permanent.

Configuration should remain reusable.

Reports should always be reproducible.

---

# End of Part 3

# Assessment User Interface

The Assessment Module should prioritize speed, consistency, and minimal user interaction.

Teachers spend most of their time entering scores.

Therefore, every workflow should minimize clicks.

The primary interaction pattern should resemble a spreadsheet rather than a traditional form.

---

# Navigation Structure

Assessment

├── Dashboard

├── Sessions

├── Templates

├── Categories

├── Reports

└── Settings

The Assessment Dashboard is the default landing page.

---

# Assessment Dashboard

## Purpose

Provide a quick overview of all assessment activities.

Users should immediately understand:

Current sessions

Pending assessments

Recently completed assessments

Overall progress

Average scores

Pending approvals

---

## Widgets

Active Sessions

Completed Sessions

Pending Reviews

Pending Approvals

Assessment Completion

Average Score

Highest Score

Lowest Score

Recent Activities

Upcoming Sessions

Quick Actions

---

## Quick Actions

Create Session

Open Session

Continue Assessment

Import Scores

Export Report

Create Template

Duplicate Template

Quick Actions should be displayed as rounded cards.

---

# Session List

Purpose

Display all assessment sessions.

---

## Table Columns

Session Name

Category

Template

Academic Year

Semester

Evaluator

Participants

Completion

Status

Created Date

Actions

---

## Search

Session Name

Template

Evaluator

Academic Year

Semester

---

## Filters

Academic Year

Semester

Category

Template

Status

Evaluator

Class

Major

---

## Sorting

Newest

Oldest

Session Name

Completion

Status

Created Date

---

## Row Actions

Open

Duplicate

Edit

Archive

Delete

Lock

Unlock

Generate Report

---

# Create Session Wizard

Creating a session should be guided.

Never present every field on one page.

---

## Step 1

Basic Information

Session Name

Category

Template

Academic Year

Semester

Description

---

## Step 2

Target Participants

Entire School

Grade

Class

Major

Organization

Extracurricular

Selected Students

Preview Participant Count

---

## Step 3

Evaluator

Teacher

Assistant

Department

Assessment Period

Start Date

End Date

---

## Step 4

Review

Summary

Participant Count

Assessment Items

Weight Validation

Warnings

Create Session

---

# Session Detail

Every session has four tabs.

Overview

Participants

Scores

Reports

---

# Overview Tab

Displays

General Information

Completion

Evaluator

Timeline

Statistics

Assessment Configuration

Recent Activities

---

# Participants Tab

Displays

Student List

Participation Status

Assessment Progress

Completion

Search

Filters

Bulk Actions

---

## Bulk Actions

Add Participants

Remove Participants

Replace Participants

Import Participants

Export Participants

---

# Score Entry

This is the primary working page.

The interface should behave like Excel.

---

## Layout

Toolbar

↓

Filter Bar

↓

Spreadsheet Grid

↓

Summary Panel

---

# Toolbar

Save

Auto Save

Undo

Redo

Import

Export

Lock Session

Approve

Calculate

Refresh

---

# Spreadsheet Grid

Columns

Attendance Number

Student Name

Assessment Items...

Average

Grade

Remarks

Rows

One student

per row.

Columns

One assessment item

per column.

This layout minimizes scrolling.

---

# Cell Editing

Click

↓

Edit

↓

Enter

↓

Next Cell

Keyboard navigation is mandatory.

---

## Keyboard Shortcuts

Enter

Next Cell

Shift + Enter

Previous Cell

Tab

Next Column

Shift + Tab

Previous Column

Arrow Keys

Navigate Grid

Ctrl + S

Save

Ctrl + Z

Undo

Ctrl + Y

Redo

---

# Auto Save

Optional.

When enabled,

edited cells save automatically after validation.

Invalid cells remain highlighted.

---

# Validation

Invalid cells display

Red Border

Tooltip

Validation Message

The user should not lose entered values.

---

# Sticky Elements

Header Row

Student Name

Attendance Number

Toolbar

These remain visible during scrolling.

---

# Summary Panel

Displays

Average Score

Highest Score

Lowest Score

Completion

Participants

Pending Scores

Updated automatically.

---

# Score Review

After entry,

users may review all scores before approval.

Review displays

Changes

Warnings

Incomplete Scores

Missing Participants

Weight Problems

---

# Approval

Review

↓

Approve

↓

Lock

↓

Generate Report

Approved sessions become read-only.

---

# Reports

Available Reports

Session Summary

Student Report

Category Report

Template Report

Ranking Report

Score Distribution

Grade Distribution

Performance Trend

---

# Export

Excel

CSV

PDF

Print

Exports should respect

Filters

Sorting

Selected Participants

---

# Import

Supported

Excel

CSV

Import Workflow

Upload

↓

Preview

↓

Validation

↓

Warnings

↓

Import

↓

Summary

Import should never directly overwrite existing scores.

---

# Duplicate Handling

Duplicate Student

↓

Update Existing

Ignore

Cancel Import

User chooses the behavior.

---

# Session Timeline

Display

Created

Opened

Participants Added

Scores Updated

Approved

Locked

Archived

Every event records

User

Date

Time

Action

---

# Activity Log

Every important action is recorded.

Examples

Score Changed

Session Locked

Approval

Participant Removed

Formula Changed

Template Updated

Activity Log is read-only.

---

# Empty States

No Sessions

No Templates

No Participants

No Scores

No Reports

Each state should suggest the next action.

---

# Error States

Session Locked

Permission Denied

Formula Invalid

Import Failed

Calculation Failed

Network Error

Messages should be understandable by school staff.

---

# Loading States

Skeleton Dashboard

Skeleton Grid

Skeleton Table

Skeleton Reports

Widgets load independently.

---

# Dashboard Integration

Assessment Dashboard provides data to

Main Dashboard

Teacher Dashboard

Principal Dashboard

Department Dashboard

Assessment should never calculate statistics inside dashboard widgets.

Dashboard only displays summarized data.

---

# Performance Goals

Open Session

< 2 seconds

Save Score

< 200 ms

Grid Scroll

60 FPS

Import

10,000 Scores

< 30 seconds

Search

< 500 ms

Filtering

< 500 ms

---

# UI Principles

Assessment should feel like using a spreadsheet.

Every common action should require the fewest possible clicks.

Keyboard users should complete an assessment faster than mouse users.

The interface should remain responsive even with thousands of students.

---

# End of Part 4

# Permissions & Authorization

Assessment permissions are role-based.

Every operation must be validated on the server.

UI permissions are only for user convenience.

Backend permissions are mandatory.

---

# User Roles

Administrator

Vice Principal

Principal

Teacher

Homeroom Teacher

Staff

Guest

Every role has different capabilities.

---

# Permission Matrix

| Feature | Admin | Principal | Vice Principal | Teacher | Homeroom | Staff |
|----------|:----:|:---------:|:---------------:|:-------:|:---------:|:------:|
| View Categories | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create Categories | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Edit Categories | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Delete Categories | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| View Templates | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create Templates | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Edit Templates | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Delete Templates | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Create Session | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Edit Session | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Lock Session | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Unlock Session | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Input Score | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ |
| Review Score | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Approve Score | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Export Report | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

---

# Authorization Rules

Permissions should always be checked before:

Viewing

Creating

Updating

Deleting

Importing

Exporting

Locking

Approving

Generating Reports

Unauthorized actions must return a permission error.

---

# Academic Period Lock

Academic periods may be locked.

When locked,

all sessions become read-only.

Only Administrators may unlock an academic period.

---

# Business Rules

Assessment must follow these rules.

Only active students may receive scores.

Sessions must belong to one academic period.

Templates are reusable.

Scores belong only to one participant.

Duplicate scores are prohibited.

Locked sessions cannot be modified.

Archived sessions cannot be restored automatically.

Historical reports must never change.

---

# Audit Trail

Every important operation creates an audit record.

Audit fields

Action

Module

Entity

Record ID

Old Value

New Value

User

Role

IPAddress

Timestamp

Device

Audit logs are immutable.

---

# Activity Timeline

Timeline records

Session Created

Session Updated

Participants Added

Participants Removed

Scores Saved

Scores Reviewed

Scores Approved

Session Locked

Session Archived

Import Executed

Export Executed

---

# Notification Rules

Notify users when

Session Created

Session Opened

Review Required

Approval Required

Session Locked

Import Completed

Import Failed

Score Updated

Notifications should appear

Inside Application

Email (Future)

Push Notification (Future)

---

# Search

Global search supports

Template Name

Category

Assessment Item

Session

Student

Evaluator

Academic Year

Semester

Results grouped by entity.

---

# Filtering

Every table should support

Academic Year

Semester

Class

Major

Category

Template

Session

Evaluator

Status

Date Range

Multiple filters may be combined.

---

# Sorting

Newest

Oldest

Alphabetical

Highest Score

Lowest Score

Completion

Status

Recently Updated

---

# Pagination

Default

25 rows

Options

25

50

100

250

Infinite scrolling is not recommended for assessment data.

---

# Import Strategy

Supported Formats

Excel

CSV

Future

API

JSON

Import Process

Upload

↓

Validation

↓

Preview

↓

Conflict Detection

↓

Import

↓

Summary

Import should never directly overwrite data.

---

# Conflict Resolution

If duplicate records exist

User may choose

Skip

Replace

Merge

Cancel

Default action

Skip

---

# Export Strategy

Supported Formats

Excel

CSV

PDF

Print

Future

Power BI

Google Sheets

API

Exports should respect

Filters

Sorting

Permissions

---

# Error Handling

Expected Errors

Duplicate Score

Permission Denied

Session Locked

Student Not Found

Invalid Formula

Weight Error

Import Failure

Network Failure

Unexpected errors should generate logs automatically.

---

# Recovery Strategy

Temporary failures

↓

Retry

Validation failures

↓

User correction

System failures

↓

Rollback

Database errors

↓

Restore transaction

No partial imports should remain.

---

# Performance Requirements

Support

5,000 Students

1,000 Sessions

10 Million Scores

Server-side

Filtering

Searching

Sorting

Aggregation

Caching should be used where appropriate.

---

# Scalability

The architecture should support

Multiple Schools

Multiple Branches

Multiple Academic Years

Unlimited Templates

Unlimited Sessions

Unlimited Assessment Items

Horizontal scaling should be possible.

---

# Accessibility

Keyboard Navigation

Screen Reader Support

High Contrast

Visible Focus

Reduced Motion

Accessible Tables

Accessible Charts

WCAG AA compliant.

---

# Responsive Design

Desktop

Full Spreadsheet

Laptop

Responsive Grid

Tablet

Compact Grid

Mobile

Summary View

Score editing on mobile should prioritize vertical scrolling.

---

# Security

Every request requires authentication.

Authorization must be validated server-side.

Soft Delete is recommended.

Sensitive operations require confirmation.

Critical operations require audit logging.

Assessment data must be encrypted during transmission.

---

# Backup Strategy

Automatic Daily Backup

Manual Backup

Restore Point

Version History

Historical Reports

Assessment history should never be permanently lost.

---

# Integration

Student Registry

Attendance

Character Points

Dashboard

Reports

Notification Center

Authentication

Academic Calendar

Future integrations

Finance

Parent Portal

Student Portal

Mobile App

Learning Management System

---

# API Principles

Assessment should expose

Categories

Templates

Items

Sessions

Participants

Scores

Reports

Analytics

Every endpoint should support

Pagination

Filtering

Sorting

Searching

Permission Validation

---

# Future Enhancements

Rubric Assessment

Competency Assessment

AI Score Analysis

AI Performance Prediction

Voice Input

Offline Assessment

QR Assessment

Peer Assessment

Self Assessment

Parent Assessment

Custom Formula Builder

Assessment Versioning

Digital Signature

Electronic Report Card

Machine Learning Recommendation

Natural Language Feedback Generator

---

# Definition of Done

The Assessment Module is complete when

Assessment structures are reusable.

Templates can be used repeatedly.

Sessions remain independent.

Scores are fully traceable.

Reports are reproducible.

Permissions are enforced.

Audit logs are complete.

Dashboard integration works correctly.

Performance targets are met.

Accessibility standards are satisfied.

The module follows the Design System.

The module follows the Architecture Guide.

The module follows the Coding Standards.

---

# Final Principle

Assessment is not a grading form.

Assessment is a configurable evaluation platform.

Configuration should remain reusable.

Operational data should remain independent.

Historical records should remain immutable.

Every assessment should be reproducible, auditable, and scalable.

The Assessment Engine should be capable of supporting future educational models without requiring architectural changes.

---

# End of Assessment Module