# Architecture
Version: 1.0

---

# Purpose

This document defines the software architecture of the School Information System.

It ensures the application remains:

- Scalable
- Maintainable
- Modular
- Predictable
- Easy to extend

UI consistency alone is not enough.

The codebase must also be consistent.

---

# Technology Stack

Framework

Next.js (App Router)

Language

TypeScript

Styling

TailwindCSS

Component Library

shadcn/ui

Icons

Lucide

Forms

React Hook Form

Validation

Zod

Tables

TanStack Table

Data Fetching

TanStack Query

Charts

Recharts

Animation

Framer Motion

Authentication

Better Auth (or NextAuth if required)

ORM

Prisma

Database

PostgreSQL

Package Manager

pnpm

Linting

ESLint

Formatting

Prettier

---

# Architectural Principles

Always prefer:

Composition

over

Inheritance

Reuse

over

Duplication

Small Components

over

Large Components

Explicit Code

over

Magic

Convention

over

Configuration

---

# Project Structure

```

src/
│
├── app/
├── components/
│ ├── ui/
│ ├── common/
│ ├── dashboard/
│ ├── forms/
│ ├── tables/
│ ├── charts/
│ └── layout/
│
├── features/
│ ├── students/
│ ├── attendance/
│ ├── assessment/
│ ├── teachers/
│ ├── inventory/
│ └── reports/
│
├── hooks/
├── lib/
├── services/
├── repositories/
├── types/
├── utils/
├── constants/
├── styles/
└── config/

```

---

# Feature First

Business modules belong inside

features/

Example

features/

students/

attendance/

assessment/

teachers/

inventory/

Each feature owns:

Components

Hooks

Services

Schemas

Types

---

# UI Layer

Contains

Presentation only.

Never place business logic inside UI components.

---

# Business Layer

Contains

Business rules.

Validation.

Transformations.

Permissions.

---

# Data Layer

Responsible for

API

Database

Repositories

External Services

---

# Separation

Never mix

Database

inside

UI Components.

Never call Prisma inside React Components.

Never place fetch logic inside presentational components.

---

# Component Structure

Each component should be

Small

Reusable

Independent

Easy to test

---

# Component Categories

ui/

Pure reusable components.

Button

Card

Input

Dialog

Table

Badge

---

common/

Reusable business components.

Student Card

Teacher Avatar

Status Badge

---

feature/

Feature-specific components.

Attendance Table

Grade Form

Inventory Dialog

---

# Page Components

Pages should

Assemble

Components.

Pages should not contain business logic.

---

# Hooks

Custom hooks belong in

hooks/

Examples

useDebounce

usePagination

useSearch

usePermission

useTheme

Feature hooks stay inside

features/

---

# Forms

Always use

React Hook Form

Validation

Zod

Never create custom validation.

---

# Tables

Always use

TanStack Table

Never create manual table logic.

---

# Charts

Always use

Recharts

Follow

13-charts.md

---

# API

Use

Server Actions

or

Route Handlers

Keep API layer separated.

---

# Services

Services contain

Business processes.

Example

StudentService

AttendanceService

AssessmentService

---

# Repositories

Repositories

Handle database operations only.

Never place business logic here.

---

# Validation

Validation belongs in

Zod Schemas.

Never duplicate validation.

---

# Types

Centralize shared types.

Avoid duplicated interfaces.

---

# Constants

Place

Enums

Labels

Routes

Permissions

Status

Academic Years

inside

constants/

---

# Utilities

Only

Pure Functions.

Never depend on UI.

---

# Configuration

Place

Navigation

Sidebar

Permissions

Menus

System Settings

inside

config/

Avoid hardcoded values.

---

# Authentication

Authentication

Middleware

Permission

Role Checking

Should be centralized.

---

# Authorization

Use

RBAC

Roles

Examples

Administrator

Teacher

Staff

Student

Principal

Permissions

Read

Create

Update

Delete

Export

Print

---

# Error Handling

Centralized.

Never

try/catch

everywhere.

Use

Error Boundaries

Global Error Handler

---

# Logging

Log

Authentication

Errors

Database Failures

System Events

Never log passwords.

---

# State Management

Use

React State

↓

Context

↓

TanStack Query

↓

Global Store

Only when necessary.

Avoid unnecessary global state.

---

# File Naming

Components

PascalCase.tsx

Hooks

useSomething.ts

Utilities

something.ts

Pages

page.tsx

Layouts

layout.tsx

---

# Import Order

1.

React

2.

Next

3.

Libraries

4.

Components

5.

Hooks

6.

Services

7.

Utilities

8.

Types

9.

Styles

---

# Folder Depth

Avoid

More than

4 levels

deep.

---

# Performance

Use

Server Components

by default.

Client Components

only when required.

---

# Lazy Loading

Use lazy loading for

Charts

Dialogs

Large Tables

Editors

---

# Memoization

Use

Memo

Callback

only when profiling indicates benefit.

Avoid premature optimization.

---

# Data Fetching

Server Components

for initial data.

TanStack Query

for client interactions.

---

# Loading

Always support

Loading

Empty

Error

Permission

Offline

States.

---

# Testing Ready

Components should be easy to test.

Avoid tightly coupled code.

---

# Scalability

Every module should be removable

without affecting unrelated modules.

---

# Coding Standards

Avoid

Nested conditions

Long functions

Huge components

Magic numbers

Hardcoded strings

---

# Security

Validate

Server Side

Never trust client input.

Always sanitize data.

---

# Documentation

Every complex feature should include

README.md

inside its feature folder.

---

# Definition of Done

A feature is complete only when

✓ UI follows Design System

✓ Business logic separated

✓ Validation implemented

✓ Permissions respected

✓ Loading handled

✓ Errors handled

✓ Empty state handled

✓ Responsive

✓ Accessible

✓ Reusable

✓ Typed

✓ Production Ready

---

# Final Rule

Architecture exists to make future development easier.

When multiple solutions are possible,

always choose the one that improves

maintainability,

readability,

and consistency.

Long-term consistency is more valuable than short-term convenience.