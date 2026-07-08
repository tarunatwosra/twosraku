# Settings Module — Compact
Version: 2.1 | Updated: 2026-07-05

**Purpose:** Settings is Twosraku's centralized configuration engine, managing all configurable aspects of the application without touching operational data. Settings determine how the system behaves, not what data it contains. Configuration should be centralized, reusable, auditable, and secure.

**Philosophy:** configuration belongs in Settings; business data belongs in operational modules; avoid hardcoded values; every configurable option should be managed through Settings; historical configuration changes should remain traceable.

**Primary Objectives:** centralize application configuration; manage global/organizational/academic settings; manage security settings; manage integrations; provide configuration history; support future expansion.

**Scope:** General Settings, School Profile, Academic Settings, User Management, Roles & Permissions, Appearance, Notifications, Import & Export, Reports, Security, Backup, Storage, Integrations, Audit Logs, System Maintenance, AI Configuration (future).

**Navigation:** Settings → General, School Profile, Academic (Tahun Ajaran, Sistem Penilaian, **Jurusan** [NEW v2.0], **Kelas** [NEW v2.0]), Users, Roles & Permissions, Appearance, Notifications, Reports, Import & Export, Security, Backup & Restore, Storage, Integrations, Audit Logs, Maintenance, About.

### General Settings
**Purpose:** configure global application behavior.
**Properties:** Application Name, Application Logo, School Short Name, Timezone, Language, Date Format, Time Format, Number Format, Currency, Default Page Size, Default Dashboard, Session Timeout.

### School Profile
**Purpose:** maintain official school identity.
**Properties:** School Name, NPSN, Address, City, Province, Postal Code, Phone, Email, Website, Principal Name, School Logo, School Stamp, Vision, Mission.
**Business Rules:** changes affect new reports only; historical reports remain unchanged.

### Academic Settings
**Purpose:** configure academic structure.
**Properties:** Academic Year, Semester, Active Semester, Grading Scale, Attendance Threshold, Character Formula, Passing Grade, Default Class Status, Graduation Rules, Jurusan (Majors) [NEW v2.0], Kelas (Classes) [NEW v2.0]. Academic changes require administrator permission.

**Academic Tabs (NEW v2.0):**

**1. Tahun Ajaran** — mengelola tahun ajaran sekolah. Aksi: lihat daftar tahun ajaran, pilih tahun ajaran aktif, tambah tahun ajaran baru (disabled — belum diimplementasi). Catatan: tahun ajaran aktif menentukan data kelas yang ditampilkan.

**2. Sistem Penilaian** — mengatur skala penilaian dan ambang batas kelulusan. Komponen: Skala Penilaian (A-E dengan rentang skor), Batas Kehadiran (minimum persentase kehadiran untuk lulus), Nilai Kelulusan (minimum nilai untuk dinyatakan lulus).

**3. Jurusan (Majors) [NEW v2.0]** — mengelola jurusan/program keahlian di sekolah.

| Field | Tipe | Required | Deskripsi |
|-------|------|----------|-----------|
| Nama Jurusan | Text | ✅ | Nama lengkap jurusan |
| Kode Jurusan | Text | ✅ | Kode singkat unik (contoh: "TKJ", "RPL") |
| Deskripsi | Text | - | Deskripsi opsional |

Aksi: tambah/edit jurusan; hapus jurusan (jika belum digunakan kelas).

Contoh:
| Nama | Kode | Deskripsi |
|------|------|-----------|
| Teknik Komputer dan Jaringan | TKJ | Program keahlian jaringan komputer |
| Rekayasa Perangkat Lunak | RPL | Program keahlian pengembangan software |
| Akuntansi | AKT | Program keahlian akuntansi |

**4. Kelas (Classes) [NEW v2.0]** — mengelola kelas yang terdiri dari jurusan dan tahun ajaran.

| Field | Tipe | Required | Deskripsi |
|-------|------|----------|-----------|
| Nama Kelas | Text | ✅ | Nama kelas (contoh: "TKJ 1") |
| Jurusan | Select | ✅ | Pilih dari daftar jurusan |
| Tahun Ajaran | Select | ✅ | Pilih tahun ajaran aktif |
| Nomor Ruang | Text | - | Nomor ruang kelas (opsional) |

Aksi: tambah/edit kelas; hapus kelas (soft delete jika punya siswa, hard delete jika kosong). Filter: berdasarkan tahun ajaran. Integrasi: kelas yang dibuat di sini muncul di dropdown "Kelas" saat tambah/edit siswa di Buku Induk.

**Business Rules:** kelas terikat pada tahun ajaran tertentu; satu kombinasi jurusan + tahun ajaran bisa memiliki multiple kelas (TKJ 1, TKJ 2); menghapus kelas dengan siswa akan mengubah status menjadi "inactive" (soft delete).

