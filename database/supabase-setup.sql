-- ===========================================
-- TWOSRAKU - Supabase Database Setup
-- ===========================================
-- Versi: 1.0
-- Tanggal: 2026-07-01
--
-- CARA MENJALANKAN:
-- 1. Buka Supabase Dashboard
-- 2. SQL Editor → New Query
-- 3. Paste seluruh script ini
-- 4. Run (F5 atau klik Run)
-- ===========================================

-- ===========================================
-- ENABLE UUID EXTENSION
-- ===========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- TAHAP 1: CORE TABLES
-- ===========================================

-- 1.1 Academic Years
CREATE TABLE IF NOT EXISTS academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_academic_years_is_active ON academic_years(is_active);

-- 1.2 Semesters
CREATE TABLE IF NOT EXISTS semesters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(20) NOT NULL,
    semester_number INTEGER NOT NULL CHECK (semester_number BETWEEN 1 AND 2),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_semesters_academic_year ON semesters(academic_year_id);
CREATE INDEX idx_semesters_is_active ON semesters(is_active);

-- 1.3 Majors (Jurusan)
CREATE TABLE IF NOT EXISTS majors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.4 Grades (Tingkat)
CREATE TABLE IF NOT EXISTS grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(20) NOT NULL,
    level INTEGER NOT NULL UNIQUE,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.5 Classes (Kelas)
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    grade_id UUID REFERENCES grades(id) ON DELETE RESTRICT NOT NULL,
    major_id UUID REFERENCES majors(id) ON DELETE RESTRICT NOT NULL,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE NOT NULL,
    room_number VARCHAR(10),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_classes_academic_year ON classes(academic_year_id);
CREATE INDEX idx_classes_grade_major ON classes(grade_id, major_id);

-- 1.6 Students
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_number VARCHAR(20) NOT NULL UNIQUE,
    national_id VARCHAR(20) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    gender VARCHAR(10) NOT NULL,
    birth_place VARCHAR(100),
    birth_date DATE,
    religion VARCHAR(50),
    nationality VARCHAR(50) DEFAULT 'Indonesia',
    blood_type VARCHAR(5),
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    photo_url TEXT,
    status VARCHAR(20) DEFAULT 'prospective',
    enrollment_year INTEGER,
    graduation_year INTEGER,
    transfer_date DATE,
    transfer_reason TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_students_number ON students(student_number);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_name ON students(full_name);

-- 1.7 Student Classes (Relasi)
CREATE TABLE IF NOT EXISTS student_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE NOT NULL,
    attendance_number INTEGER,
    is_homeroom BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, class_id, academic_year_id)
);

CREATE INDEX idx_student_classes_student ON student_classes(student_id);
CREATE INDEX idx_student_classes_class ON student_classes(class_id);

-- 1.8 Parents
CREATE TABLE IF NOT EXISTS parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(20) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    nik VARCHAR(20),
    birth_date DATE,
    occupation VARCHAR(100),
    education VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_parents_student ON parents(student_id);

-- ===========================================
-- TAHAP 2: USERS & AUTHENTICATION
-- ===========================================

-- 2.1 Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    gender VARCHAR(10),
    birth_date DATE,
    phone VARCHAR(20),
    photo_url TEXT,
    employee_number VARCHAR(20) UNIQUE,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    last_login TIMESTAMPTZ,
    password_changed_at TIMESTAMPTZ,
    password_expires_at TIMESTAMPTZ,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_role ON users(role);

-- 2.2 Roles
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, display_name, description, is_system) VALUES
    ('administrator', 'Administrator', 'Full system access', TRUE),
    ('principal', 'Principal', 'School principal', TRUE),
    ('vice_principal', 'Vice Principal', 'Vice principal', TRUE),
    ('teacher', 'Teacher', 'Teacher', TRUE),
    ('homeroom_teacher', 'Homeroom Teacher', 'Class teacher', TRUE),
    ('counselor', 'Counselor', 'Student counselor', TRUE),
    ('staff', 'Staff', 'School staff', TRUE),
    ('guest', 'Guest', 'Guest user', TRUE)
ON CONFLICT (name) DO NOTHING;

-- 2.3 Permissions
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(module, action)
);

