# Charts Guidelines
Version: 1.0

---

# Purpose

Charts transform raw school data into meaningful insights.

The purpose of charts is **not decoration**.

Every chart must answer a question, reveal a trend, or support decision making.

If a chart does not provide additional value over a table, use a table instead.

---

# Design Philosophy

Charts should feel:

- Calm
- Minimal
- Professional
- Readable
- Data-first

Inspired by:

- Stripe Dashboard
- Linear
- Vercel Analytics
- GitHub Insights

Avoid:

- Bright colors
- 3D charts
- Heavy gradients
- Complex animations
- Decorative effects

---

# General Principles

Every chart should answer one question.

Examples

✔ Attendance trend

✔ Grade distribution

✔ Student growth

✔ Teacher attendance

✔ Assessment completion

Never combine unrelated information in one chart.

---

# When to Use Charts

Use charts when users need to:

- Compare
- Analyze trends
- Find patterns
- Monitor progress
- Identify anomalies

Do NOT use charts simply to fill empty space.

---

# When NOT to Use Charts

Do not use charts for:

- Student lists
- Teacher lists
- Attendance records
- Detailed reports
- Large datasets

Use tables instead.

---

# Chart Container

Background

White

Radius

28px

Padding

28px

Shadow

Soft

Title

Top Left

Actions

Top Right

---

# Chart Header

Contains

Title

Description

Optional Actions

Examples

Download

Refresh

Change Period

Fullscreen

---

# Chart Footer

Optional

Can contain

Last Updated

Data Source

Summary

Trend Description

---

# Color Palette

Maximum

5 colors

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

Avoid rainbow colors.

---

# Grid Lines

Very light

Thin

Do not dominate the chart.

---

# Axes

Always visible.

Labels

Readable

Short

Never rotate text unless unavoidable.

---

# Legend

Place

Top Right

or

Bottom

Avoid left alignment.

Keep legends short.

---

# Tooltips

Show

Label

Value

Optional Comparison

Rounded

Soft Shadow

---

# Data Labels

Show only when useful.

Avoid clutter.

---

# Empty State

Every chart supports:

No Data

Loading

Error

Permission Denied

---

# Loading State

Use skeleton charts.

Avoid spinning loaders.

---

# Time Range Selector

Recommended

Today

7 Days

30 Days

Semester

Academic Year

Custom Range

---

# Responsive

Desktop

Full chart

Tablet

Reduce spacing

Mobile

Scrollable if necessary

Never shrink labels until unreadable.

---

# Animation

Animate once.

Duration

300ms

No looping.

No bounce.

No flashy effects.

---

# Chart Types

---

# Line Chart

Purpose

Show trends over time.

Examples

Attendance Rate

Student Growth

Grade Average

Teacher Attendance

Use for

Time Series

Never use for rankings.

---

# Bar Chart

Purpose

Compare categories.

Examples

Students by Grade

Students by Major

Attendance by Class

Teacher Workload

Assessment Completion

Best choice for comparisons.

---

# Horizontal Bar Chart

Use when

Category labels are long.

Examples

Class Names

Department Names

Teacher Names

---

# Stacked Bar Chart

Purpose

Show composition.

Examples

Attendance Status

Present

Late

Sick

Permission

Absent

Maximum

4 stacks.

---

# Pie Chart

Use sparingly.

Only when

Showing composition.

Examples

Male vs Female

Student Religion

Student Status

Maximum

6 categories.

Avoid pie charts for comparisons.

---

# Donut Chart

Preferred over Pie Chart.

Cleaner appearance.

Display total in center.

---

# Area Chart

Use for

Long-term trends.

Examples

Monthly Attendance

Enrollment Growth

Use subtle fill.

---

# Progress Ring

Purpose

Single KPI.

Examples

Assessment Completion

Graduation Progress

Attendance Target

Never use multiple progress rings together.

---

# Sparkline

Small trend visualization.

Use inside KPI cards.

Maximum

30 data points.

---

# Heatmap

Purpose

Detect patterns.

Examples

Attendance by Day

Attendance by Month

Assessment Completion Calendar

Use soft colors.

---

# Calendar Heatmap

Examples

Attendance

Homework Submission

Teacher Presence

Inspired by GitHub Contribution Graph.

---

# KPI Card Charts

Each KPI may contain:

Mini Sparkline

Trend Arrow

Percentage

Keep subtle.

---

# Dashboard Recommendations

Top Section

KPI Cards

Middle Left

Attendance Trend

Middle Right

Schedule

Bottom Left

Student Distribution

Bottom Right

Activity Timeline

---

# School Recommended Charts

Attendance Trend

Line

Students by Major

Bar

Students by Class

Bar

Attendance Status

Stacked Bar

Grade Distribution

Bar

Teacher Attendance

Line

Student Growth

Area

Academic Calendar

Calendar

Assessment Completion

Progress Ring

Gender Distribution

Donut

Student Religion

Donut

Recent Activities

Timeline

---

# Interaction

Hover

Highlight series

Tooltip appears

Legend Click

Enable or disable series

Zoom

Not required

Pan

Not required

---

# Export

Support

PNG

PDF

Excel

CSV

Respect active filters.

---

# Accessibility

Minimum contrast

WCAG AA

Do not rely on color only.

Every chart should include:

Title

Description

Tooltip

Accessible labels

---

# Performance

Lazy-load charts below the fold.

Large datasets

Aggregate server-side.

Maximum recommended points

Line Chart

365

Bar Chart

100

Pie Chart

6

Heatmap

365

Sparkline

30

---

# Do

✓ Keep charts simple

✓ Use consistent colors

✓ Add clear titles

✓ Explain trends

✓ Prioritize readability

✓ Use whitespace

---

# Don't

✗ Use 3D charts

✗ Use exploding pie charts

✗ Use rainbow colors

✗ Over-animate

✗ Display every data label

✗ Use charts as decoration

---

# Success Criteria

Every chart should answer a question in less than five seconds.

Users should immediately understand:

- What they are looking at.
- Why it matters.
- Whether action is required.

Charts should support decision-making, not simply display data.