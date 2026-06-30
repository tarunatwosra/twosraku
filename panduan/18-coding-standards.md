# Coding Standards
Version: 1.0

---

# Purpose

This document defines the coding standards for the School Information System.

The goal is to produce code that is:

- Readable
- Consistent
- Predictable
- Maintainable
- Reusable
- Production Ready

Every contributor must follow these standards.

---

# Philosophy

Code is read far more often than it is written.

Always optimize for readability.

Consistency is more important than personal coding style.

---

# Core Principles

Prefer:

Simple

↓

Explicit

↓

Reusable

↓

Maintainable

↓

Optimized

Never optimize before measuring.

---

# Language

Use

TypeScript

Only.

Never introduce JavaScript files.

---

# Type Safety

Avoid

```
any
```

Prefer

```
unknown
```

or

proper interfaces.

Every public function should have explicit types.

---

# Naming

Use descriptive names.

Good

```
studentAttendance
```

Bad

```
data
```

Good

```
calculateSemesterScore()
```

Bad

```
calc()
```

---

# Naming Convention

Components

PascalCase

Example

```
StudentCard.tsx
```

Hooks

```
useSomething.ts
```

Example

```
useAttendance.ts
```

Utilities

camelCase

Example

```
formatDate.ts
```

Constants

UPPER_CASE

Example

```
MAX_UPLOAD_SIZE
```

Types

PascalCase

Example

```
Student
```

Interfaces

PascalCase

Example

```
StudentFormProps
```

Enums

PascalCase

Example

```
AttendanceStatus
```

---

# Folder Naming

Always

kebab-case

Good

```
student-profile
```

Bad

```
StudentProfile
```

---

# File Naming

React Components

PascalCase

Hooks

camelCase

Utilities

camelCase

Configuration

kebab-case

---

# Import Order

Always

1.

React

2.

Next.js

3.

External Libraries

4.

Internal Components

5.

Hooks

6.

Services

7.

Repositories

8.

Utilities

9.

Types

10.

Styles

Separate each group with one blank line.

---

# Components

Components should be

Small

Focused

Reusable

Single Responsibility

Avoid components larger than

300 lines.

---

# Props

Prefer

Explicit Props

Avoid passing entire objects unless necessary.

Good

```
<StudentCard
  name
  className
/>
```

Avoid

```
<StudentCard
  student
/>
```

unless required.

---

# Functions

Prefer

Small Functions

Maximum

40 lines

Extract reusable logic.

---

# Conditionals

Prefer

Early Return

Good

```
if (!student) return null
```

Avoid

Deep nesting.

---

# Boolean Naming

Good

```
isLoading
```

```
hasPermission
```

```
canDelete
```

Avoid

```
flag
```

```
status
```

---

# Constants

Never use

Magic Numbers

Bad

```
if(score > 75)
```

Good

```
PASSING_SCORE
```

---

# Strings

Never hardcode repeated strings.

Use constants.

---

# Comments

Comments explain

WHY

not

WHAT

Avoid

```
increment counter
```

Prefer

```
Required by Ministry reporting format.
```

---

# React

Prefer

Functional Components

Only.

Never use Class Components.

---

# State

Keep state minimal.

Derived values

should not be stored.

Use

```
useMemo()
```

only when necessary.

---

# Effects

Avoid unnecessary

useEffect.

Prefer

Server Components

or

derived state.

---

# Forms

Always use

React Hook Form

Validation

Zod

Never build custom validation.

---

# API

Never call

fetch()

inside presentation components.

Use

Services

or

Server Actions.

---

# Error Handling

Always

Handle Errors

Gracefully.

Never

ignore exceptions.

---

# Async

Always

async/await

Avoid

.then()

chains.

---

# Logging

Never

Leave

console.log

in production.

Use

logger

service.

---

# Styling

Never

Inline Styles.

Always

Tailwind

or

Component Variants.

---

# Tailwind

Prefer utility classes.

Avoid

deeply nested

class strings.

Use

```
cn()
```

helper.

---

# Component Variants

Use

CVA

(Class Variance Authority)

when components have multiple variants.

---

# Accessibility

Every interactive component

requires

Keyboard Support

ARIA Labels

Visible Focus

---

# Performance

Prefer

Server Components

Use Client Components

only when required.

Lazy load

heavy components.

---

# Duplication

Never duplicate

Components

Hooks

Utilities

Business Logic

Search first.

Reuse second.

Create third.

---

# Testing Mindset

Write code

that is easy to test.

Avoid

tight coupling.

---

# Formatting

Use

Prettier

Never manually align spacing.

---

# Linting

ESLint errors

must be

zero.

Warnings should be minimized.

---

# Git

One feature

One commit

Write meaningful commit messages.

Good

```
feat(attendance): add bulk attendance import
```

Good

```
fix(student): prevent duplicate student number
```

---

# Pull Request Checklist

Before merging

✓ No TypeScript errors

✓ No ESLint errors

✓ Responsive

✓ Accessible

✓ Reusable

✓ No duplicated code

✓ Uses Design System

✓ Uses Architecture

✓ Loading handled

✓ Errors handled

✓ Empty state handled

---

# Forbidden

Never

Use any

Use console.log

Commit commented code

Mix UI and business logic

Create giant components

Hardcode colors

Hardcode spacing

Duplicate logic

Ignore lint warnings

Skip validation

---

# Definition of Done

Code is complete only if

✓ Readable

✓ Typed

✓ Reusable

✓ Maintainable

✓ Responsive

✓ Accessible

✓ Performant

✓ Production Ready

---

# Final Rule

Write code for the next developer.

Assume every file will be maintained for years.

Optimize for clarity before cleverness.

Consistency is always more valuable than personal preference.