-- 2.4 Role Permissions
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE NOT NULL,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- 2.5 User Sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL UNIQUE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    device VARCHAR(100),
    browser VARCHAR(100),
    os VARCHAR(100),
    ip_address VARCHAR(50),
    location VARCHAR(255),
    login_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_current BOOLEAN DEFAULT FALSE,
    revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);

-- 2.6 Login History
CREATE TABLE IF NOT EXISTS login_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    ip_address VARCHAR(50),
    device VARCHAR(100),
    browser VARCHAR(100),
    os VARCHAR(100),
    status VARCHAR(20) NOT NULL,
    failure_reason VARCHAR(255),
    login_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_login_history_user ON login_history(user_id);
CREATE INDEX idx_login_history_date ON login_history(login_at);

-- ===========================================
-- TAHAP 3: ATTENDANCE
-- ===========================================

CREATE TABLE IF NOT EXISTS attendances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE RESTRICT NOT NULL,
    class_id UUID REFERENCES classes(id) ON DELETE RESTRICT NOT NULL,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE RESTRICT NOT NULL,
    semester_id UUID REFERENCES semesters(id) ON DELETE RESTRICT NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    notes VARCHAR(255),
    recorded_by UUID REFERENCES users(id),
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, date)
);

CREATE INDEX idx_attendances_date ON attendances(date);
CREATE INDEX idx_attendances_student ON attendances(student_id);
CREATE INDEX idx_attendances_class ON attendances(class_id);

-- ===========================================
-- TAHAP 4: ASSESSMENT
-- ===========================================

-- 4.1 Assessment Categories
CREATE TABLE IF NOT EXISTS assessment_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    display_order INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- 4.2 Assessment Templates
CREATE TABLE IF NOT EXISTS assessment_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES assessment_categories(id) ON DELETE RESTRICT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    scoring_method VARCHAR(50) DEFAULT 'weighted_average',
    max_score DECIMAL(5,2) DEFAULT 100,
    min_score DECIMAL(5,2) DEFAULT 0,
    passing_score DECIMAL(5,2) DEFAULT 0,
    allow_decimal BOOLEAN DEFAULT TRUE,
    auto_calculate BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- 4.3 Assessment Items
CREATE TABLE IF NOT EXISTS assessment_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES assessment_templates(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    score_type VARCHAR(50) DEFAULT 'numeric',
    weight DECIMAL(5,2) DEFAULT 0,
    min_score DECIMAL(5,2) DEFAULT 0,
    max_score DECIMAL(5,2) DEFAULT 100,
    passing_score DECIMAL(5,2) DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    is_required BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- 4.4 Assessment Sessions
CREATE TABLE IF NOT EXISTS assessment_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES assessment_templates(id) ON DELETE RESTRICT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE RESTRICT NOT NULL,
    semester_id UUID REFERENCES semesters(id) ON DELETE RESTRICT NOT NULL,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    evaluator_id UUID REFERENCES users(id),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'draft',
    is_locked BOOLEAN DEFAULT FALSE,
    locked_by UUID REFERENCES users(id),
    locked_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_sessions_template ON assessment_sessions(template_id);
CREATE INDEX idx_sessions_academic_year ON assessment_sessions(academic_year_id);
CREATE INDEX idx_sessions_status ON assessment_sessions(status);

-- 4.5 Assessment Participants
CREATE TABLE IF NOT EXISTS assessment_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(20) DEFAULT 'assigned',
    notes TEXT,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, student_id)
);

-- 4.6 Student Scores
CREATE TABLE IF NOT EXISTS student_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID REFERENCES assessment_participants(id) ON DELETE CASCADE NOT NULL,
    item_id UUID REFERENCES assessment_items(id) ON DELETE CASCADE NOT NULL,
    raw_score DECIMAL(10,2),
    final_score DECIMAL(10,2),
    grade VARCHAR(5),
    remark TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    evaluator_id UUID REFERENCES users(id),
    scored_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(participant_id, item_id)
);

CREATE INDEX idx_scores_participant ON student_scores(participant_id);
CREATE INDEX idx_scores_item ON student_scores(item_id);

-- 4.7 Score History
CREATE TABLE IF NOT EXISTS score_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    score_id UUID REFERENCES student_scores(id) ON DELETE CASCADE NOT NULL,
    previous_value DECIMAL(10,2),
    new_value DECIMAL(10,2),
    reason TEXT,
    changed_by UUID REFERENCES users(id) NOT NULL,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.8 Grade Conversions
