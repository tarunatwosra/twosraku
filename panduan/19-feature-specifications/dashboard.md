# Dashboard Module
Version: 1.0

---

# Purpose

Dashboard is the primary landing page of Twosraku.

It provides a real-time overview of school activities, student statistics, attendance, assessments, and character development.

The Dashboard does not own any data.

Instead, it aggregates information from other modules and presents it in a concise, actionable format.

The Dashboard should allow administrators to understand the current state of the school within a few seconds.

---

# Scope

Dashboard is a read-only analytics module.

Users cannot create, edit, or delete data directly from this page.

Primary responsibilities:

- Display summary statistics.
- Highlight important information.
- Provide quick access to frequently used actions.
- Notify users of important events.
- Surface potential issues requiring attention.

---

# Supported Users

Administrator

Vice Principal

Teacher (Limited)

Staff (Limited)

Principal

Different roles may see different widgets depending on permissions.

---

# Data Sources

Dashboard retrieves data from:

Student Registry

Attendance

Assessment

Character Points

Authentication

System Settings

Academic Calendar

The Dashboard must never store duplicated data.

---

# Navigation

Main Navigation

↓

Dashboard

This page is the default landing page after successful login.

---

# Layout Structure

The page consists of five sections.

Section 1

Page Header

Section 2

Quick Statistics

Section 3

Analytical Widgets

Section 4

Operational Widgets

Section 5

Activity Timeline

---

# Page Header

Contains

Page Title

Current Academic Year

Current Semester

Date

Global Search

Notification Button

Profile Menu

Quick Actions

Quick Actions include

Add Student

Record Attendance

Input Assessment

Record Character Point

Generate Report

---

# Quick Statistics

Purpose

Provide an instant overview of school conditions.

Widgets

Total Students

Male Students

Female Students

Active Classes

Teachers

Attendance Today

Assessment Completion

Character Violations

Each KPI displays

Current Value

Trend

Percentage Change

Mini Sparkline

Last Updated

Clicking a KPI opens the related module.

---

# Attendance Widget

Displays

Attendance Today

Present

Permission

Sick

Absent

Late

Visualization

Donut Chart

Summary Card

Trend

Comparison with yesterday.

---

# Assessment Widget

Displays

Assessment Completion

Average Score

Highest Score

Lowest Score

Subjects Waiting for Assessment

Visualization

Progress Ring

Bar Chart

---

# Character Widget

Displays

Positive Points

Negative Points

Top Positive Students

Students Requiring Attention

Visualization

Stacked Bar Chart

Leaderboard

---

# Student Distribution

Displays

Students by

Class

Major

Gender

Visualization

Bar Chart

Donut Chart

---

# Recent Activities

Displays

Recently Added Students

Recent Attendance

Latest Assessments

Latest Character Records

Newest first.

Maximum

20 items.

---

# Notifications

Display

Unread Notifications

Examples

Attendance not submitted

Assessment deadline

Student transferred

System maintenance

Users may mark notifications as read.

---

# Academic Calendar

Display

Today's Events

Upcoming Events

Examinations

School Holidays

Important Activities

---

# Global Search

Searches

Students

Teachers

Classes

Assessment

Attendance

Character Records

Results grouped by category.

---

# Quick Actions

Purpose

Reduce navigation time.

Supported Actions

Add Student

Take Attendance

Create Assessment

Record Character Point

Generate Report

Only actions permitted by the user's role are displayed.

---

# Refresh Strategy

Dashboard refreshes automatically every 5 minutes.

Users may manually refresh data.

Only changed widgets should reload.

Avoid full-page refreshes.

---

# Business Rules

Dashboard data is read-only.

All displayed values originate from source modules.

If source data changes, dashboard statistics update automatically.

Widgets should not perform calculations independently when aggregated values are available.

---

# Permissions

Administrator

Full Dashboard

Principal

Full Dashboard

Teacher

Attendance

Assessment

Own Classes

Staff

Operational widgets only

Unauthorized widgets must remain hidden.

---

# Loading State

Each widget loads independently.

Use skeleton placeholders.

One failed widget must not block the others.

---

# Empty State

If a widget has no data,

display

Icon

Title

Description

Recommended Action

Example

"No attendance has been recorded today."

---

# Error State

If a widget cannot retrieve data,

display

Friendly message

Retry Button

Do not expose technical errors.

---

# Performance Requirements

Dashboard should load within

2 seconds

on a standard school internet connection.

Heavy calculations should be performed server-side.

Widgets should request only the data they require.

---

# Accessibility

Every widget must support

Keyboard Navigation

Visible Focus

Screen Reader Labels

Accessible Charts

Reduced Motion

---

# Responsive Behavior

Desktop

Multi-column grid

Tablet

Reduced columns

Mobile

Single column

Widget order remains consistent across devices.

---

# Dashboard Dependencies

Student Registry

↓

Attendance

↓

Assessment

↓

Character Points

↓

Dashboard

Dashboard cannot function without master data.

---

# Audit

Dashboard itself does not generate audit records.

Audit information belongs to the source modules.

---

# Future Enhancements

Custom Dashboard

Widget Rearrangement

Saved Layouts

Real-Time Updates

AI Insights

Predictive Analytics

Parent Dashboard

Teacher Dashboard

Student Dashboard

---

# Definition of Done

The Dashboard is complete when it:

Displays accurate data.

Loads quickly.

Uses reusable widgets.

Handles loading, empty, and error states.

Respects permissions.

Provides meaningful insights.

Supports responsive layouts.

Follows the Design System.

---

# Final Principle

Dashboard is not a reporting page.

Dashboard is a decision-making interface.

Every widget should help users identify what requires attention and where they should navigate next.