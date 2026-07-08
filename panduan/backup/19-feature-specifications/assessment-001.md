# Assessment Module (Penilaian)
Version: 3.1

## Part 1 — Purpose & Architecture

**Purpose:** Assessment is Twosraku's central evaluation engine — a configurable engine supporting multiple evaluation models without architectural changes. Supports: Academic, Character, Discipline, Military Training, Practical, Competition, and Custom Assessment.

**Implementation Status:** ✅ FULLY IMPLEMENTED (v3.1)
- **Database:** Supabase (PostgreSQL)
- **API Routes:** `/app/api/assessment/` (Next.js App Router)
- **Hooks:** `useAssessment.ts`, `useAssessmentSession()`
- **UI Pages:** Dashboard, Kategori, Template, Session, Input Nilai

**Core Concepts:**
- **Category** — highest-level grouping (Disiplin, Leadership, Keterampilan)
- **Template** — reusable blueprint: structure, items, scoring config, weighting
- **Assessment Item** — smallest measurable component
- **Assessment Session** — real implementation of a template
- **Student Score** — actual results

**Entity Relationship:** Category (1→∞) Template (1→∞) Item (1→∞) Session (1→∞) Participant (1→∞) Score

**Session Status:**
| Status | Meaning |
|--------|---------|
| draft | Assessment structure being prepared |
| open | Assessment is active |
| in_progress | Scores being entered |
| completed | All scores submitted |
| reviewed | Scores verified |
| locked | No further edits allowed |
| archived | Historical reference only |

---

## Part 2 — Database Schema (Supabase)

### Table: assessment_categories

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | varchar | Category name (unique) |
| description | text | Optional description |
| icon | varchar | Icon name |
| color | varchar | Hex color code |
| display_order | int | Sort order |
| status | varchar | active, inactive |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

### Table: assessment_templates

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| category_id | uuid | FK to assessment_categories |
| name | varchar | Template name |
| description | text | Optional description |
| scoring_method | varchar | weighted_average, simple_average, highest, lowest |
| passing_score | numeric | Minimum passing score |
| max_score | numeric | Maximum possible score |
| min_score | numeric | Minimum possible score |
| allow_decimal | boolean | Allow decimal values |
| auto_calculate | boolean | Auto-calculate results |
| display_order | int | Sort order |
| status | varchar | draft, active, inactive, archived |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |
| created_by | uuid | User who created |
| updated_by | uuid | User who last updated |

### Table: assessment_items

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| template_id | uuid | FK to assessment_templates |
| name | varchar | Item name |
| description | text | Optional description |
| score_type | varchar | numeric, percentage, boolean, rating |
| weight | numeric | Weight percentage (0-100) |
| min_score | numeric | Minimum score |
| max_score | numeric | Maximum score |
| passing_score | numeric | Passing score |
| is_required | boolean | Is this item required |
| display_order | int | Sort order |
| status | varchar | active, inactive |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

### Table: assessment_sessions

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| template_id | uuid | FK to assessment_templates |
| name | varchar | Session name |
| academic_year_id | uuid | FK to academic_years |
| semester_id | uuid | FK to semesters |
| class_id | uuid | Optional FK to classes |
| evaluator_id | uuid | User who evaluates |
| start_date | date | Session start date |
| end_date | date | Session end date |
| status | varchar | draft, open, in_progress, completed, reviewed, locked, archived |
| is_locked | boolean | Session is locked |
| locked_by | uuid | User who locked |
| locked_at | timestamptz | Lock timestamp |
| notes | text | Additional notes |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

### Table: assessment_participants

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| session_id | uuid | FK to assessment_sessions |
| student_id | uuid | FK to students |
| status | varchar | assigned, present, absent, completed, excluded, withdrawn |
| assigned_at | timestamptz | Assignment timestamp |
| assigned_by | uuid | User who assigned |
| notes | text | Additional notes |

**Unique Constraint:** (session_id, student_id)

### Table: student_scores

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| participant_id | uuid | FK to assessment_participants |
| item_id | uuid | FK to assessment_items |
| session_id | uuid | FK to assessment_sessions |
| student_id | uuid | FK to students |
| raw_score | numeric | Original score |
| final_score | numeric | Calculated final score |
| grade | varchar | Letter grade |
| remark | text | Additional remarks |
| evidence | text | URL to evidence file |
| evaluator_id | uuid | User who scored |
| scored_at | timestamptz | Scoring timestamp |
| updated_at | timestamptz | Last update timestamp |
| status | varchar | draft, saved, reviewed, approved, locked |

**Unique Constraint:** (participant_id, item_id)

---

## Part 3 — API Routes

```
/api/assessment/
├── categories/
│   ├── GET    /api/assessment/categories
│   ├── POST   /api/assessment/categories
│   ├── GET    /api/assessment/categories/[id]
│   ├── PUT    /api/assessment/categories/[id]
│   └── DELETE /api/assessment/categories/[id]
├── templates/
│   ├── GET    /api/assessment/templates
│   ├── POST   /api/assessment/templates
│   ├── GET    /api/assessment/templates/[id]
│   ├── PUT    /api/assessment/templates/[id]
│   └── DELETE /api/assessment/templates/[id]
├── items/
│   ├── GET    /api/assessment/items?templateId=x
│   ├── POST   /api/assessment/items
│   ├── GET    /api/assessment/items/[id]
│   ├── PUT    /api/assessment/items/[id]
│   └── DELETE /api/assessment/items/[id]
├── sessions/
│   ├── GET    /api/assessment/sessions
│   ├── POST   /api/assessment/sessions
│   ├── GET    /api/assessment/sessions/[id]
│   ├── PUT    /api/assessment/sessions/[id]
│   ├── PATCH  /api/assessment/sessions/[id] (lock/unlock)
│   └── DELETE /api/assessment/sessions/[id]
├── participants/
│   ├── GET    /api/assessment/participants?sessionId=x
│   ├── POST   /api/assessment/participants
│   ├── GET    /api/assessment/participants/[id]
│   ├── PUT    /api/assessment/participants/[id]
│   └── DELETE /api/assessment/participants/[id]
└── scores/
    ├── GET    /api/assessment/scores?sessionId=x
    ├── POST   /api/assessment/scores
    ├── GET    /api/assessment/scores/[id]
    ├── PUT    /api/assessment/scores/[id]
    └── DELETE /api/assessment/scores/[id]
```

