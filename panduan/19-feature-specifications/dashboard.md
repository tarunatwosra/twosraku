# Dashboard Module — Compact
Version: 1.0

**Purpose:** Dashboard is Twosraku's primary landing page — a real-time overview of school activities, student statistics, attendance, assessments, and character development. It owns no data itself; it aggregates information from other modules into a concise, actionable format, letting administrators understand the school's current state within seconds.

**Scope:** read-only analytics module — users cannot create, edit, or delete data here. Responsibilities: display summary statistics; highlight important information; provide quick access to frequent actions; notify users of important events; surface issues requiring attention.

**Supported Users:** Administrator, Vice Principal, Teacher (limited), Staff (limited), Principal. Different roles see different widgets depending on permissions.

**Data Sources:** Student Registry, Attendance, Assessment, Character Points, Authentication, System Settings, Academic Calendar. Dashboard must never store duplicated data.

**Navigation:** Main Navigation → Dashboard (default landing page after login).

**Layout Structure — 5 sections:** Page Header → Quick Statistics → Analytical Widgets → Operational Widgets → Activity Timeline.

### Page Header
Contains: Page Title, Current Academic Year, Current Semester, Date, Global Search, Notification Button, Profile Menu, Quick Actions (Add Student, Record Attendance, Input Assessment, Record Character Point, Generate Report).

### Quick Statistics
- **Purpose:** instant overview of school conditions.
- **Widgets:** Total Students, Male/Female Students, Active Classes, Teachers, Attendance Today, Assessment Completion, Character Violations.
- Each KPI shows: Current Value, Trend, Percentage Change, Mini Sparkline, Last Updated. Clicking a KPI opens the related module.

### Attendance Widget
Displays: Attendance Today, Present, Permission, Sick, Absent, Late. Visualization: Donut Chart, Summary Card. Trend: comparison with yesterday.

### Assessment Widget
Displays: Assessment Completion, Average/Highest/Lowest Score, Subjects Waiting for Assessment. Visualization: Progress Ring, Bar Chart.

### Character Widget
Displays: Positive/Negative Points, Top Positive Students, Students Requiring Attention. Visualization: Stacked Bar Chart, Leaderboard.

### Student Distribution
Displays students by Class, Major, Gender. Visualization: Bar Chart, Donut Chart.

### Recent Activities
Displays: Recently Added Students, Recent Attendance, Latest Assessments, Latest Character Records. Newest first, max 20 items.

### Notifications
Displays unread notifications (e.g. Attendance not submitted, Assessment deadline, Student transferred, System maintenance). Users may mark as read.

### Academic Calendar
Displays: Today's Events, Upcoming Events, Examinations, School Holidays, Important Activities.

### Global Search
Searches: Students, Teachers, Classes, Assessment, Attendance, Character Records. Results grouped by category.

### Quick Actions
- **Purpose:** reduce navigation time.
- **Supported:** Add Student, Take Attendance, Create Assessment, Record Character Point, Generate Report. Only actions permitted by the user's role are shown.

### Refresh Strategy
Auto-refreshes every 5 minutes; users may refresh manually. Only changed widgets should reload — avoid full-page refreshes.

### Business Rules
Dashboard data is read-only; all values originate from source modules; statistics auto-update when source data changes; widgets should not calculate independently when aggregated values are available.

### Permissions
| Role | Access |
|---|---|
| Administrator | Full Dashboard |
| Principal | Full Dashboard |
| Teacher | Attendance, Assessment, Own Classes |
| Staff | Operational widgets only |

Unauthorized widgets must remain hidden.

### Loading / Empty / Error States
- **Loading:** each widget loads independently using skeleton placeholders; one failed widget must not block others.
- **Empty:** show Icon, Title, Description, Recommended Action (e.g. "No attendance has been recorded today.").
- **Error:** show a friendly message + Retry Button; never expose technical errors.

### Performance Requirements
Should load within 2 seconds on a standard school internet connection. Heavy calculations performed server-side; widgets request only the data they need.

### Accessibility
Keyboard Navigation, Visible Focus, Screen Reader Labels, Accessible Charts, Reduced Motion.

### Responsive Behavior
Desktop = multi-column grid; Tablet = reduced columns; Mobile = single column. Widget order stays consistent across devices.

### Dashboard Dependencies
Student Registry → Attendance → Assessment → Character Points → Dashboard. Cannot function without master data.

### Audit
Dashboard itself generates no audit records; audit information belongs to source modules.

### Future Enhancements
Custom Dashboard, Widget Rearrangement, Saved Layouts, Real-Time Updates, AI Insights, Predictive Analytics, Parent Dashboard, Teacher Dashboard, Student Dashboard.

### Definition of Done
Complete when it: displays accurate data; loads quickly; uses reusable widgets; handles loading/empty/error states; respects permissions; provides meaningful insights; supports responsive layouts; follows the Design System.

### Final Principle
Dashboard is not a reporting page — it is a decision-making interface. Every widget should help users identify what requires attention and where to navigate next.

---
# End of Dashboard Module (Compact)