CREATE TABLE IF NOT EXISTS grade_conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES assessment_templates(id) ON DELETE CASCADE NOT NULL,
    min_score DECIMAL(5,2) NOT NULL,
    max_score DECIMAL(5,2) NOT NULL,
    grade VARCHAR(5) NOT NULL,
    description VARCHAR(100),
    color VARCHAR(20),
    is_passing BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TAHAP 5: CHARACTER POINTS
-- ===========================================

-- 5.1 Character Categories
CREATE TABLE IF NOT EXISTS character_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(20),
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5.2 Behavior Types
CREATE TABLE IF NOT EXISTS behavior_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES character_categories(id) ON DELETE RESTRICT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    point_value INTEGER NOT NULL,
    is_positive BOOLEAN NOT NULL,
    severity VARCHAR(20),
    requires_approval BOOLEAN DEFAULT FALSE,
    requires_counseling BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5.3 Character Events
CREATE TABLE IF NOT EXISTS character_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    location VARCHAR(255),
    organizer VARCHAR(255),
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE SET NULL,
    semester_id UUID REFERENCES semesters(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'scheduled',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5.4 Character Records
CREATE TABLE IF NOT EXISTS character_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE RESTRICT NOT NULL,
    behavior_type_id UUID REFERENCES behavior_types(id) ON DELETE RESTRICT NOT NULL,
    event_id UUID REFERENCES character_events(id) ON DELETE SET NULL,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE SET NULL,
    semester_id UUID REFERENCES semesters(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    description TEXT,
    evidence_url TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    reporter_id UUID REFERENCES users(id) NOT NULL,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMPTZ,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_character_records_student ON character_records(student_id);
CREATE INDEX idx_character_records_date ON character_records(date);

-- 5.5 Character Summary
CREATE TABLE IF NOT EXISTS character_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL UNIQUE,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
    positive_points INTEGER DEFAULT 0,
    negative_points INTEGER DEFAULT 0,
    net_score INTEGER DEFAULT 0,
    total_records INTEGER DEFAULT 0,
    positive_records INTEGER DEFAULT 0,
    negative_records INTEGER DEFAULT 0,
    highest_achievement VARCHAR(255),
    most_frequent_violation VARCHAR(255),
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_character_summary_student ON character_summary(student_id);

-- 5.6 Counseling Recommendations
CREATE TABLE IF NOT EXISTS counseling_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE RESTRICT NOT NULL,
    character_record_id UUID REFERENCES character_records(id) ON DELETE SET NULL,
    recommendation_reason TEXT NOT NULL,
    recommended_by UUID REFERENCES users(id) NOT NULL,
    recommended_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending',
    scheduled_date DATE,
    counselor_id UUID REFERENCES users(id),
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TAHAP 6: SPECIAL UNITS
-- ===========================================

-- 6.1 Special Units
CREATE TABLE IF NOT EXISTS special_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6.2 Special Unit Positions
CREATE TABLE IF NOT EXISTS special_unit_positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID REFERENCES special_units(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    responsibilities TEXT,
    display_order INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6.3 Special Unit Members
CREATE TABLE IF NOT EXISTS special_unit_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID REFERENCES special_units(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    position_id UUID REFERENCES special_unit_positions(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'candidate',
    join_date DATE NOT NULL,
    leave_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_special_unit_members_student ON special_unit_members(student_id);

-- 6.4 Special Unit Assignments
CREATE TABLE IF NOT EXISTS special_unit_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID REFERENCES special_units(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    assignment_date DATE NOT NULL,
    time TIME,
    location VARCHAR(255),
    supervisor_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6.5 Special Unit Assignment Members
CREATE TABLE IF NOT EXISTS special_unit_assignment_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES special_unit_assignments(id) ON DELETE CASCADE NOT NULL,
    member_id UUID REFERENCES special_unit_members(id) ON DELETE CASCADE NOT NULL,
    attendance_status VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6.6 Special Unit Training
CREATE TABLE IF NOT EXISTS special_unit_training (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID REFERENCES special_units(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    instructor VARCHAR(255),
    training_date DATE NOT NULL,
    location VARCHAR(255),
    duration_hours DECIMAL(5,2),
    evaluation TEXT,
    certificate_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6.7 Special Unit Achievements
CREATE TABLE IF NOT EXISTS special_unit_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES special_unit_members(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    achievement_date DATE NOT NULL,
    organizer VARCHAR(255),
    description TEXT,
    certificate_url TEXT,
    evidence_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TAHAP 7: SPIRITUAL
-- ===========================================

-- 7.1 Spiritual Activities
CREATE TABLE IF NOT EXISTS spiritual_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME,
    location VARCHAR(255),
    supervisor_id UUID REFERENCES users(id),
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE SET NULL,
    semester_id UUID REFERENCES semesters(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7.2 Spiritual Participation
CREATE TABLE IF NOT EXISTS spiritual_participation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID REFERENCES spiritual_activities(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    attendance_status VARCHAR(20) DEFAULT 'present',
    participation_level VARCHAR(20),
    notes TEXT,
    recorded_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(activity_id, student_id)
);

-- 7.3 Spiritual Reflections
CREATE TABLE IF NOT EXISTS spiritual_reflections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    activity_id UUID REFERENCES spiritual_activities(id) ON DELETE SET NULL,
    reflection_date DATE NOT NULL,
    observation TEXT NOT NULL,
    recommendation TEXT,
    recorded_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7.4 Spiritual Achievements
CREATE TABLE IF NOT EXISTS spiritual_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    achievement_date DATE NOT NULL,
    description TEXT,
    certificate_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TAHAP 8: SAVINGS
-- ===========================================

-- 8.1 Savings Accounts
CREATE TABLE IF NOT EXISTS savings_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL UNIQUE,
    account_number VARCHAR(50) UNIQUE,
    current_balance DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    opened_date DATE NOT NULL,
    closed_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8.2 Savings Transactions
CREATE TABLE IF NOT EXISTS savings_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES savings_accounts(id) ON DELETE CASCADE NOT NULL,
    transaction_number VARCHAR(50) NOT NULL UNIQUE,
    transaction_type VARCHAR(20) NOT NULL,
    transaction_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    balance_before DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(50),
    reference_number VARCHAR(100),
    receipt_number VARCHAR(50),
    description TEXT,
    recorded_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'completed',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_savings_trans_account ON savings_transactions(account_id);
CREATE INDEX idx_savings_trans_date ON savings_transactions(transaction_date);

-- 8.3 Cash Sessions
CREATE TABLE IF NOT EXISTS cash_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_number VARCHAR(50) NOT NULL UNIQUE,
    cashier_id UUID REFERENCES users(id) NOT NULL,
    opening_balance DECIMAL(15,2) NOT NULL,
    opening_time TIMESTAMPTZ NOT NULL,
    closing_balance DECIMAL(15,2),
    closing_time TIMESTAMPTZ,
    physical_cash DECIMAL(15,2),
    difference DECIMAL(15,2) DEFAULT 0,
    difference_status VARCHAR(20),
    status VARCHAR(20) DEFAULT 'open',
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TAHAP 9: NOTIFICATIONS & ANNOUNCEMENTS
-- ===========================================

-- 9.1 Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal',
    module VARCHAR(50),
    reference_id UUID,
    action_url TEXT,
    read_status BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read_status) WHERE read_status = FALSE;

-- 9.2 Announcements
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    audience VARCHAR(50) NOT NULL,
    audience_roles JSONB,
    audience_users JSONB,
    priority VARCHAR(20) DEFAULT 'normal',
    publish_date TIMESTAMPTZ,
    expiration_date TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'draft',
    published_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TAHAP 10: DOCUMENTS
-- ===========================================

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    documentable_type VARCHAR(50) NOT NULL,
    documentable_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    file_url TEXT NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    description TEXT,
    uploaded_by UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_owner ON documents(documentable_type, documentable_id);

-- ===========================================
-- TAHAP 11: IMPORT & EXPORT
-- ===========================================

-- 11.1 Import Jobs
CREATE TABLE IF NOT EXISTS import_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT,
    strategy VARCHAR(50) DEFAULT 'insert',
    total_records INTEGER,
    imported_count INTEGER DEFAULT 0,
    updated_count INTEGER DEFAULT 0,
    skipped_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    error_report_url TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    executed_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11.2 Export Jobs
CREATE TABLE IF NOT EXISTS export_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT,
    format VARCHAR(20) NOT NULL,
    total_records INTEGER,
    filters JSONB,
    status VARCHAR(20) DEFAULT 'pending',
    downloaded_at TIMESTAMPTZ,
    downloaded_by UUID REFERENCES users(id),
    executed_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TAHAP 12: SETTINGS
-- ===========================================

CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) NOT NULL,
    key VARCHAR(100) NOT NULL,
    value TEXT,
    type VARCHAR(20) DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(category, key)
);

-- Insert default settings
INSERT INTO settings (category, key, value, type, description, is_public) VALUES
    ('general', 'app_name', 'Twosraku', 'string', 'Application name', TRUE),
    ('general', 'school_name', 'SMKN 2 Sragen', 'string', 'School name', TRUE),
    ('academic', 'default_grade_scale', 'A:90-100,B:80-89,C:70-79,D:60-69,E:0-59', 'string', 'Default grade scale', FALSE),
    ('attendance', 'late_threshold_minutes', '15', 'number', 'Minutes after which attendance is marked as late', FALSE),
    ('character', 'counseling_threshold', '100', 'number', 'Negative points threshold for counseling recommendation', FALSE),
    ('savings', 'minimum_deposit', '1000', 'number', 'Minimum deposit amount', FALSE),
    ('savings', 'maximum_withdrawal', '5000000', 'number', 'Maximum withdrawal amount', FALSE)
ON CONFLICT (category, key) DO NOTHING;

-- ===========================================
-- TAHAP 13: AUDIT LOGS
-- ===========================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(50) NOT NULL,
    module VARCHAR(50) NOT NULL,
    entity VARCHAR(100),
    entity_id UUID,
    old_value JSONB,
    new_value JSONB,
    description TEXT,
    ip_address VARCHAR(50),
    user_agent TEXT,
    user_id UUID,
    user_role VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_module ON audit_logs(module);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity, entity_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_date ON audit_logs(created_at);

-- ===========================================
-- ROW LEVEL SECURITY (RLS)
-- ===========================================
-- Aktifkan RLS untuk keamanan data

ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE majors ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_unit_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE spiritual_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE spiritual_participation ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- TRIGGER: Auto-update updated_at
-- ===========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_academic_years_updated_at BEFORE UPDATE ON academic_years FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_semesters_updated_at BEFORE UPDATE ON semesters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_majors_updated_at BEFORE UPDATE ON majors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_classes_updated_at BEFORE UPDATE ON student_classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parents_updated_at BEFORE UPDATE ON parents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessment_categories_updated_at BEFORE UPDATE ON assessment_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessment_templates_updated_at BEFORE UPDATE ON assessment_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessment_items_updated_at BEFORE UPDATE ON assessment_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessment_sessions_updated_at BEFORE UPDATE ON assessment_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessment_participants_updated_at BEFORE UPDATE ON assessment_participants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_scores_updated_at BEFORE UPDATE ON student_scores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_character_categories_updated_at BEFORE UPDATE ON character_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_behavior_types_updated_at BEFORE UPDATE ON behavior_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_character_events_updated_at BEFORE UPDATE ON character_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_character_records_updated_at BEFORE UPDATE ON character_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_special_units_updated_at BEFORE UPDATE ON special_units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_special_unit_positions_updated_at BEFORE UPDATE ON special_unit_positions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_special_unit_members_updated_at BEFORE UPDATE ON special_unit_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_special_unit_assignments_updated_at BEFORE UPDATE ON special_unit_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_special_unit_training_updated_at BEFORE UPDATE ON special_unit_training FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_spiritual_activities_updated_at BEFORE UPDATE ON spiritual_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_spiritual_participation_updated_at BEFORE UPDATE ON spiritual_participation FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_spiritual_reflections_updated_at BEFORE UPDATE ON spiritual_reflections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_savings_accounts_updated_at BEFORE UPDATE ON savings_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_savings_transactions_updated_at BEFORE UPDATE ON savings_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cash_sessions_updated_at BEFORE UPDATE ON cash_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- SELESAI
-- ===========================================

-- Verifikasi semua tabel dibuat
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
