# AI Context
Version: 1.0

---

# Project Overview

Twosraku is a modern web-based School Administration System designed specifically for Indonesian vocational schools with a military-inspired student management culture (Taruna).

The application focuses on providing a clean, premium, scalable, and maintainable experience.

Twosraku is **NOT** an ERP.

Twosraku is **NOT** a generic School Information System.

Twosraku is a carefully designed administration platform centered around:

- Student Registry
- Attendance
- Assessment
- Character Development
- Dashboard
- Reporting

Every feature must follow the architecture and design system defined in this repository.

---

# Primary Goals

The system should

Reduce administrative workload.

Increase operational efficiency.

Support long-term maintainability.

Provide consistent user experience.

Remain scalable for future modules.

Every engineering decision should support these goals.

---

# Design Philosophy

The interface should feel

Professional

Modern

Premium

Minimal

Fast

Comfortable for daily use

Avoid flashy designs.

Avoid excessive gradients.

Avoid skeuomorphism.

Avoid excessive glassmorphism.

Glass effects should remain subtle.

Approximately 10% opacity.

Rounded corners are preferred.

---

# UI Principles

Interface should prioritize

Readability

Hierarchy

Spacing

Consistency

Accessibility

Keyboard efficiency

Large amounts of data should remain comfortable to read.

---

# Color Philosophy

Neutral first.

Accent second.

Avoid colorful interfaces.

Primary colors should communicate actions instead of decoration.

White remains dominant.

Gray creates hierarchy.

Accent color creates focus.

---

# Typography

Typography communicates hierarchy.

Never use font size merely for decoration.

Spacing is more important than font size.

Headers should be visually calm.

Body text should remain highly readable.

---

# Component Philosophy

Components should be reusable.

Avoid creating one-off components.

Prefer extending existing components.

Every component should follow

Design Tokens

Component Library

Spacing System

Motion Guidelines

Accessibility Rules

---

# Architecture Principles

Always separate

Presentation

Business Logic

Data Layer

Never mix business logic inside UI components.

Business logic belongs in services.

Components should remain stateless whenever possible.

---

# Feature Philosophy

Every feature should solve one responsibility.

Avoid feature overlap.

Prefer modular architecture.

New features should integrate instead of duplicate.

---

# Dashboard Philosophy

Dashboard is a summary.

Dashboard is not a workspace.

Dashboard should never become a reporting page.

Dashboard should answer

"What requires attention?"

instead of

"What happened last semester?"

---

# Student Registry Philosophy

Student Registry is the single source of truth.

Never duplicate student identity.

Every module references Student Registry.

---

# Attendance Philosophy

Attendance records presence.

Attendance never stores academic performance.

Attendance should be extremely fast.

Teachers should complete attendance within minutes.

---

# Assessment Philosophy

Assessment is an Evaluation Engine.

Assessment is not merely a score table.

Assessment consists of

Category

↓

Template

↓

Item

↓

Session

↓

Participant

↓

Score

↓

Calculation

↓

Reports

Never bypass this architecture.

---

# Character Philosophy

Character Points are not punishment.

Character Points are student development.

Positive behavior is equally important as violations.

Character history should remain immutable.

---

# Data Philosophy

Configuration

↓

Operational Data

↓

Analytics

↓

Reports

Never mix configuration with operational data.

Historical data should never depend on current configuration.

---

# Reporting Philosophy

Reports should reproduce historical data.

Reports should never recalculate historical values differently.

Reports must always be reproducible.

---

# Performance Philosophy

Optimize for

Large tables

Large datasets

Fast searching

Fast filtering

Minimal waiting

Prefer server-side processing.

---

# Accessibility Philosophy

Keyboard-first.

Mouse-friendly.

Screen-reader compatible.

High contrast.

Visible focus.

Accessible forms.

WCAG AA whenever possible.

---

# Security Philosophy

Every request requires authentication.

Every operation requires authorization.

Every important change requires audit logging.

Soft delete whenever possible.

Never trust client-side validation.

---

# AI Implementation Rules

When implementing features,

AI should

Read existing architecture first.

Reuse existing components.

Follow naming conventions.

Follow coding standards.

Follow design tokens.

Follow spacing rules.

Follow accessibility rules.

Never introduce inconsistent UI.

Never duplicate logic.

Never create shortcuts that violate architecture.

---

# Before Writing Code

Always ask

Does this already exist?

Can this component be reused?

Does this follow the Design System?

Does this follow the Architecture Guide?

Does this violate Coding Standards?

Will this scale in five years?

If the answer is uncertain,

prefer existing architecture.

---

# Database Principles

Normalize data.

Avoid duplicated information.

Use foreign keys.

Preserve historical records.

Soft delete where appropriate.

Never overwrite historical transactions.

---

# UX Principles

Minimize clicks.

Minimize typing.

Minimize scrolling.

Reduce cognitive load.

Show only relevant actions.

Hide advanced options until needed.

---

# Form Principles

Forms should

Validate early.

Explain errors clearly.

Prevent data loss.

Support keyboard navigation.

Autosave only when appropriate.

---

# Table Principles

Use server-side pagination.

Sticky headers.

Sticky first column.

Powerful filters.

Global search.

Bulk actions.

Responsive layout.

---

# Empty States

Never display an empty screen.

Always explain

Why there is no data.

What users can do next.

---

# Loading States

Prefer skeleton loaders.

Avoid blocking the interface.

Load sections independently.

---

# Error Handling

Explain the problem.

Suggest the solution.

Avoid technical language.

Never expose internal errors.

---

# Notifications

Notifications should

Be short.

Be actionable.

Avoid unnecessary interruptions.

Use success notifications sparingly.

---

# Scalability

Every new module should integrate naturally with

Dashboard

Reports

Notifications

Permissions

Audit Logs

Search

Global Settings

---

# Maintainability

Readable code is preferred over clever code.

Consistency is preferred over creativity.

Long-term maintainability is preferred over short-term speed.

---

# Decision Priority

When multiple implementations are possible,

prioritize

Correctness

↓

Maintainability

↓

Scalability

↓

Performance

↓

Developer Convenience

Never reverse this order.

---

# AI Golden Rules

Never redesign the application without instruction.

Never replace existing architecture.

Never invent new UI patterns.

Never ignore Design Tokens.

Never bypass business rules.

Never duplicate existing functionality.

Never remove accessibility.

Never remove audit logging.

Never hardcode values that belong to configuration.

Always build for long-term maintainability.

---

# Final Principle

Twosraku should feel like professional software built by a mature product team.

Every screen, every interaction, every component, and every line of code should contribute to a coherent, maintainable, scalable, and premium user experience.