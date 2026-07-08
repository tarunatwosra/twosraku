# Attendance Module (Presensi) — Compact
Version: 1.0

**Purpose:** Attendance is the operational module for recording, monitoring, and reporting student attendance throughout the academic year. Provides accurate records for every student and is the primary source for attendance reports, dashboard statistics, and discipline monitoring.

**Scope**
- Manages: Daily Attendance, Attendance Recap, Attendance Reports, Attendance History, Attendance Analytics. Attendance only records student presence.
- Not managed here: Behavior, Grades, Discipline (separate modules).

**Primary Objectives:** record attendance accurately; prevent duplicates; provide attendance statistics; support reporting; provide attendance history; integrate with Dashboard and Character Points.

**Supported Users**
| Role | Access |
|---|---|
| Administrator | Full Access |
| Homeroom Teacher | Own Classes |
| Teacher | Own Subjects (optional) |
| Staff | Read Only |
| Principal | Read Only |

**Dependencies:** Student Registry, Academic Calendar, Class, Academic Year, Semester. Attendance cannot exist without an active student.

**Navigation:** Main Navigation → Attendance, with sub-pages: Attendance Input, Attendance Recap, Attendance Report, Attendance History, Attendance Settings.

**Attendance Workflow:** Select Academic Year → Semester → Class → Date → Display Student List → Record Attendance → Save → Generate Statistics.

**Attendance Status**
| Code | Status | Meaning |
|---|---|---|
| H | Present | Student attends normally |
| T | Late | Arrives after allowed time |
| I | Permission | Has official permission |
| S | Sick | Absent due to illness |
| A | Absent | Absent without explanation |

Schools may rename labels per internal policy.

**Business Rules:** one attendance record per student per date (no duplicates); cannot record for future dates; cannot edit after academic period is locked; archived students can't receive attendance; transferred students can't receive attendance after transfer date; graduated students become read-only.

### Attendance Input Page
- **Contains:** Academic Year, Semester, Class, Attendance Date, Student Table, Attendance Status, Notes, Save Button.
- **Student Table columns:** Attendance Status, Student Number, Student Name, Gender, Photo (optional), Notes, Quick Actions. Default sort: class attendance number.
- **Attendance Entry:** default status = Present; users only change students with a different status — minimizes data entry.
- **Bulk Actions:** Mark All Present, Mark Selected Sick/Permission/Absent, Reset Attendance.
- **Notes:** optional, for Late/Permission/special circumstances, max 255 characters.

### Attendance Recap
Displays: Daily, Weekly, Monthly, Semester, Annual Recap.

### Attendance Statistics
Displays: Attendance Percentage, Present/Late/Permission/Sick/Absent Count, Most Frequent Status.
**Formula:** Attendance Percentage = Present Days / Total School Days × 100. Late may optionally count as Present per school policy.

### Student Attendance Summary
Per student: Attendance Percentage, Present, Late, Permission, Sick, Absent, Attendance Trend.

### Reports
Daily/Weekly/Monthly/Semester/Annual Attendance, Student Attendance Report, Class Attendance Report, School Attendance Report.

### Search & Filters
- **Search by:** Student Name, Student Number, Class, Major, Date.
- **Filters:** Academic Year, Semester, Class, Major, Date Range, Attendance Status, Homeroom Teacher. Multiple filters supported.

### Import & Export
- **Import:** Excel, CSV. Validates: Duplicate attendance, Student existence, Class consistency, Attendance date.
- **Export:** Excel, CSV, PDF, Print. Respects active filters.

### Validation Rules
- **Required:** Academic Year, Semester, Class, Attendance Date, Attendance Status, Student.
- **Optional:** Notes.

### Relationships
One Student → Many Attendance Records → Attendance Summary → Dashboard → Reports.

### Permissions
| Role | Access |
|---|---|
| Administrator | Full Access |
| Homeroom Teacher | Own Classes |
| Teacher | Read |
| Staff | Read |
| Principal | Read |

### Dashboard Integration
Displays: Attendance Today, Attendance Trend, Attendance Percentage, Attendance by Class, Attendance Distribution, Students Requiring Attention. Dashboard does not calculate attendance independently.

### Character Point Integration
Excessive absences may trigger Character Point recommendations (e.g. Absent ≥ 3 times within one month → Suggested Character Review). Actual character points remain under manual approval.

### Assessment Integration
Attendance may display alongside assessment summaries. Does not affect grades automatically unless configured by school policy.

### Notifications
Attendance Not Submitted, Attendance Completed, Duplicate Attendance, Attendance Locked, Late Attendance Entry.

### Audit Log
Records: Created/Updated/Locked/Deleted By & At. All modifications must be traceable.

### Loading / Empty / Error States
- **Loading:** Skeleton Table/Statistics/Charts — each widget loads independently.
- **Empty:** No Students/Attendance/Reports/Search Results — provide a recommended next action.
- **Error:** Duplicate Attendance, Student Not Found, Academic Period Locked, Permission Denied, Network Error — clear, non-technical messages.

### Performance Requirements
Support 100,000+ attendance records via server-side pagination/filtering/search, lazy loading, optimized indexing.

### Accessibility
Keyboard Navigation, Visible Focus, Accessible Tables, ARIA Labels, High Contrast, Reduced Motion.

### Responsive Behavior
Desktop = Full Table; Tablet = Horizontal Scroll; Mobile = Card Layout. Attendance actions remain accessible on all devices.

### Security
Records cannot be permanently deleted by standard users (soft delete recommended); every modification logged; role-based permissions mandatory.

### Future Enhancements
QR Code Attendance, RFID Attendance, Face Recognition, GPS Attendance, Teacher Mobile App, Offline Attendance, Automatic Attendance Reminder, Attendance Approval Workflow, Parent Notifications, AI Attendance Analysis.

### Definition of Done
Complete when it: records attendance accurately; prevents duplicates; supports bulk input; provides comprehensive reports; integrates with Dashboard; supports responsive layouts; maintains audit history; follows the Design System.

### Final Principle
Attendance is one of the most frequently used modules in Twosraku. It must prioritize speed, simplicity, and reliability while ensuring every record is accurate, traceable, and immediately available for reporting and analytics.

---
# End of Attendance Module (Compact)