---

## Part 4 — Hooks (useAssessment.ts)

### useAssessment()

```typescript
const {
  // Data
  categories, templates, items, sessions,

  // State
  loading, error, statistics,

  // Getters
  getTemplatesByCategory,
  getItemsByTemplate,
  getSessionsByTemplate,
  getSessionsByStatus,

  // CRUD Categories
  createCategory, updateCategory, deleteCategory,

  // CRUD Templates
  createTemplate, updateTemplate, deleteTemplate,

  // CRUD Sessions
  createSession, updateSession,
  lockSession, unlockSession, deleteSession,

  // CRUD Items
  createItem, updateItem, deleteItem,

  // Calculations
  calculateGrade, calculateAverage,

  // Refresh
  refresh,
} = useAssessment()
```

### useAssessmentSession(sessionId)

```typescript
const {
  // Data
  session, template, category,
  items, participants, scores,

  // State
  loading, error,

  // Actions
  addParticipants, removeParticipant, saveScores, refresh,

  // Getters
  getScore, getParticipantAverage,
  calculateGrade, calculateAverage,
} = useAssessmentSession("session-id")
```

---

## Part 5 — UI Pages

### Navigation Structure

```
Penilaian (Assessment)
├── Dashboard        (/penilaian)
├── Kategori         (/penilaian/kategori)
├── Template        (/penilaian/template)
├── Sesi            (/penilaian/session)
└── Input Nilai    (/penilaian/input?session=xxx)
```

### Page: Kategori (/penilaian/kategori)
- Grid view with cards
- Create/Edit/Delete categories
- Icon and color selection
- Search functionality

### Page: Template (/penilaian/template)
- Grid view with template cards
- Create/Edit/Delete templates
- Inline CRUD for Items
- Filter by category/status
- Show items with weights

### Page: Session (/penilaian/session)
- Table view with all sessions
- Create/Edit/Delete sessions
- Lock/Unlock session
- Filter by status/template
- Quick action: Input Nilai

### Page: Input Nilai (/penilaian/input?session=xxx)
- Spreadsheet-style score entry
- Auto-calculate averages
- Auto-grade conversion
- Save to database
- Locked session protection

---

## Part 6 — Default Grading Scale

```typescript
const DEFAULT_GRADING_SCALE = [
  { grade: "A", minScore: 90, maxScore: 100, description: "Sangat Baik", color: "#22C55E", isPassing: true },
  { grade: "B", minScore: 80, maxScore: 89, description: "Baik", color: "#3B82F6", isPassing: true },
  { grade: "C", minScore: 70, maxScore: 79, description: "Cukup", color: "#F59E0B", isPassing: true },
  { grade: "D", minScore: 60, maxScore: 69, description: "Kurang", color: "#F97316", isPassing: true },
  { grade: "E", minScore: 0, maxScore: 59, description: "Sangat Kurang", color: "#EF4444", isPassing: false },
]
```

---

## Part 7 — File Structure

```
app/
├── penilaian/
│   ├── page.tsx              ← Dashboard
│   ├── kategori/page.tsx     ← CRUD Kategori
│   ├── template/page.tsx     ← CRUD Template + Items
│   ├── session/page.tsx      ← CRUD Session
│   └── input/page.tsx       ← Input Nilai
└── api/assessment/
    ├── categories/route.ts, [id]/route.ts
    ├── templates/route.ts, [id]/route.ts
    ├── items/route.ts, [id]/route.ts
    ├── sessions/route.ts, [id]/route.ts
    ├── participants/route.ts, [id]/route.ts
    └── scores/route.ts, [id]/route.ts

hooks/
└── useAssessment.ts

types/
└── assessment.ts
```

---

## Part 8 — Validation Summary

| Entity | Validation |
|--------|------------|
| Category | Unique Name |
| Template | Category Required, Unique Name, Status Required |
| Item | Template Required, Valid Score Type, Weight Validation |
| Session | Template Required, Academic Year Required, Semester Required |
| Participant | Student & Session Required, No Duplicate |
| Score | Participant & Item Required, No Duplicate, Score in Range |

---

## Part 9 — Business Rules

1. Categories before Templates
2. Templates before Sessions
3. Sessions before Participants
4. Participants before Scores
5. Scores cannot exist without a Participant
6. Locked sessions cannot receive new scores
7. Templates never store student data
8. Historical sessions cannot be modified after locking

---

## Part 10 — Security Rules

- Locked sessions (`is_locked = true`) cannot be edited
- Scores can only be saved to open/in_progress sessions
- Deleting category requires no existing templates
- Deleting template requires no existing sessions
- Deleting item requires no existing scores

---

**Last Updated:** 2026-07-07
**Version:** 3.1 - Fully Implemented

---
# End of Assessment Module
