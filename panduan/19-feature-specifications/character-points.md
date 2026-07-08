# Character Points Module (Poin Karakter) — Compact
Version: 2.0

**Purpose:** Character Points is a character development engine recording, evaluating, and monitoring student behavior throughout their educational journey. Unlike traditional disciplinary systems, it recognizes both positive and negative behaviors — the goal is continuous character growth, not merely punishing misconduct.

**Philosophy:** character is built through consistency. Every recorded behavior contributes to a student's character profile. Positive behavior receives recognition; negative behavior triggers guidance and improvement. Records should support education rather than punishment.

**Primary Objectives:** promote positive behavior; monitor disciplinary issues; provide transparent character history; support counseling; provide data for reports and dashboard; integrate with Student Registry.

**Scope:** Character Categories, Behavior Types, Character Records, Reward Records, Violation Records, Counseling Records, Character Statistics, Reports, Analytics, Dashboard Integration.

**Core Architecture:** Character Category → Behavior Type → Character Event → Student → Character Record → Character Summary.

### Core Concepts
- **Character Category** — groups similar behaviors (Discipline, Responsibility, Leadership, Courtesy, Integrity, Teamwork, Attendance, Appearance, Safety, Religious Activities). Schools may add categories.
- **Behavior Type** — defines a measurable behavior (Helping Friends, Excellent Leadership, Outstanding Discipline, Late Arrival, Incomplete Uniform, Bullying, Fighting, Smoking, Cheating). Belongs to one category.
- **Character Event** — predefined event providing context (Morning Inspection, Flag Ceremony, School Competition, Community Service, Counseling Session, Dormitory Inspection, Leadership Camp).
- **Character Record** — one recorded behavior; belongs to one Student, one Behavior Type, one Event, one Date, one Reporter.

### Positive & Negative Points
Every behavior type defines a Point Value and Direction (Positive/Negative). Examples: Helping Friends +10, Winning Competition +50, Excellent Attendance +20, Late Arrival -5, Incomplete Uniform -10, Smoking -100. Schools determine their own point values.

**Business Rules:** every record must reference an existing student; point values determined by Behavior Type; users may not manually modify point values during recording; character history must remain immutable; historical records cannot be deleted.

**Character Lifecycle:** Behavior Occurs → Record Created → Reviewed → Approved → Included in Summary → Archived.

**Navigation:** Character Points → Dashboard, Records, Categories, Behavior Types, Events, Reports, Settings.

### Character Dashboard
Displays: Positive/Negative Points, Today's Records, Students Requiring Attention, Top Positive Students, Recent Activities, Pending Reviews, Quick Actions.

### Categories
Properties: Name, Description, Color, Icon, Status, Display Order.

### Behavior Types
Properties: Category, Name, Description, Point Value, Positive/Negative, Severity, Requires Approval, Requires Counseling, Status.
**Severity Levels:** Information, Minor, Moderate, Major, Critical — determines notification priority.

### Character Events
Properties: Name, Description, Date, Location, Organizer, Academic Year, Semester, Status. Events may be reused.

### Character Record
Properties: Student, Behavior Type, Event, Date, Reporter, Description, Evidence, Status, Remarks.
**Evidence (optional):** Photo, PDF, Video (future) — strengthens transparency.
**Record Status:** Draft → Submitted → Reviewed → Approved → Archived.

### Character Summary
Each student automatically has: Positive/Negative Points, Net Score, Total/Positive/Negative Records, Highest Achievement, Most Frequent Violation, Recent Activities, Character Trend.
**Formula:** Net Score = Positive Points − Negative Points. Schools may define custom formulas.

### Counseling Integration
Certain behaviors auto-recommend counseling (e.g. Negative Points ≥ 100 → Counseling Recommendation). Counseling remains a separate workflow.

### Reward Integration
Positive achievements may trigger Certificates, Awards, Recognition, Leaderboards. Reward criteria configurable.

### Search & Filters
- **Search by:** Student, Behavior, Category, Reporter, Event, Academic Year, Semester.
- **Filters:** Academic Year, Semester, Class, Major, Category, Behavior Type, Severity, Reporter, Date Range, Status.

### Reports
Student Character Report, Class Summary, Behavior Summary, Category Summary, Positive/Negative Leaderboard, Counseling Recommendation, Trend Analysis.

### Import & Export
Import: Excel, CSV — validation required. Export: Excel, CSV, PDF, Print — respects filters.

### Dashboard Integration
Displays: Positive/Negative Points, Students Requiring Guidance, Outstanding Students, Recent Character Activities, Trend Analysis. Dashboard performs no calculations.

### Student Registry Integration
Character Records reference Student ID. Deleting a student never deletes historical character records.

### Attendance Integration
Schools may configure: Repeated Absence → Automatic Character Recommendation (requires manual approval).

### Assessment Integration
Character summaries may appear alongside assessment reports. Character Points never modify academic scores automatically.

### Notifications
New Record, Review Required, Approval Required, Critical Violation, Outstanding Achievement, Counseling Recommendation.

### Permissions
| Role | Access |
|---|---|
| Administrator | Full Access |
| Vice Principal | Full Access |
| Counselor | Review |
| Teacher | Create Records |
| Homeroom Teacher | View Own Students |
| Staff | Read |
| Students | No Access |

### Audit Log
Tracks: Created, Updated, Approved, Archived, Reporter, Reviewer, Timestamp, Reason. Historical records are immutable.

### Performance Requirements
Support 10 million character records; server-side search & filtering; optimized reports; lazy loading.

### Accessibility
Keyboard Navigation, Screen Reader Support, High Contrast, Visible Focus, Responsive Layout, WCAG AA.

### Security
Role-based Access, Soft Delete, Immutable Audit Trail, Encrypted Communication, Permission Validation.

### Future Enhancements
AI Behavior Analysis, Behavior Prediction, Parent Notifications, Mobile Reporting, QR Event Recording, Teacher Mobile App, Badge System, Achievement Levels, Behavior Timeline, Student Portfolio, Gamification, House Point System, Dormitory Management.

### Definition of Done
Complete when: positive and negative behaviors supported; character history traceable; reports reproducible; permissions enforced; dashboard integration works; performance targets achieved; accessibility standards satisfied; follows the Design System.

### Final Principle
Character Points is not a punishment system — it is a student character development platform. Every recorded behavior should help teachers understand, guide, and develop students into individuals with strong discipline, responsibility, leadership, and integrity.

---
# End of Character Points Module (Compact)
