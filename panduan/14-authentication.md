# Authentication
Version: 1.0

---

# Purpose

Authentication is the gateway to the School Information System.

It must feel:

- Professional
- Secure
- Calm
- Trustworthy
- Fast

The authentication experience should reassure users while minimizing friction.

---

# Design Principles

Authentication pages should:

- Focus on one primary task
- Reduce distractions
- Build user confidence
- Explain errors clearly
- Require minimal effort

Avoid clutter.

---

# Supported Pages

The authentication module consists of:

- Login
- Forgot Password
- Reset Password
- Session Expired
- Access Denied
- Account Locked
- Two-Factor Authentication (Future Ready)

---

# Authentication Layout

Desktop

Split Layout

---------------------------------------------------------

Illustration / Branding | Login Form

---------------------------------------------------------

Ratio

45%

55%

---

Tablet

Center Card

---

Mobile

Single Column

Centered

---

# Branding Area

Contains

- School Logo
- School Name
- Application Name
- Tagline
- Illustration

Purpose

Strengthen identity.

Avoid excessive information.

---

# Login Form

Contains

Title

Subtitle

Username

Password

Remember Me

Forgot Password

Login Button

Support Contact

---

# Login Card

Width

480px

Maximum

520px

Radius

32px

Padding

40px

Shadow

Medium

Background

White

---

# Login Fields

Username

Text Input

Password

Password Input

Height

48px

Radius

18px

Autocomplete

Enabled

---

# Password Field

Features

Show Password

Hide Password

Caps Lock Detection

Password Manager Support

---

# Remember Me

Checkbox

Default

Unchecked

---

# Forgot Password

Display below password field.

Always visible.

---

# Login Button

Width

100%

Height

52px

Primary Blue

Loading state required.

---

# Footer

Contains

Version

Copyright

Organization Name

Privacy Policy (optional)

---

# Forgot Password

Fields

Email

or

Username

Flow

1. Enter Email

↓

2. Verification

↓

3. Reset Link

↓

4. Confirmation

---

# Reset Password

Fields

New Password

Confirm Password

Requirements

Minimum Length

Uppercase

Lowercase

Number

Special Character

Password Strength Indicator

Recommended

---

# Password Strength

Levels

Weak

Fair

Good

Strong

Excellent

Color

Gray

Orange

Blue

Green

Dark Green

---

# Session Expired

Display

Friendly message

Explanation

Button

Login Again

Preserve unsaved work whenever possible.

---

# Account Locked

Explain

Reason

Remaining Time

Support Contact

Avoid revealing security-sensitive information.

---

# Access Denied

Display

Illustration

Title

Description

Return Button

Contact Administrator

---

# Error Messages

Incorrect

Login Failed

Correct

Incorrect username or password.

Incorrect

Unknown Error

Correct

Unable to connect to the server.

Please try again.

---

# Success Feedback

Successful login

Redirect smoothly.

Do not show unnecessary confirmation screens.

---

# Loading

Disable inputs.

Disable button.

Show loading spinner inside button.

Do not block entire page.

---

# Validation

Validate

Required Fields

Email Format

Password Length

Inline validation preferred.

---

# Security

Always

HTTPS

Secure Cookies

CSRF Protection

Session Timeout

Never

Store passwords locally.

Never

Display technical errors to users.

---

# Multi-Factor Authentication

Future Support

Authentication App

Email OTP

SMS OTP

Backup Codes

Remember Device

---

# Login Attempts

Recommended

Maximum

5 attempts

Temporary lock

15 minutes

Log security events.

---

# Accessibility

Keyboard Navigation

Required

Focus Visible

Required

Labels Visible

Required

Screen Reader Friendly

Required

---

# Responsive

Desktop

Split Layout

Tablet

Centered Card

Mobile

Single Column

Full Width Button

---

# Illustration Style

Minimal

Flat + Soft Glassmorphism

Education Theme

Light Colors

No heavy gradients.

---

# Color Usage

Primary

Blue

Success

Green

Warning

Orange

Danger

Red

Neutral

Gray

Never use excessive colors.

---

# Animation

Fade

150ms

Card Entrance

200ms

Button Hover

200ms

Loading Spinner

Continuous

Subtle

---

# User Experience

Users should be able to:

- Login within 10 seconds.
- Recover forgotten passwords easily.
- Understand every error.
- Feel confident that the system is secure.

---

# Do

✓ Keep forms short

✓ Explain errors clearly

✓ Show loading feedback

✓ Support password managers

✓ Support keyboard navigation

✓ Preserve entered values

✓ Use secure authentication practices

---

# Don't

✗ Overcomplicate login

✗ Hide validation errors

✗ Force unnecessary password rules

✗ Auto-clear forms after errors

✗ Reveal sensitive system information

✗ Use distracting animations

---

# Success Criteria

Authentication should feel effortless.

The interface should communicate professionalism, security, and reliability from the very first interaction.

A first-time user should understand the login page within five seconds and complete authentication without confusion.