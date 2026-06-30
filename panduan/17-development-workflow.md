# Development Workflow
Version: 1.0

---

# Purpose

This document defines the standard development workflow for the School Information System.

Claude Code must follow this workflow before writing, modifying, or deleting any code.

The objective is to ensure:

- Consistency
- Maintainability
- Predictability
- Reusability
- High quality implementation

Speed must never reduce quality.

---

# Golden Rule

Think first.

Understand first.

Design first.

Code last.

Never start writing code immediately.

---

# Development Priority

Always prioritize:

1. Correctness
2. Consistency
3. Simplicity
4. Maintainability
5. Performance
6. Visual Polish

Never sacrifice architecture for speed.

---

# Workflow

Every task follows exactly the same sequence.

---

## Phase 1 — Understand

Before writing code:

Identify

- User goal
- Business goal
- Existing implementation
- Related modules
- Required Design System documents

Ask:

What problem is actually being solved?

Never assume.

---

## Phase 2 — Explore

Search the project first.

Identify:

Existing components

Existing hooks

Existing services

Existing utilities

Existing types

Existing schemas

Existing layouts

Never duplicate existing functionality.

---

## Phase 3 — Reuse

Before creating anything new, check whether an existing solution can be reused.

Priority:

Existing Component

↓

Existing Hook

↓

Existing Utility

↓

Existing Service

↓

Create New

Reuse is preferred over creation.

---

## Phase 4 — Design

Before implementation decide:

Component hierarchy

State ownership

Data flow

Validation

Error handling

Loading states

Empty states

Permission handling

Responsive behavior

Accessibility

Only after these decisions may implementation begin.

---

## Phase 5 — Implement

Implement in small steps.

Each step should remain functional.

Avoid writing hundreds of lines before testing mentally.

---

## Phase 6 — Review

After implementation verify:

Design System

Architecture

Accessibility

Performance

Responsive layout

Typing

Naming

Code duplication

Unused code

Complexity

---

## Phase 7 — Refactor

Simplify.

Extract reusable logic.

Improve readability.

Reduce duplication.

Do not refactor unrelated code.

---

# Design System Checklist

Before building UI verify:

Design Principles

Design Tokens

Layout System

Component Library

Navigation

Motion

Accessibility

Icons

Charts

Forms

Tables

Authentication

Never bypass the Design System.

---

# Architecture Checklist

Verify:

Feature location

Folder structure

Imports

Hooks

Services

Repositories

Types

Validation

Permissions

API layer

Architecture consistency is mandatory.

---

# UI Checklist

Every page must include:

Page Header

Loading State

Empty State

Error State

Permission State

Responsive Layout

Keyboard Navigation

Visual hierarchy

Primary Action

Consistent spacing

---

# CRUD Checklist

Every CRUD page should support:

Create

Read

Update

Delete

Search

Filter

Sort

Pagination

Export

Bulk Action (when applicable)

Confirmation Dialog

Success Toast

Error Feedback

---

# Forms Checklist

Every form includes:

Visible Labels

Required indicators

Validation

Helper text

Loading button

Cancel action

Success feedback

Unsaved changes warning

Accessible navigation

---

# Tables Checklist

Every table includes:

Search

Filters

Pagination

Sorting

Status badges

Bulk selection (if required)

Overflow actions

Responsive behavior

Export (when applicable)

---

# Component Creation Rules

Before creating a component ask:

Can an existing component solve this?

If yes,

reuse it.

Create a new component only when:

A genuinely new pattern exists.

---

# Naming Rules

Components

PascalCase

Hooks

useSomething

Types

SomethingType

Interfaces

SomethingProps

Utilities

camelCase

Constants

UPPER_CASE

Never abbreviate unnecessarily.

---

# File Creation Rules

Every new file should have a clear responsibility.

Avoid:

Utils with unrelated functions

Huge Components

Large Hooks

Massive Services

---

# State Rules

Local State

↓

Context

↓

TanStack Query

↓

Global Store

Never use global state by default.

---

# API Workflow

UI

↓

Hook

↓

Service

↓

Repository

↓

Database

Never skip layers.

---

# Error Handling Workflow

Every async operation should handle:

Loading

↓

Success

↓

Error

↓

Retry

↓

Recovery

---

# Permission Workflow

Always verify:

Authentication

↓

Role

↓

Permission

↓

Business Rule

Never rely on UI visibility alone.

---

# Performance Workflow

Prefer:

Server Components

↓

Streaming

↓

Lazy Loading

↓

Memoization (only if needed)

Avoid premature optimization.

---

# Responsive Workflow

Desktop

↓

Tablet

↓

Mobile

Never design mobile first for this project.

---

# Accessibility Workflow

Keyboard

Focus

Labels

Contrast

ARIA

Reduced Motion

Touch Targets

Required for every page.

---

# Refactoring Rules

Allowed:

Extract Components

Extract Hooks

Extract Utilities

Simplify Logic

Improve Naming

Reduce Duplication

Avoid:

Changing unrelated behavior

Massive rewrites

Architecture drift

---

# Code Review Checklist

Before considering work complete verify:

□ No duplicated logic

□ No duplicated styles

□ No magic numbers

□ No unused imports

□ No console.log

□ No commented-out code

□ Strong typing

□ Reusable components

□ Responsive

□ Accessible

□ Design System compliant

□ Architecture compliant

---

# Decision Hierarchy

Whenever uncertain choose:

Usability

↓

Consistency

↓

Maintainability

↓

Performance

↓

Visual Beauty

---

# If Multiple Solutions Exist

Choose the solution that:

Requires fewer assumptions

Produces less duplication

Improves readability

Improves reusability

Aligns with existing architecture

---

# Things Claude Must Never Do

Never invent a new design language.

Never create duplicate components.

Never ignore design tokens.

Never bypass validation.

Never mix business logic into UI.

Never introduce inconsistent spacing.

Never introduce arbitrary colors.

Never redesign existing patterns without request.

Never optimize prematurely.

Never modify unrelated code.

---

# Definition of Done

A task is finished only if:

✓ Business requirements satisfied

✓ Design System followed

✓ Architecture followed

✓ Components reused

✓ Validation complete

✓ Responsive

✓ Accessible

✓ Performant

✓ Maintainable

✓ Production ready

If one item fails,

the task is not complete.

---

# Final Principle

Claude Code is not merely generating code.

Claude Code is acting as a senior software engineer working within an established product, design system, and architecture.

Every decision should strengthen the long-term consistency of the application.

Future maintainability is more valuable than short-term speed.