**Catatan Semester:** semester ditangani secara lokal oleh masing-masing modul (absensi, penilaian) — tidak dikelola di Settings Academic.

### User Management
**Purpose:** manage application users.
**Properties:** Name, Username, Email, Role, Status, Last Login, Password Status, Two-Factor Authentication, Assigned Modules.
**Actions:** Create, Edit, Deactivate, Reset Password, Lock/Unlock Account, Archive.

### Roles & Permissions
**Purpose:** define system authorization. Managed by Role, Module, Feature, Action.
**Supported Actions:** View, Create, Update, Delete, Approve, Import, Export, Print, Settings, Audit. Permission changes require confirmation.

### Appearance
**Purpose:** configure user interface.
**Options:** Theme, Accent Color, Density, Sidebar Style, Card Radius, Table Density, Animation Level, Glass Effect, Dashboard Layout. Stored per user; global defaults configurable.

### Notification Settings
Enable Notifications, Reminder Frequency, Announcement Visibility, Default Priority, Notification Retention, Email/Push/WhatsApp (future).

### Reports Settings
Default Paper Size, Orientation, Header, Footer, Watermark, School Logo, Digital Signature, Export Format, Retention Policy.

### Import & Export Settings
Default Import Strategy, Dry Run Required, Maximum File Size, Allowed Formats, Temporary Storage Duration, Export Limits, Import Templates, Rollback Availability.

### Security
Password Policy, Session Timeout, Login Attempts, Account Lockout, IP Restrictions (future), Device Tracking, Two-Factor Authentication, API Keys (future), Encryption Settings.

### Backup & Restore
Automatic Backup, Backup Schedule, Manual Backup, Restore Point, Retention Policy, Cloud Backup (future). Only administrators may restore backups.

### Storage
Used/Available Storage, Maximum Upload Size, Allowed File Types, Temporary Files, Cleanup Schedule.

### Integrations
Email, Google Workspace, Microsoft 365, Cloud Storage, REST API, Webhook, Future AI Services.

### Audit Logs
Tracks: Setting Updated, Role Changed, Permission Changed, User Created, Backup Restored, System Maintenance, Integration Updated. Immutable.

### Maintenance
Clear Cache, Rebuild Index, Optimize Database, Clean Temporary Files, System Diagnostics, Maintenance Mode, Restart Background Jobs. Administrator-only.

### About
Application Version, Database Version, Release Date, License, Build Number, Documentation, Support Contact.

### Search
Searches all configuration items by Keyword, Category, Property Name, Recent Changes.

### Notifications
Notify administrators on: Critical Setting Changed, Backup Failed, Storage Full, Security Issue, Integration Failed, License Expiring (future).

### Permissions
| Role | Access |
|---|---|
| Administrator | Full Access |
| Principal | Read Only |
| Vice Principal | Limited Access |
| Teacher | Profile Only |
| Staff | Profile Only |
| Students (future) | Profile Only |

### Audit Requirements
Every configuration change records: Old/New Value, Changed By, Timestamp, Reason, IP Address, Device.

### Performance Requirements
| Action | Target |
|---|---|
| Configuration Load | < 500 ms |
| Search | < 300 ms |
| Save | < 1 second |

### Accessibility
Keyboard Navigation, Screen Reader Support, High Contrast, Visible Focus, Responsive Layout, WCAG AA.

### Security
Role-based Access, Encrypted Configuration, Audit Logging, Permission Validation, Confirmation for Critical Changes.

### Future Enhancements
AI Configuration, Feature Flags, Plugin Manager, Multi-School Configuration, Multi-Language Configuration, System Health Dashboard, Configuration Profiles, Cloud Synchronization, Environment Management.

### Definition of Done
Complete when: all configurable behavior managed through Settings; no operational data stored in Settings; configuration changes audited; permissions enforced; performance targets met; accessibility standards satisfied; follows the Design System.

### Final Principle
Settings is not a preferences page — it is the centralized configuration engine of Twosraku. Every configurable behavior should be managed through this module while maintaining security, consistency, auditability, and long-term scalability.

### Changelog v2.0 (2026-07-03)
**Perubahan dari v1.0:**
1. Academic Settings diperluas dengan tab baru: Jurusan (Majors) — kelola jurusan/program keahlian; Kelas (Classes) — kelola kelas yang terdiri dari nama + jurusan + tahun ajaran.
2. Integrasi dengan Buku Induk: kelas yang dibuat di Settings Academic muncul di dropdown "Kelas" saat tambah/edit siswa.
3. Database Layer: CRUD operations untuk majors, classes; type definitions untuk Class, Major.

**Catatan:** Tingkat (grade) tidak lagi disimpan di tabel terpisah — informasi tingkat diambil dari nama kelas.

---
Last Updated: 2026-07-05 | Version: 2.1
# End of Settings Module (Compact)
