# Settings Module
Version: 2.0
Updated: 2026-07-03

---

# Purpose

Settings is the centralized configuration engine of Twosraku.

The module manages all configurable aspects of the application without modifying operational data.

Settings determine how the system behaves, not what data it contains.

Configuration should be centralized, reusable, auditable, and secure.

---

# Philosophy

Configuration belongs in Settings.

Business data belongs in operational modules.

Avoid hardcoded values.

Every configurable option should be managed through the Settings Module.

Historical configuration changes should remain traceable.

---

# Primary Objectives

Centralize application configuration.

Manage global settings.

Manage organizational settings.

Manage academic configuration.

Manage security settings.

Manage integrations.

Provide configuration history.

Support future expansion.

---

# Scope

General Settings

School Profile

Academic Settings

User Management

Roles & Permissions

Appearance

Notifications

Import & Export

Reports

Security

Backup

Storage

Integrations

Audit Logs

System Maintenance

AI Configuration (Future)

---

# Navigation

Settings

├── General

├── School Profile

├── Academic

│   ├── Tahun Ajaran
│   ├── Sistem Penilaian
│   ├── **Jurusan** (NEW v2.0)
│   └── **Kelas** (NEW v2.0)

├── Users

├── Roles & Permissions

├── Appearance

├── Notifications

├── Reports

├── Import & Export

├── Security

├── Backup & Restore

├── Storage

├── Integrations

├── Audit Logs

├── Maintenance

└── About

---

# General Settings

Purpose

Configure global application behavior.

---

## Properties

Application Name

Application Logo

School Short Name

Timezone

Language

Date Format

Time Format

Number Format

Currency

Default Page Size

Default Dashboard

Session Timeout

---

# School Profile

Purpose

Maintain official school identity.

---

## Properties

School Name

NPSN

Address

City

Province

Postal Code

Phone

Email

Website

Principal Name

School Logo

School Stamp

Vision

Mission

---

Business Rules

Changes affect new reports only.

Historical reports remain unchanged.

---

# Academic Settings

Purpose

Configure academic structure.

---

## Properties

Academic Year

Semester

Active Semester

Grading Scale

Attendance Threshold

Character Formula

Passing Grade

Default Class Status

Graduation Rules

**Jurusan (Majors) - NEW v2.0**

**Kelas (Classes) - NEW v2.0**

---

Academic changes require administrator permission.

---

## Academic Tabs (NEW v2.0)

### 1. Tahun Ajaran

Mengeelola tahun ajaran sekolah.

**Aksi:**
- Lihat daftar tahun ajaran
- Pilih tahun ajaran aktif
- Tambah tahun ajaran baru (disabled - belum diimplementasi)

**Catatan:** Tahun ajaran aktif menentukan data kelas yang ditampilkan.

---

### 2. Sistem Penilaian

Mengatur skala penilaian dan ambang batas kelulusan.

**Komponen:**
- Skala Penilaian: A, B, C, D, E dengan rentang skor
- Batas Kehadiran: Minimum persentase kehadiran untuk lulus
- Nilai Kelulusan: Minimum nilai untuk dinyatakan lulus

---

### 3. Jurusan (Majors) - NEW v2.0

Mengeelola jurusan/program keahlian di sekolah.

**Field:**
| Field | Tipe | Required | Deskripsi |
|-------|------|----------|-----------|
| Nama Jurusan | Text | ✅ | Nama lengkap jurusan |
| Kode Jurusan | Text | ✅ | Kode singkat unik (contoh: "TKJ", "RPL") |
| Deskripsi | Text | - | Deskripsi opsional |

**Aksi:**
- Tambah jurusan baru
- Edit jurusan
- Hapus jurusan (jika belum digunakan kelas)

**Contoh:**
| Nama | Kode | Deskripsi |
|------|------|-----------|
| Teknik Komputer dan Jaringan | TKJ | Program keahlian jaringan komputer |
| Rekayasa Perangkat Lunak | RPL | Program keahlian pengembangan software |
| Akuntansi | AKT | Program keahlian akuntansi |

---

### 4. Kelas (Classes) - NEW v2.0

Mengeelola kelas yang terdiri dari jurusan dan tahun ajaran.

**Field:**
| Field | Tipe | Required | Deskripsi |
|-------|------|----------|-----------|
| Nama Kelas | Text | ✅ | Nama kelas (contoh: "TKJ 1") |
| Jurusan | Select | ✅ | Pilih dari daftar jurusan |
| Tahun Ajaran | Select | ✅ | Pilih tahun ajaran aktif |
| Nomor Ruang | Text | - | Nomor ruang kelas (opsional) |

**Aksi:**
- Tambah kelas baru
- Edit kelas
- Hapus kelas (soft delete jika punya siswa, hard delete jika kosong)

**Filter:**
- Filter kelas berdasarkan tahun ajaran

**Integrasi:**
- Kelas yang dibuat di sini akan muncul di dropdown "Kelas" saat tambah/edit siswa di Buku Induk

**Business Rules:**
1. Kelas terikat pada tahun ajaran tertentu
2. Satu kombinasi jurusan + tahun ajaran bisa memiliki multiple kelas (TKJ 1, TKJ 2)
3. Menghapus kelas dengan siswa akan mengubah status menjadi "inactive" (soft delete)

