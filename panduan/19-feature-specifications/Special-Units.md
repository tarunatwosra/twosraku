# Special Units Module (Pasukan Khusus) — Compact
Version: 1.0

**Purpose:** Special Units is the management module for the Special Force (Pasukan Khusus) of Taruna SMKN 2 Sragen — for internal use only, not for extracurricular organizations like PMR, OSIS, Pramuka, or Paskibra. It manages membership, organizational structure, assignments, administrative records, and historical data of Special Unit members.

**Philosophy:** Special Units represents the school's elite student organization. Membership is selective; every member has responsibilities; every assignment is recorded; every position has accountability; historical records should never be lost.

**Primary Objectives:** manage membership; track organizational positions; manage membership status; record duty assignments, achievements, disciplinary history; provide administrative reports; integrate with Student Registry.

**Scope:** Member Management, Organizational Structure, Position Management, Batch Management, Membership Status, Duty Assignment, Training History, Achievements, Character Summary, Assessment Summary, Attendance Summary, Documents, Reports, Dashboard.

**Core Architecture:** Student Registry → Special Unit Membership → Position → Assignments → Activity History → Reports. Every member must originate from Student Registry.

**Membership Rules:** a student may become a member only after being registered; only one active membership at a time; inactive members remain in historical records; membership history is never deleted.

**Navigation:** Special Units → Dashboard, Members, Positions, Assignments, Training History, Achievements, Documents, Reports, Settings.

### Dashboard
**Purpose:** overview of Special Unit activities.
**Widgets:** Total/Active/Inactive/New Members, Training Schedule, Upcoming Assignments, Recent Activities, Outstanding Members, Quick Actions.
**Quick Actions:** Add Member, Assign Position, Create Assignment, Upload Document, Generate Report, Search Member.

### Members
**Purpose:** maintain the official database of all members.
**Member Profile:** Student, Student Number, Photo, Current Class, Major, Academic Year, Membership Status, Join Date, Leave Date, Current Position, Notes.
**Membership Status:** Candidate, Active, Inactive, Graduated, Transferred, Removed. Historical records remain accessible.

### Position Management
**Purpose:** manage organizational responsibilities — positions define duties, not ranks.
**Examples:** Commander, Vice Commander, Secretary, Treasurer, Training Coordinator, Discipline Coordinator, Logistics Coordinator, Equipment Coordinator, Member. Schools may customize position names.
**Properties:** Position Name, Description, Display Order, Status, Responsibilities.
**Business Rules:** one student may hold one active primary position; temporary assignments allowed; position history must be recorded.

### Assignment Management
**Purpose:** manage operational duties — temporary responsibilities.
**Examples:** Morning Assembly, Flag Ceremony, School Event, Guest Reception, Security Duty, Training Session, Competition Support, Special Ceremony.
**Properties:** Assignment Name, Description, Date, Time, Location, Supervisor, Assigned Members, Status, Notes.
**Status:** Scheduled, In Progress, Completed, Cancelled, Archived.

### Training History
**Purpose:** maintain historical training records. **Record:** Training Name, Instructor, Date, Location, Attendance, Notes, Evaluation, Certificate. Read-only after completion.

### Achievement Management
**Purpose:** record accomplishments of members.
**Types:** Competition, School Recognition, Leadership, Discipline, Community Service, Special Award.
**Properties:** Title, Category, Date, Organizer, Description, Certificate, Evidence. Achievements become part of the permanent member profile.

### Character Integration
Displays: Positive/Negative Points, Recent Character Records, Character Trend. Read-only — updates occur in the Character Points Module.

### Assessment Integration
Displays: Assessment Average, Recent Assessments, Leadership Assessment, Training Assessment. Remains read-only.

### Attendance Integration
Displays: Attendance Percentage, Training Attendance, Assignment Attendance, Recent Absence. Synchronized from the Attendance Module.

### Member Timeline
Chronological history: Joined Special Unit, Position Assigned, Assignment Completed, Training Completed, Achievement Received, Membership Updated, Graduated. Cannot be edited manually.

### Documents
**Purpose:** store administrative documents.
**Supported Documents:** Selection Result, Membership Letter, Assignment Letter, Certificate, Photo, Evaluation Form, Supporting Documents.
**Supported Formats:** PDF, JPG, PNG, DOCX. Maximum upload size configurable.

### Search & Filters
- **Search by:** Student Name, Student Number, Class, Major, Position, Status, Academic Year.
- **Filters:** Academic Year, Class, Major, Position, Membership Status, Training, Assignment, Achievement.

### Reports
Member Directory, Active/Inactive Members, Position List, Assignment Report, Training Report, Achievement Report, Membership Statistics, Annual Summary.

### Import & Export
Import: Excel, CSV — validation required. Export: Excel, CSV, PDF, Print — respects applied filters.

### Dashboard Integration
Shows: Total Members, Today's Assignments, Training Progress, Recent Activities, Outstanding Members, Upcoming Events. Summarized information only.

### Notifications
Member Added, Assignment Created, Training Scheduled, Achievement Recorded, Membership Updated, Document Uploaded.

### Permissions
| Role | Access |
|---|---|
| Administrator | Full Access |
| Coordinator | Manage Members |
| Instructor | Training Records |
| Teacher | View |
| Staff | Limited Access |
| Guest | No Access |

### Audit Log
Tracks: Member Added/Updated, Position Changed, Assignment Created, Document Uploaded, Status Changed. All actions include User, Timestamp, Reason.

### Performance Requirements
Support 2,000+ Members, 100,000+ Assignment Records; fast search; server-side filtering; lazy loading.

### Accessibility
Keyboard Navigation, Screen Reader Support, High Contrast, Visible Focus, Responsive Layout, WCAG AA.

### Security
Role-based Access, Soft Delete, Immutable History, Audit Logging, Permission Validation, Encrypted Communication.

### Future Enhancements
Training Evaluation, Equipment Inventory, Uniform Management, Digital ID Card, QR Member Verification, Attendance via QR, Mobile Companion, Member Skill Matrix, Leadership Development, Event Management.

### Definition of Done
Complete when: membership fully manageable; historical records remain immutable; assignments traceable; reports reproducible; dashboard integration works; permissions enforced; performance targets met; accessibility standards satisfied; follows the Design System.

### Final Principle
Special Units is the official administrative system for the Pasukan Khusus of Taruna SMKN 2 Sragen — not an extracurricular management module. Its purpose is to maintain accurate membership records, organizational responsibilities, operational activities, and historical information while integrating seamlessly with Student Registry and other core modules.

---
# End of Special Units Module (Compact)
