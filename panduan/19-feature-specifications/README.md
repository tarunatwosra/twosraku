# Feature Specifications — Compact
Version: 1.0

**Purpose:** this directory holds the complete business specifications for every core module of Twosraku. Unlike the Design System, these documents define how each feature should work — business rules, workflows, permissions, validation, and inter-module relationships. This is the primary reference for Claude Code when implementing features.

**Relationship with Other Documents:** documentation hierarchy = Design System (01-design-principles.md through 18-coding-standards.md) → 19-feature-specifications/ (this folder). Design System explains how the app should look and be built; this folder explains how it should behave.

**Scope:** documents business behavior for Dashboard, Student Registry (Buku Induk), Attendance (Presensi), Assessment (Penilaian), Character Points (Poin Karakter). Each doc is the single source of truth for its module.

**Module List:** `19-feature-specifications/` → README.md, dashboard.md, student-registry.md, attendance.md, assessment.md, character-points.md.

**Objectives — every spec should answer:** purpose; who can access it; what business problems it solves; what data it manages; validation rules; inter-module interaction; exceptional situations; UI behavior.

**Standard Structure** (every module doc follows): Purpose, Scope, Users & Roles, Navigation, Business Rules, Entities, Relationships, Workflow, CRUD Operations, Validation Rules, Permissions, UI Pattern, Forms, Tables, Dashboard Integration, Notifications, Import, Export, Audit Log, Error Handling, Loading States, Empty States, Performance Requirements, Accessibility, Edge Cases, Future Enhancements.

**Design Principles:** specs must always align with Design System, Architecture, Development Workflow, Coding Standards. Business rules must never contradict the Design System.

**Module Dependencies:** Dashboard aggregates from Student Registry, Attendance, Assessment, Character Points. Student Registry is the master data source; the other three depend on it.

**Business Hierarchy:** Master Data (Student Registry) → Operational Modules (Attendance, Assessment, Character Points) → Analytics → Dashboard. Master data must always exist before operational data can be created.

**Implementation Order:** Student Registry → Attendance → Assessment → Character Points → Dashboard — minimizes dependency issues during development.

**General Business Rules** — every module must: respect user permissions; validate all required data; prevent duplicate records; maintain audit history; provide clear user feedback; handle loading/empty/error states; support responsive layouts; follow accessibility standards.

**Permission Model:** every module defines access levels for Administrator, Teacher, Staff, Principal, Guest (if applicable), covering Create, Read, Update, Delete, Import, Export, Print, Approval (if required).

**Data Integrity:** business rules should prevent duplicate records, invalid relationships, missing mandatory information, unauthorized modifications, inconsistent academic records.

**Audit Trail:** whenever applicable, record Created/Updated/Deleted By & At. Critical operations should always be traceable.

**Error Philosophy:** errors should explain what happened, why it happened, and how to fix it. Avoid technical language.

**Future Expansion:** this folder is designed to grow. Future modules may include Teachers, Employees, Inventory, School Finance, Student Savings, Counseling, Health Records, School Letters, Scheduling, Library, Alumni, Parent Portal, Mobile Application. Each new module must follow the same documentation structure.

**Claude Code Instructions — when implementing a module:** read this README → read the corresponding module specification → review the Design System → review Architecture → follow Coding Standards → implement according to documented business rules. Never implement a feature based on assumptions; if a business rule is not documented, it should be clarified before implementation.

**Final Principle:** this folder defines how Twosraku works. The Design System defines how Twosraku looks. Architecture defines how Twosraku is built. Together, these documents form the complete blueprint for developing Twosraku in a consistent, maintainable, and scalable manner.

---
# End of Feature Specifications README (Compact)