**Catatan Semester:**
- Semester ditangani secara lokal oleh masing-masing modul (absensi, penilaian)
- Tidak dikelola di Settings Academic

---

# User Management

Purpose

Manage application users.

---

## User Properties

Name

Username

Email

Role

Status

Last Login

Password Status

Two-Factor Authentication

Assigned Modules

---

Supported Actions

Create

Edit

Deactivate

Reset Password

Lock Account

Unlock Account

Archive

---

# Roles & Permissions

Purpose

Define system authorization.

---

Permissions are managed by

Role

Module

Feature

Action

---

Supported Actions

View

Create

Update

Delete

Approve

Import

Export

Print

Settings

Audit

---

Permission changes require confirmation.

---

# Appearance

Purpose

Configure user interface.

---

Options

Theme

Accent Color

Density

Sidebar Style

Card Radius

Table Density

Animation Level

Glass Effect

Dashboard Layout

---

Appearance is stored per user.

Global defaults are configurable.

---

# Notification Settings

Purpose

Configure notification behavior.

---

Options

Enable Notifications

Reminder Frequency

Announcement Visibility

Default Priority

Notification Retention

Email (Future)

Push (Future)

WhatsApp (Future)

---

# Reports Settings

Purpose

Configure reporting defaults.

---

Options

Default Paper Size

Orientation

Header

Footer

Watermark

School Logo

Digital Signature

Export Format

Retention Policy

---

# Import & Export Settings

Purpose

Configure Data Exchange Engine.

---

Options

Default Import Strategy

Dry Run Required

Maximum File Size

Allowed Formats

Temporary Storage Duration

Export Limits

Import Templates

Rollback Availability

---

# Security

Purpose

Configure application security.

---

Options

Password Policy

Session Timeout

Login Attempts

Account Lockout

IP Restrictions (Future)

Device Tracking

Two-Factor Authentication

API Keys (Future)

Encryption Settings

---

# Backup & Restore

Purpose

Protect system data.

---

Options

Automatic Backup

Backup Schedule

Manual Backup

Restore Point

Retention Policy

Cloud Backup (Future)

---

Business Rules

Only administrators may restore backups.

---

# Storage

Purpose

Manage uploaded files.

---

Properties

Used Storage

Available Storage

Maximum Upload Size

Allowed File Types

Temporary Files

Cleanup Schedule

---

# Integrations

Purpose

Configure third-party services.

---

Supported Integrations

Email

Google Workspace

Microsoft 365

Cloud Storage

REST API

Webhook

Future AI Services

---

# Audit Logs

Purpose

Track configuration changes.

---

Tracked Events

Setting Updated

Role Changed

Permission Changed

User Created

Backup Restored

System Maintenance

Integration Updated

---

Audit history is immutable.

---

# Maintenance

Purpose

Perform system maintenance.

---

Available Actions

Clear Cache

Rebuild Index

Optimize Database

Clean Temporary Files

System Diagnostics

Maintenance Mode

Restart Background Jobs

---

Only administrators may access maintenance.

---

# About

Display

Application Version

Database Version

Release Date

License

Build Number

Documentation

Support Contact

---

# Search

Search all configuration items.

Supports

Keyword

Category

Property Name

Recent Changes

---

# Notifications

Notify administrators when

Critical Setting Changed

Backup Failed

Storage Full

Security Issue

Integration Failed

License Expiring (Future)

---

# Permissions

Administrator

Full Access

Principal

Read Only

Vice Principal

Limited Access

Teacher

Profile Only

Staff

Profile Only

Students (Future)

Profile Only

---

# Audit Requirements

Every configuration change records

Old Value

New Value

Changed By

Timestamp

Reason

IP Address

Device

---

# Performance Requirements

Configuration Load

< 500 ms

Search

< 300 ms

Save

< 1 second

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

Encrypted Configuration

Audit Logging

Permission Validation

Confirmation for Critical Changes

---

# Future Enhancements

AI Configuration

Feature Flags

Plugin Manager

Multi-School Configuration

Multi-Language Configuration

System Health Dashboard

Configuration Profiles

Cloud Synchronization

Environment Management

---

# Definition of Done

The Settings Module is complete when

All configurable behavior is managed through Settings.

No operational data is stored in Settings.

Configuration changes are audited.

Permissions are enforced.

Performance targets are met.

Accessibility standards are satisfied.

The module follows the Design System.

---

# Final Principle

Settings is not a preferences page.

Settings is the centralized configuration engine of Twosraku.

Every configurable behavior should be managed through this module while maintaining security, consistency, auditability, and long-term scalability.

---

# Changelog v2.0 (2026-07-03)

## Perubahan dari v1.0

1. **Academic Settings diperluas** dengan tab baru:
   - Jurusan (Majors): Kelola jurusan/program keahlian
   - Kelas (Classes): Kelola kelas yang terdiri dari nama + jurusan + tahun ajaran

2. **Integrasi dengan Buku Induk**:
   - Kelas yang dibuat di Settings Academic akan muncul di dropdown "Kelas" saat tambah/edit siswa

3. **Database Layer**:
   - CRUD operations untuk majors, classes
   - Type definitions untuk Class, Major

**Catatan**: Tingkat (grade) tidak lagi disimpan di tabel terpisah. Informasi tingkat diambil dari nama kelas.

---

**Last Updated**: 2026-07-05
**Version**: 2.1
