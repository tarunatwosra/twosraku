# Form Guidelines
Version: 1.0

# Purpose

Forms are the primary interface for creating and editing school data.
They must be simple, consistent, accessible, and efficient.

---

# Principles

- Minimize cognitive load
- Show only required information
- Group related fields
- Prefer sensible defaults
- Validate early
- Preserve user input

---

# Layout

Max width: 960px

Padding: 32px

Use:
- One column for simple forms
- Two columns for medium forms
- Multi-step wizard for complex forms

---

# Structure

1. Page title
2. Description
3. Form sections
4. Sticky action bar

---

# Sections

Group fields into logical sections.

Example:
- Student Identity
- Parent Information
- Academic Information
- Contact Information

Each section should have:
- Title
- Optional description
- Consistent spacing

---

# Fields

Inputs:
- Text
- Number
- Email
- Phone
- Date
- Select
- Multi Select
- Textarea
- Checkbox
- Radio
- Switch
- File Upload

Height:
48px

Radius:
18px

---

# Labels

Always visible above the field.

Required fields use *

Provide helper text only when necessary.

---

# Validation

Validate:
- Required
- Format
- Length
- Range
- Duplicate values

Show errors inline below the field.

Never clear entered values after validation errors.

---

# Buttons

Primary:
Save

Secondary:
Cancel

Optional:
Save & New

Place actions at the bottom-right.

Sticky action bar is recommended for long forms.

---

# Wizards

Use for long processes.

Show:
- Step indicator
- Previous
- Next
- Save Draft
- Finish

Maximum 6 steps.

---

# File Upload

Support drag & drop.

Show:
- Accepted formats
- Maximum size
- Upload progress
- Preview when applicable

---

# Unsaved Changes

Warn users before leaving the page.

Offer:
- Save
- Discard
- Cancel

---

# Loading

Disable submit while processing.

Show loading state on submit button.

---

# Accessibility

Keyboard navigation required.

Associate every input with a label.

Clearly identify errors.

---

# Responsive

Desktop:
Two columns where appropriate.

Tablet:
Single column preferred.

Mobile:
Single column only.

---

# Success Criteria

A good form should:
- Be understandable within seconds
- Require minimal scrolling
- Prevent common mistakes
- Be fast to complete
- Maintain a consistent experience across the application
