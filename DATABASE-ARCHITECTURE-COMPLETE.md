# Therapy Field - Complete Database Architecture

## Executive Summary

This document defines the complete database architecture for Therapy Field, a comprehensive mental health platform serving clients, therapists, and businesses in Greece. The design prioritizes data security, GDPR compliance, scalability, and performance while supporting complex relationships between users, appointments, clinical data, and business analytics.

## Database Technology Stack

### Primary Database: PostgreSQL 15+
- **Rationale**: ACID compliance, JSON support, full-text search, partitioning, strong encryption
- **Use Cases**: Core transactional data, user management, appointments, clinical notes

### Cache Layer: Redis 7+
- **Rationale**: High-performance caching, session management, real-time features
- **Use Cases**: Session storage, API rate limiting, temporary data, real-time notifications

### Search Engine: Elasticsearch 8+
- **Rationale**: Full-text search, analytics, log aggregation
- **Use Cases**: Therapist search, article search, analytics queries, audit logs

### Time-Series Database: TimescaleDB
- **Rationale**: Optimized for time-series data, built on PostgreSQL
- **Use Cases**: Mood tracking, wellness metrics, business analytics, system metrics

### Document Store: MongoDB (Optional)
- **Rationale**: Flexible schema for evolving data structures
- **Use Cases**: User-generated content, questionnaires, dynamic forms

## 1. Complete Database Schema

### Core User Management Tables

```sql
-- Users table (base authentication)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    email_normalized VARCHAR(255) UNIQUE NOT NULL, -- Lowercase for lookups
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('client', 'therapist', 'business_admin', 'super_admin') NOT NULL,
    status ENUM('pending', 'active', 'suspended', 'deleted') DEFAULT 'pending',
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    last_login_at TIMESTAMP,
    last_login_ip INET,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP,
    CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes for users
CREATE INDEX idx_users_email_normalized ON users(email_normalized);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- User profiles (common data)
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(200),
    phone VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,
    birth_date DATE,
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    profile_photo_url VARCHAR(500),
    language VARCHAR(5) DEFAULT 'el',
    timezone VARCHAR(50) DEFAULT 'Europe/Athens',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Client profiles (extends user_profiles)
CREATE TABLE client_profiles (
    user_id UUID PRIMARY KEY REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    occupation VARCHAR(100),
    marital_status ENUM('single', 'married', 'divorced', 'widowed', 'partnership'),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    referral_source VARCHAR(100),
    insurance_provider VARCHAR(100),
    insurance_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Therapist profiles (extends user_profiles)
CREATE TABLE therapist_profiles (
    user_id UUID PRIMARY KEY REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_type VARCHAR(100),
    license_issued_date DATE,
    license_expiry_date DATE,
    professional_title VARCHAR(200),
    bio TEXT,
    years_of_experience INT,
    education_level VARCHAR(50),
    supervisor_status BOOLEAN DEFAULT FALSE,
    accepts_insurance BOOLEAN DEFAULT TRUE,
    offers_online_therapy BOOLEAN DEFAULT TRUE,
    offers_in_person_therapy BOOLEAN DEFAULT TRUE,
    verified_at TIMESTAMP,
    verified_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Business accounts
CREATE TABLE business_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(200) NOT NULL,
    company_tax_id VARCHAR(50) UNIQUE,
    industry VARCHAR(100),
    employee_count_range VARCHAR(50),
    billing_email VARCHAR(255),
    billing_address JSONB,
    plan_type ENUM('starter', 'professional', 'enterprise') NOT NULL,
    plan_employee_limit INT,
    contract_start_date DATE,
    contract_end_date DATE,
    status ENUM('trial', 'active', 'suspended', 'cancelled') DEFAULT 'trial',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Business admins (many-to-many)
CREATE TABLE business_admins (
    business_id UUID REFERENCES business_accounts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role ENUM('owner', 'admin', 'hr_admin', 'finance_admin', 'wellness_coordinator', 'viewer') NOT NULL,
    permissions JSONB DEFAULT '{}',
    added_by UUID REFERENCES users(id),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (business_id, user_id)
);

-- Employee connections
CREATE TABLE business_employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES business_accounts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    employee_identifier VARCHAR(100), -- Internal employee ID (hashed)
    department VARCHAR(100),
    role_title VARCHAR(100),
    enrollment_status ENUM('invited', 'active', 'inactive', 'departed') DEFAULT 'invited',
    invited_at TIMESTAMP,
    enrolled_at TIMESTAMP,
    last_active_at TIMESTAMP,
    therapy_sessions_limit INT,
    therapy_sessions_used INT DEFAULT 0,
    UNIQUE(business_id, user_id)
);
```

### Therapist Specialization and Availability

```sql
-- Therapist specializations
CREATE TABLE specializations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    name_el VARCHAR(100) NOT NULL, -- Greek name
    category VARCHAR(50),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE therapist_specializations (
    therapist_id UUID REFERENCES therapist_profiles(user_id) ON DELETE CASCADE,
    specialization_id UUID REFERENCES specializations(id) ON DELETE CASCADE,
    years_experience INT,
    is_primary BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (therapist_id, specialization_id)
);

-- Therapeutic approaches
CREATE TABLE therapeutic_approaches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    name_el VARCHAR(100) NOT NULL,
    abbreviation VARCHAR(20),
    description TEXT
);

CREATE TABLE therapist_approaches (
    therapist_id UUID REFERENCES therapist_profiles(user_id) ON DELETE CASCADE,
    approach_id UUID REFERENCES therapeutic_approaches(id) ON DELETE CASCADE,
    proficiency_level ENUM('basic', 'intermediate', 'advanced', 'expert'),
    PRIMARY KEY (therapist_id, approach_id)
);

-- Languages spoken
CREATE TABLE therapist_languages (
    therapist_id UUID REFERENCES therapist_profiles(user_id) ON DELETE CASCADE,
    language_code VARCHAR(5),
    proficiency_level ENUM('basic', 'conversational', 'fluent', 'native'),
    PRIMARY KEY (therapist_id, language_code)
);

-- Therapist locations
CREATE TABLE therapist_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID REFERENCES therapist_profiles(user_id) ON DELETE CASCADE,
    location_type ENUM('primary', 'secondary') DEFAULT 'primary',
    practice_name VARCHAR(200),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(2) DEFAULT 'GR',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    google_place_id VARCHAR(255),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Therapist availability templates
CREATE TABLE availability_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID REFERENCES therapist_profiles(user_id) ON DELETE CASCADE,
    day_of_week INT CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location_id UUID REFERENCES therapist_locations(id),
    session_type ENUM('in_person', 'online', 'both') DEFAULT 'both',
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT chk_time_order CHECK (end_time > start_time)
);

-- Availability exceptions (holidays, vacations, etc.)
CREATE TABLE availability_exceptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID REFERENCES therapist_profiles(user_id) ON DELETE CASCADE,
    exception_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    is_available BOOLEAN DEFAULT FALSE,
    reason VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(therapist_id, exception_date)
);
```

### Appointment and Session Management

```sql
-- Appointment types
CREATE TABLE appointment_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    duration_minutes INT NOT NULL,
    description TEXT,
    is_initial_assessment BOOLEAN DEFAULT FALSE,
    requires_payment_upfront BOOLEAN DEFAULT FALSE
);

-- Appointments
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    therapist_id UUID REFERENCES users(id) ON DELETE CASCADE,
    appointment_type_id UUID REFERENCES appointment_types(id),
    scheduled_start TIMESTAMP NOT NULL,
    scheduled_end TIMESTAMP NOT NULL,
    actual_start TIMESTAMP,
    actual_end TIMESTAMP,
    location_id UUID REFERENCES therapist_locations(id),
    session_type ENUM('in_person', 'online') NOT NULL,
    status ENUM('requested', 'confirmed', 'cancelled', 'completed', 'no_show', 'rescheduled') DEFAULT 'requested',
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES users(id),
    cancelled_at TIMESTAMP,
    rescheduled_from UUID REFERENCES appointments(id),
    video_session_link VARCHAR(500),
    client_notes TEXT, -- Notes from client
    therapist_private_notes TEXT, -- Encrypted, therapist-only
    reminder_sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_appointment_times CHECK (scheduled_end > scheduled_start)
);

-- Indexes for appointments
CREATE INDEX idx_appointments_client_id ON appointments(client_id);
CREATE INDEX idx_appointments_therapist_id ON appointments(therapist_id);
CREATE INDEX idx_appointments_scheduled_start ON appointments(scheduled_start);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_composite ON appointments(therapist_id, scheduled_start, status);

-- Recurring appointments
CREATE TABLE recurring_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    therapist_id UUID REFERENCES users(id) ON DELETE CASCADE,
    appointment_type_id UUID REFERENCES appointment_types(id),
    frequency ENUM('weekly', 'biweekly', 'monthly') NOT NULL,
    day_of_week INT,
    time_of_day TIME,
    location_id UUID REFERENCES therapist_locations(id),
    session_type ENUM('in_person', 'online'),
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Session notes (clinical documentation)
CREATE TABLE session_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    therapist_id UUID REFERENCES users(id) ON DELETE CASCADE,
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    note_type ENUM('soap', 'dap', 'birp', 'custom') DEFAULT 'soap',
    therapeutic_approach VARCHAR(50),
    content JSONB NOT NULL, -- Encrypted JSON with structured notes
    interventions TEXT[], -- Array of interventions used
    homework_assigned TEXT,
    progress_indicators TEXT,
    risk_assessment JSONB,
    next_session_plan TEXT,
    is_signed BOOLEAN DEFAULT FALSE,
    signed_at TIMESTAMP,
    supervisor_reviewed BOOLEAN DEFAULT FALSE,
    supervisor_id UUID REFERENCES users(id),
    supervisor_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version INT DEFAULT 1
);

-- Session note templates
CREATE TABLE note_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    note_type ENUM('soap', 'dap', 'birp', 'custom'),
    therapeutic_approach VARCHAR(50),
    template_content JSONB NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Clinical Data and Patient History

```sql
-- Patient medical history
CREATE TABLE patient_medical_history (
    client_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_medications JSONB DEFAULT '[]',
    allergies JSONB DEFAULT '[]',
    chronic_conditions JSONB DEFAULT '[]',
    previous_hospitalizations JSONB DEFAULT '[]',
    substance_use_history JSONB DEFAULT '{}',
    family_medical_history JSONB DEFAULT '{}',
    last_physical_exam DATE,
    primary_care_physician VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Psychiatric history
CREATE TABLE patient_psychiatric_history (
    client_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    previous_diagnoses JSONB DEFAULT '[]',
    previous_therapists JSONB DEFAULT '[]',
    previous_medications JSONB DEFAULT '[]',
    hospitalization_history JSONB DEFAULT '[]',
    suicide_attempts JSONB DEFAULT '[]',
    self_harm_history JSONB DEFAULT '[]',
    trauma_history JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Social history
CREATE TABLE patient_social_history (
    client_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    education_level VARCHAR(100),
    employment_status VARCHAR(100),
    occupation_history JSONB DEFAULT '[]',
    relationship_status VARCHAR(50),
    living_situation VARCHAR(200),
    support_system JSONB DEFAULT '{}',
    hobbies_interests TEXT[],
    cultural_background VARCHAR(200),
    religious_spiritual VARCHAR(200),
    legal_history JSONB DEFAULT '{}',
    military_service JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Treatment plans
CREATE TABLE treatment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    therapist_id UUID REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    review_date DATE,
    status ENUM('active', 'completed', 'terminated') DEFAULT 'active',
    presenting_problems TEXT[],
    diagnoses JSONB DEFAULT '[]', -- ICD-10/DSM-5 codes
    treatment_goals JSONB DEFAULT '[]',
    interventions_planned JSONB DEFAULT '[]',
    measurement_tools TEXT[],
    expected_duration VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clinical assessments
CREATE TABLE clinical_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    therapist_id UUID REFERENCES users(id) ON DELETE CASCADE,
    assessment_type VARCHAR(100) NOT NULL,
    assessment_tool VARCHAR(100),
    score DECIMAL,
    interpretation TEXT,
    raw_data JSONB,
    administered_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Wellness Tracking (Time-Series Data)

```sql
-- Mood tracking (TimescaleDB hypertable)
CREATE TABLE mood_entries (
    id UUID DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recorded_at TIMESTAMP NOT NULL,
    mood_score INT CHECK (mood_score >= 1 AND mood_score <= 10),
    energy_level INT CHECK (energy_level >= 1 AND energy_level <= 10),
    anxiety_level INT CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
    sleep_quality INT CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
    emotions TEXT[],
    activities TEXT[],
    notes TEXT,
    weather_conditions JSONB,
    shared_with_therapist BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (client_id, recorded_at)
);

-- Convert to TimescaleDB hypertable
SELECT create_hypertable('mood_entries', 'recorded_at');

-- Journal entries
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(200),
    content TEXT NOT NULL, -- Encrypted
    mood_score INT,
    tags TEXT[],
    is_private BOOLEAN DEFAULT TRUE,
    shared_with_therapist BOOLEAN DEFAULT FALSE,
    therapist_can_read UUID REFERENCES users(id),
    sentiment_analysis JSONB, -- AI analysis results
    word_count INT,
    reading_time_minutes INT
);

-- Habit tracking
CREATE TABLE habit_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    frequency ENUM('daily', 'weekly', 'custom'),
    target_count INT,
    unit VARCHAR(50),
    category VARCHAR(50),
    color VARCHAR(7), -- Hex color
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE habit_logs (
    id UUID DEFAULT gen_random_uuid(),
    habit_id UUID REFERENCES habit_definitions(id) ON DELETE CASCADE,
    logged_at TIMESTAMP NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    value DECIMAL,
    notes TEXT,
    PRIMARY KEY (habit_id, logged_at)
);

-- Convert to hypertable
SELECT create_hypertable('habit_logs', 'logged_at');

-- Goals tracking
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    target_date DATE,
    progress_type ENUM('percentage', 'milestone', 'binary'),
    current_progress DECIMAL DEFAULT 0,
    milestones JSONB DEFAULT '[]',
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    shared_with_therapist BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Payment and Billing

```sql
-- Payment methods
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type ENUM('card', 'bank_transfer', 'paypal', 'corporate') NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    provider VARCHAR(50), -- Stripe, PayPal, etc.
    provider_customer_id VARCHAR(255),
    last_four VARCHAR(4), -- For cards
    card_brand VARCHAR(50),
    expiry_month INT,
    expiry_year INT,
    bank_name VARCHAR(100),
    account_last_four VARCHAR(4),
    billing_address JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Therapy session rates
CREATE TABLE therapist_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID REFERENCES therapist_profiles(user_id) ON DELETE CASCADE,
    appointment_type_id UUID REFERENCES appointment_types(id),
    rate_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    effective_from DATE NOT NULL,
    effective_to DATE,
    corporate_rate DECIMAL(10, 2),
    sliding_scale_available BOOLEAN DEFAULT FALSE,
    sliding_scale_minimum DECIMAL(10, 2),
    notes TEXT
);

-- Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    business_id UUID REFERENCES business_accounts(id),
    therapist_id UUID REFERENCES users(id),
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_rate DECIMAL(5, 2) DEFAULT 24.00, -- Greek VAT
    tax_amount DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    status ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled') DEFAULT 'draft',
    paid_at TIMESTAMP,
    payment_method_id UUID REFERENCES payment_methods(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoice line items
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id),
    description VARCHAR(500) NOT NULL,
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    tax_rate DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    invoice_id UUID REFERENCES invoices(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    type ENUM('payment', 'refund', 'chargeback', 'payout') NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    payment_method_id UUID REFERENCES payment_methods(id),
    provider VARCHAR(50),
    provider_transaction_id VARCHAR(255),
    provider_response JSONB,
    failure_reason TEXT,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Therapist payouts
CREATE TABLE therapist_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID REFERENCES users(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_sessions INT,
    gross_amount DECIMAL(10, 2) NOT NULL,
    platform_fee_percentage DECIMAL(5, 2) DEFAULT 20.00,
    platform_fee_amount DECIMAL(10, 2) NOT NULL,
    net_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    payout_method VARCHAR(50),
    payout_reference VARCHAR(255),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Content and Community

```sql
-- Articles/Resources
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image_url VARCHAR(500),
    category VARCHAR(100),
    tags TEXT[],
    reading_time_minutes INT,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at TIMESTAMP,
    view_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    seo_title VARCHAR(200),
    seo_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Article engagement
CREATE TABLE article_interactions (
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    interaction_type ENUM('view', 'like', 'bookmark', 'share'),
    interacted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (article_id, user_id, interaction_type)
);

-- Comments
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Professional forums
CREATE TABLE forum_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    sort_order INT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE forum_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES forum_categories(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    reply_count INT DEFAULT 0,
    last_reply_at TIMESTAMP,
    last_reply_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE forum_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID REFERENCES forum_threads(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_solution BOOLEAN DEFAULT FALSE,
    upvotes INT DEFAULT 0,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Supervision and Professional Development

```sql
-- Supervision relationships
CREATE TABLE supervision_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supervisor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    supervisee_id UUID REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    status ENUM('active', 'completed', 'terminated') DEFAULT 'active',
    supervision_type VARCHAR(100),
    frequency VARCHAR(50),
    rate_per_session DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(supervisor_id, supervisee_id)
);

-- Supervision sessions
CREATE TABLE supervision_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    relationship_id UUID REFERENCES supervision_relationships(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP NOT NULL,
    duration_minutes INT,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    topics_discussed TEXT[],
    action_items JSONB DEFAULT '[]',
    supervisee_notes TEXT,
    supervisor_notes TEXT, -- Encrypted
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Continuing education
CREATE TABLE continuing_education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_name VARCHAR(500) NOT NULL,
    provider VARCHAR(200),
    completion_date DATE,
    credits_earned DECIMAL(5, 2),
    certificate_url VARCHAR(500),
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### System and Audit Tables

```sql
-- Audit log (for all sensitive operations)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

-- Partitioning for audit logs by month
CREATE TABLE audit_logs_2024_01 PARTITION OF audit_logs
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- API rate limiting
CREATE TABLE api_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    api_key VARCHAR(255),
    endpoint VARCHAR(255),
    requests_count INT DEFAULT 0,
    window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    window_end TIMESTAMP
);

-- System notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200),
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email queue
CREATE TABLE email_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    to_email VARCHAR(255) NOT NULL,
    from_email VARCHAR(255) DEFAULT 'noreply@therapyfield.gr',
    subject VARCHAR(500) NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT,
    template_name VARCHAR(100),
    template_data JSONB,
    priority INT DEFAULT 5,
    status ENUM('pending', 'sending', 'sent', 'failed') DEFAULT 'pending',
    attempts INT DEFAULT 0,
    sent_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scheduled_for TIMESTAMP
);

-- SMS queue
CREATE TABLE sms_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    to_phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('pending', 'sending', 'sent', 'failed') DEFAULT 'pending',
    provider VARCHAR(50),
    provider_message_id VARCHAR(255),
    attempts INT DEFAULT 0,
    sent_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scheduled_for TIMESTAMP
);
```

## 2. Relationships and Constraints

### Foreign Key Relationships
```sql
-- Additional constraints not defined inline

-- Ensure therapists can't book appointments with themselves
ALTER TABLE appointments 
ADD CONSTRAINT chk_no_self_appointment 
CHECK (client_id != therapist_id);

-- Ensure business employees have the client role
ALTER TABLE business_employees
ADD CONSTRAINT chk_employee_role
CHECK (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = business_employees.user_id 
        AND users.role = 'client'
    )
);

-- Ensure only therapists can be supervisors
ALTER TABLE supervision_relationships
ADD CONSTRAINT chk_supervisor_is_therapist
CHECK (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = supervision_relationships.supervisor_id 
        AND users.role = 'therapist'
    )
);

-- Ensure payment method belongs to the user making the transaction
ALTER TABLE transactions
ADD CONSTRAINT chk_payment_method_owner
CHECK (
    payment_method_id IS NULL OR
    EXISTS (
        SELECT 1 FROM payment_methods 
        WHERE payment_methods.id = transactions.payment_method_id 
        AND payment_methods.user_id = transactions.user_id
    )
);
```

### Composite Indexes for Performance
```sql
-- User search
CREATE INDEX idx_user_search ON user_profiles 
USING gin(to_tsvector('english', first_name || ' ' || last_name));

-- Therapist search by location
CREATE INDEX idx_therapist_location ON therapist_locations 
USING gist(ll_to_earth(latitude, longitude));

-- Appointment conflicts
CREATE INDEX idx_appointment_conflicts ON appointments
(therapist_id, scheduled_start, scheduled_end) 
WHERE status IN ('confirmed', 'completed');

-- Business analytics
CREATE INDEX idx_business_employee_analytics ON business_employees
(business_id, enrollment_status, last_active_at);

-- Session notes by client
CREATE INDEX idx_session_notes_client ON session_notes
(client_id, created_at DESC);

-- Mood tracking analytics
CREATE INDEX idx_mood_analytics ON mood_entries
(client_id, recorded_at DESC, mood_score);

-- Payment reconciliation
CREATE INDEX idx_payment_reconciliation ON transactions
(invoice_id, status, processed_at);
```

## 3. Data Types and Validation

### Custom Types and Domains
```sql
-- Email domain with validation
CREATE DOMAIN email_address AS VARCHAR(255)
CHECK (VALUE ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Phone number domain
CREATE DOMAIN phone_number AS VARCHAR(20)
CHECK (VALUE ~ '^\+?[0-9\s\-\(\)]+$');

-- Positive decimal for money
CREATE DOMAIN positive_money AS DECIMAL(10, 2)
CHECK (VALUE >= 0);

-- Percentage domain
CREATE DOMAIN percentage AS DECIMAL(5, 2)
CHECK (VALUE >= 0 AND VALUE <= 100);

-- UUID array type for permissions
CREATE TYPE permission_set AS (
    resource VARCHAR(50),
    actions VARCHAR(20)[]
);
```

## 4. Encryption Strategy

### At-Rest Encryption
```sql
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encryption functions for sensitive data
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(
        encrypt(
            data::bytea, 
            current_setting('app.encryption_key')::bytea, 
            'aes'
        ), 
        'base64'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrypt_sensitive_data(encrypted_data TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN convert_from(
        decrypt(
            decode(encrypted_data, 'base64'), 
            current_setting('app.encryption_key')::bytea, 
            'aes'
        ), 
        'UTF8'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic encryption of session notes
CREATE OR REPLACE FUNCTION encrypt_session_notes()
RETURNS TRIGGER AS $$
BEGIN
    NEW.content = encrypt_sensitive_data(NEW.content::text)::jsonb;
    IF NEW.therapist_private_notes IS NOT NULL THEN
        NEW.therapist_private_notes = encrypt_sensitive_data(NEW.therapist_private_notes);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_encrypt_session_notes
BEFORE INSERT OR UPDATE ON session_notes
FOR EACH ROW EXECUTE FUNCTION encrypt_session_notes();
```

### Column-Level Encryption
```sql
-- Sensitive columns to encrypt
ALTER TABLE users ALTER COLUMN two_factor_secret TYPE TEXT 
USING encrypt_sensitive_data(two_factor_secret);

ALTER TABLE patient_medical_history ALTER COLUMN current_medications TYPE JSONB 
USING encrypt_sensitive_data(current_medications::text)::jsonb;

ALTER TABLE patient_psychiatric_history ALTER COLUMN previous_diagnoses TYPE JSONB 
USING encrypt_sensitive_data(previous_diagnoses::text)::jsonb;

ALTER TABLE journal_entries ALTER COLUMN content TYPE TEXT 
USING encrypt_sensitive_data(content);
```

## 5. Audit Trail Implementation

### Comprehensive Audit Triggers
```sql
-- Generic audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    audit_user_id UUID;
    old_data JSONB;
    new_data JSONB;
BEGIN
    -- Get user from context
    audit_user_id := current_setting('app.current_user_id', true)::UUID;
    
    -- Prepare old and new data
    IF TG_OP = 'DELETE' THEN
        old_data = row_to_json(OLD);
        new_data = NULL;
    ELSIF TG_OP = 'INSERT' THEN
        old_data = NULL;
        new_data = row_to_json(NEW);
    ELSE -- UPDATE
        old_data = row_to_json(OLD);
        new_data = row_to_json(NEW);
    END IF;
    
    -- Insert audit record
    INSERT INTO audit_logs (
        user_id,
        action,
        entity_type,
        entity_id,
        old_values,
        new_values,
        ip_address,
        user_agent
    ) VALUES (
        audit_user_id,
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        old_data,
        new_data,
        inet_client_addr(),
        current_setting('app.user_agent', true)
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_appointments AFTER INSERT OR UPDATE OR DELETE ON appointments
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_session_notes AFTER INSERT OR UPDATE OR DELETE ON session_notes
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_transactions AFTER INSERT OR UPDATE OR DELETE ON transactions
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

## 6. Backup and Recovery Strategy

### Backup Configuration
```sql
-- Backup policy table
CREATE TABLE backup_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_name VARCHAR(100) NOT NULL,
    schedule_type ENUM('continuous', 'daily', 'weekly', 'monthly') NOT NULL,
    retention_days INT NOT NULL,
    encryption_enabled BOOLEAN DEFAULT TRUE,
    storage_location VARCHAR(500),
    last_backup_at TIMESTAMP,
    next_backup_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Backup history
CREATE TABLE backup_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID REFERENCES backup_policies(id),
    backup_type ENUM('full', 'incremental', 'differential') NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    size_bytes BIGINT,
    status ENUM('running', 'completed', 'failed') DEFAULT 'running',
    error_message TEXT,
    file_path VARCHAR(500),
    checksum VARCHAR(64)
);

-- Point-in-time recovery settings
ALTER SYSTEM SET wal_level = 'replica';
ALTER SYSTEM SET archive_mode = 'on';
ALTER SYSTEM SET archive_command = 'cp %p /backup/wal_archive/%f';
```

### Backup Scripts
```bash
#!/bin/bash
# Daily backup script
BACKUP_DIR="/backup/daily"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="therapy_field"

# Full backup with compression and encryption
pg_dump -Fc -Z9 $DB_NAME | \
openssl enc -aes-256-cbc -salt -pass pass:$BACKUP_PASSWORD \
> "$BACKUP_DIR/backup_${TIMESTAMP}.dump.enc"

# Update backup history
psql $DB_NAME -c "
    INSERT INTO backup_history (policy_id, backup_type, start_time, end_time, size_bytes, status)
    VALUES ('daily-policy-id', 'full', NOW() - INTERVAL '5 minutes', NOW(), 
            pg_database_size('$DB_NAME'), 'completed')
"

# Clean old backups
find $BACKUP_DIR -name "*.dump.enc" -mtime +30 -delete
```

## 7. Data Retention Policies

### Retention Rules
```sql
-- Data retention policies table
CREATE TABLE data_retention_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    retention_days INT NOT NULL,
    deletion_strategy ENUM('hard_delete', 'soft_delete', 'anonymize') NOT NULL,
    last_cleanup_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Default retention policies
INSERT INTO data_retention_policies (table_name, retention_days, deletion_strategy) VALUES
('audit_logs', 365, 'hard_delete'),
('email_queue', 30, 'hard_delete'),
('sms_queue', 30, 'hard_delete'),
('api_rate_limits', 1, 'hard_delete'),
('mood_entries', 730, 'anonymize'), -- 2 years
('session_notes', 2555, 'soft_delete'), -- 7 years (medical records)
('appointments', 2555, 'soft_delete'),
('transactions', 2555, 'soft_delete');

-- Automated cleanup function
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
DECLARE
    policy RECORD;
BEGIN
    FOR policy IN SELECT * FROM data_retention_policies WHERE is_active = TRUE LOOP
        CASE policy.deletion_strategy
            WHEN 'hard_delete' THEN
                EXECUTE format('DELETE FROM %I WHERE created_at < NOW() - INTERVAL ''%s days''', 
                              policy.table_name, policy.retention_days);
            WHEN 'soft_delete' THEN
                EXECUTE format('UPDATE %I SET deleted_at = NOW() WHERE created_at < NOW() - INTERVAL ''%s days'' AND deleted_at IS NULL', 
                              policy.table_name, policy.retention_days);
            WHEN 'anonymize' THEN
                -- Custom anonymization logic per table
                PERFORM anonymize_table_data(policy.table_name, policy.retention_days);
        END CASE;
        
        UPDATE data_retention_policies 
        SET last_cleanup_at = NOW() 
        WHERE id = policy.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup job
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule('cleanup-old-data', '0 2 * * *', 'SELECT cleanup_old_data()');
```

## 8. GDPR Compliance

### Data Export Function
```sql
CREATE OR REPLACE FUNCTION export_user_data(user_id_param UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    WITH user_data AS (
        SELECT 
            u.*,
            up.*,
            cp.*,
            tp.*
        FROM users u
        LEFT JOIN user_profiles up ON u.id = up.user_id
        LEFT JOIN client_profiles cp ON up.user_id = cp.user_id
        LEFT JOIN therapist_profiles tp ON up.user_id = tp.user_id
        WHERE u.id = user_id_param
    ),
    appointments_data AS (
        SELECT * FROM appointments 
        WHERE client_id = user_id_param OR therapist_id = user_id_param
    ),
    notes_data AS (
        SELECT * FROM session_notes 
        WHERE client_id = user_id_param
    ),
    mood_data AS (
        SELECT * FROM mood_entries 
        WHERE client_id = user_id_param
    ),
    journal_data AS (
        SELECT * FROM journal_entries 
        WHERE client_id = user_id_param
    )
    SELECT json_build_object(
        'user', (SELECT row_to_json(user_data) FROM user_data),
        'appointments', (SELECT json_agg(row_to_json(appointments_data)) FROM appointments_data),
        'session_notes', (SELECT json_agg(row_to_json(notes_data)) FROM notes_data),
        'mood_entries', (SELECT json_agg(row_to_json(mood_data)) FROM mood_data),
        'journal_entries', (SELECT json_agg(row_to_json(journal_data)) FROM journal_data),
        'export_date', NOW()
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Data deletion (right to be forgotten)
CREATE OR REPLACE FUNCTION delete_user_data(user_id_param UUID)
RETURNS void AS $$
BEGIN
    -- Start transaction
    -- Delete in correct order due to foreign keys
    DELETE FROM journal_entries WHERE client_id = user_id_param;
    DELETE FROM mood_entries WHERE client_id = user_id_param;
    DELETE FROM habit_logs WHERE habit_id IN (SELECT id FROM habit_definitions WHERE client_id = user_id_param);
    DELETE FROM habit_definitions WHERE client_id = user_id_param;
    DELETE FROM goals WHERE client_id = user_id_param;
    DELETE FROM clinical_assessments WHERE client_id = user_id_param;
    DELETE FROM treatment_plans WHERE client_id = user_id_param;
    DELETE FROM patient_social_history WHERE client_id = user_id_param;
    DELETE FROM patient_psychiatric_history WHERE client_id = user_id_param;
    DELETE FROM patient_medical_history WHERE client_id = user_id_param;
    DELETE FROM session_notes WHERE client_id = user_id_param;
    DELETE FROM appointments WHERE client_id = user_id_param;
    DELETE FROM payment_methods WHERE user_id = user_id_param;
    DELETE FROM client_profiles WHERE user_id = user_id_param;
    DELETE FROM user_profiles WHERE user_id = user_id_param;
    
    -- Anonymize user record instead of hard delete
    UPDATE users 
    SET email = 'deleted_' || id || '@deleted.com',
        email_normalized = 'deleted_' || id || '@deleted.com',
        password_hash = 'DELETED',
        status = 'deleted',
        deleted_at = NOW()
    WHERE id = user_id_param;
    
    -- Log the deletion
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
    VALUES (user_id_param, 'GDPR_DELETE', 'user', user_id_param, 
            jsonb_build_object('reason', 'user_requested', 'timestamp', NOW()));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 9. Partitioning Strategy

### Time-based Partitioning
```sql
-- Partition appointments by year
CREATE TABLE appointments_2024 PARTITION OF appointments
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE appointments_2025 PARTITION OF appointments
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Automated partition creation
CREATE OR REPLACE FUNCTION create_monthly_partitions()
RETURNS void AS $$
DECLARE
    start_date DATE;
    end_date DATE;
    partition_name TEXT;
BEGIN
    start_date := date_trunc('month', CURRENT_DATE);
    end_date := start_date + INTERVAL '1 month';
    
    -- Create partitions for next 3 months
    FOR i IN 0..2 LOOP
        partition_name := 'appointments_' || to_char(start_date + (i || ' months')::INTERVAL, 'YYYY_MM');
        
        EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I PARTITION OF appointments
            FOR VALUES FROM (%L) TO (%L)',
            partition_name,
            start_date + (i || ' months')::INTERVAL,
            start_date + ((i + 1) || ' months')::INTERVAL
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Schedule partition creation
SELECT cron.schedule('create-partitions', '0 0 1 * *', 'SELECT create_monthly_partitions()');
```

### Range Partitioning for Large Tables
```sql
-- Partition session notes by therapist ID ranges
CREATE TABLE session_notes_therapist_1 PARTITION OF session_notes
    FOR VALUES FROM (MINVALUE) TO ('33333333-3333-3333-3333-333333333333');

CREATE TABLE session_notes_therapist_2 PARTITION OF session_notes
    FOR VALUES FROM ('33333333-3333-3333-3333-333333333333') TO ('66666666-6666-6666-6666-666666666666');

CREATE TABLE session_notes_therapist_3 PARTITION OF session_notes
    FOR VALUES FROM ('66666666-6666-6666-6666-666666666666') TO (MAXVALUE);
```

## 10. Read/Write Optimization

### Read Replicas Configuration
```sql
-- Master database configuration
ALTER SYSTEM SET wal_level = 'logical';
ALTER SYSTEM SET max_wal_senders = 10;
ALTER SYSTEM SET max_replication_slots = 10;

-- Create publication for read replicas
CREATE PUBLICATION therapy_field_pub FOR ALL TABLES;

-- Materialized views for analytics
CREATE MATERIALIZED VIEW therapist_analytics AS
SELECT 
    t.user_id,
    COUNT(DISTINCT a.client_id) as total_clients,
    COUNT(a.id) as total_appointments,
    AVG(EXTRACT(EPOCH FROM (a.actual_end - a.actual_start))/60) as avg_session_duration,
    SUM(CASE WHEN a.status = 'completed' THEN 1 ELSE 0 END) as completed_sessions,
    SUM(CASE WHEN a.status = 'no_show' THEN 1 ELSE 0 END) as no_show_count,
    DATE_TRUNC('month', a.scheduled_start) as month
FROM therapist_profiles t
JOIN appointments a ON t.user_id = a.therapist_id
WHERE a.scheduled_start >= NOW() - INTERVAL '1 year'
GROUP BY t.user_id, DATE_TRUNC('month', a.scheduled_start);

-- Refresh materialized view
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY therapist_analytics;
    -- Add other materialized views here
END;
$$ LANGUAGE plpgsql;

-- Schedule refresh
SELECT cron.schedule('refresh-analytics', '0 */6 * * *', 'SELECT refresh_analytics_views()');
```

### Query Optimization Views
```sql
-- Optimized view for therapist search
CREATE VIEW therapist_search_view AS
SELECT 
    tp.user_id,
    up.first_name,
    up.last_name,
    up.profile_photo_url,
    tp.bio,
    tp.years_of_experience,
    array_agg(DISTINCT s.name) as specializations,
    array_agg(DISTINCT ta.name) as approaches,
    array_agg(DISTINCT tl.language_code) as languages,
    array_agg(DISTINCT loc.city) as cities,
    AVG(r.rating) as avg_rating,
    COUNT(DISTINCT r.id) as review_count
FROM therapist_profiles tp
JOIN user_profiles up ON tp.user_id = up.user_id
LEFT JOIN therapist_specializations ts ON tp.user_id = ts.therapist_id
LEFT JOIN specializations s ON ts.specialization_id = s.id
LEFT JOIN therapist_approaches tap ON tp.user_id = tap.therapist_id
LEFT JOIN therapeutic_approaches ta ON tap.approach_id = ta.id
LEFT JOIN therapist_languages tl ON tp.user_id = tl.therapist_id
LEFT JOIN therapist_locations loc ON tp.user_id = loc.therapist_id
LEFT JOIN reviews r ON tp.user_id = r.therapist_id
GROUP BY tp.user_id, up.first_name, up.last_name, up.profile_photo_url, tp.bio, tp.years_of_experience;

-- Create indexes for the view
CREATE INDEX idx_therapist_search_specializations ON therapist_specializations(therapist_id, specialization_id);
CREATE INDEX idx_therapist_search_approaches ON therapist_approaches(therapist_id, approach_id);
CREATE INDEX idx_therapist_search_languages ON therapist_languages(therapist_id, language_code);
```

## 11. Cache Layer Design

### Redis Cache Structure
```javascript
// Cache key patterns
const cacheKeys = {
    // User sessions
    userSession: (userId) => `session:${userId}`,
    userPermissions: (userId) => `permissions:${userId}`,
    
    // Therapist data
    therapistProfile: (therapistId) => `therapist:profile:${therapistId}`,
    therapistAvailability: (therapistId, date) => `therapist:availability:${therapistId}:${date}`,
    therapistSearch: (filters) => `search:therapists:${JSON.stringify(filters)}`,
    
    // Appointment data
    userAppointments: (userId) => `appointments:user:${userId}`,
    therapistSchedule: (therapistId, date) => `schedule:${therapistId}:${date}`,
    
    // Analytics
    businessMetrics: (businessId) => `analytics:business:${businessId}`,
    therapistStats: (therapistId) => `analytics:therapist:${therapistId}`,
    
    // Rate limiting
    apiRateLimit: (userId, endpoint) => `ratelimit:${userId}:${endpoint}`,
    
    // Real-time
    onlineStatus: (userId) => `online:${userId}`,
    typingStatus: (conversationId) => `typing:${conversationId}`
};

// Cache TTL configuration
const cacheTTL = {
    userSession: 3600, // 1 hour
    therapistProfile: 1800, // 30 minutes
    therapistAvailability: 300, // 5 minutes
    searchResults: 600, // 10 minutes
    analytics: 3600, // 1 hour
    rateLimit: 60, // 1 minute
    onlineStatus: 30 // 30 seconds
};
```

### Cache Invalidation Strategy
```sql
-- Trigger for cache invalidation
CREATE OR REPLACE FUNCTION invalidate_cache()
RETURNS TRIGGER AS $$
DECLARE
    cache_keys TEXT[];
BEGIN
    CASE TG_TABLE_NAME
        WHEN 'therapist_profiles' THEN
            cache_keys := ARRAY[
                'therapist:profile:' || NEW.user_id,
                'search:therapists:*'
            ];
        WHEN 'appointments' THEN
            cache_keys := ARRAY[
                'appointments:user:' || NEW.client_id,
                'appointments:user:' || NEW.therapist_id,
                'schedule:' || NEW.therapist_id || ':*'
            ];
        WHEN 'availability_templates' THEN
            cache_keys := ARRAY[
                'therapist:availability:' || NEW.therapist_id || ':*'
            ];
    END CASE;
    
    -- Send cache invalidation message
    PERFORM pg_notify('cache_invalidation', json_build_object(
        'keys', cache_keys,
        'timestamp', NOW()
    )::text);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply cache invalidation triggers
CREATE TRIGGER invalidate_therapist_cache 
AFTER UPDATE ON therapist_profiles
FOR EACH ROW EXECUTE FUNCTION invalidate_cache();

CREATE TRIGGER invalidate_appointment_cache 
AFTER INSERT OR UPDATE OR DELETE ON appointments
FOR EACH ROW EXECUTE FUNCTION invalidate_cache();
```

## 12. Search Functionality

### Full-Text Search Configuration
```sql
-- Create Greek text search configuration
CREATE TEXT SEARCH CONFIGURATION greek (COPY = simple);
ALTER TEXT SEARCH CONFIGURATION greek
    ALTER MAPPING FOR asciiword, asciihword, hword_asciipart,
                      word, hword, hword_part
    WITH greek_stem;

-- Full-text search indexes
CREATE INDEX idx_therapist_bio_search ON therapist_profiles 
USING gin(to_tsvector('greek', bio));

CREATE INDEX idx_article_search ON articles 
USING gin(to_tsvector('greek', title || ' ' || content));

-- Search function for therapists
CREATE OR REPLACE FUNCTION search_therapists(
    search_query TEXT,
    specialization_filter UUID[],
    city_filter TEXT[],
    online_only BOOLEAN,
    limit_count INT DEFAULT 20,
    offset_count INT DEFAULT 0
)
RETURNS TABLE (
    therapist_id UUID,
    name TEXT,
    bio TEXT,
    specializations TEXT[],
    cities TEXT[],
    rating DECIMAL,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tp.user_id,
        up.first_name || ' ' || up.last_name,
        tp.bio,
        array_agg(DISTINCT s.name),
        array_agg(DISTINCT tl.city),
        AVG(r.rating),
        ts_rank(
            to_tsvector('greek', tp.bio || ' ' || up.first_name || ' ' || up.last_name),
            plainto_tsquery('greek', search_query)
        ) as rank
    FROM therapist_profiles tp
    JOIN user_profiles up ON tp.user_id = up.user_id
    JOIN users u ON tp.user_id = u.id
    LEFT JOIN therapist_specializations ts ON tp.user_id = ts.therapist_id
    LEFT JOIN specializations s ON ts.specialization_id = s.id
    LEFT JOIN therapist_locations tl ON tp.user_id = tl.therapist_id
    LEFT JOIN reviews r ON tp.user_id = r.therapist_id
    WHERE 
        u.status = 'active'
        AND (search_query IS NULL OR 
             to_tsvector('greek', tp.bio || ' ' || up.first_name || ' ' || up.last_name) @@ 
             plainto_tsquery('greek', search_query))
        AND (specialization_filter IS NULL OR 
             ts.specialization_id = ANY(specialization_filter))
        AND (city_filter IS NULL OR 
             tl.city = ANY(city_filter))
        AND (NOT online_only OR tp.offers_online_therapy = TRUE)
    GROUP BY tp.user_id, up.first_name, up.last_name, tp.bio
    ORDER BY rank DESC, AVG(r.rating) DESC NULLS LAST
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;
```

### Elasticsearch Integration
```json
// Elasticsearch mapping for therapist search
{
    "mappings": {
        "properties": {
            "therapist_id": { "type": "keyword" },
            "name": { 
                "type": "text",
                "analyzer": "greek",
                "fields": {
                    "keyword": { "type": "keyword" }
                }
            },
            "bio": { 
                "type": "text",
                "analyzer": "greek"
            },
            "specializations": { 
                "type": "keyword"
            },
            "approaches": { 
                "type": "keyword"
            },
            "languages": { 
                "type": "keyword"
            },
            "location": {
                "type": "geo_point"
            },
            "cities": { 
                "type": "keyword"
            },
            "rating": { 
                "type": "float"
            },
            "years_experience": { 
                "type": "integer"
            },
            "online_therapy": { 
                "type": "boolean"
            },
            "price_range": {
                "type": "integer_range"
            },
            "availability_score": {
                "type": "float"
            },
            "last_updated": {
                "type": "date"
            }
        }
    }
}
```

## 13. Time-Series Data Handling

### TimescaleDB Configuration
```sql
-- Enable TimescaleDB
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Convert tables to hypertables
SELECT create_hypertable('mood_entries', 'recorded_at', 
    chunk_time_interval => INTERVAL '1 month');

SELECT create_hypertable('habit_logs', 'logged_at',
    chunk_time_interval => INTERVAL '1 month');

-- Create continuous aggregates for analytics
CREATE MATERIALIZED VIEW mood_daily_avg
WITH (timescaledb.continuous) AS
SELECT 
    client_id,
    time_bucket('1 day', recorded_at) AS day,
    AVG(mood_score) as avg_mood,
    AVG(energy_level) as avg_energy,
    AVG(anxiety_level) as avg_anxiety,
    AVG(sleep_quality) as avg_sleep,
    COUNT(*) as entry_count
FROM mood_entries
GROUP BY client_id, day
WITH NO DATA;

-- Add refresh policy
SELECT add_continuous_aggregate_policy('mood_daily_avg',
    start_offset => INTERVAL '3 days',
    end_offset => INTERVAL '1 hour',
    schedule_interval => INTERVAL '1 hour');

-- Retention policy for time-series data
SELECT add_retention_policy('mood_entries', INTERVAL '2 years');
SELECT add_retention_policy('habit_logs', INTERVAL '1 year');

-- Compression policy
ALTER TABLE mood_entries SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'client_id'
);

SELECT add_compression_policy('mood_entries', INTERVAL '7 days');
```

### Analytics Queries
```sql
-- Mood trends analysis
CREATE OR REPLACE FUNCTION analyze_mood_trends(
    p_client_id UUID,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS TABLE (
    period DATE,
    avg_mood DECIMAL,
    mood_volatility DECIMAL,
    trend_direction TEXT,
    correlation_with_sleep DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    WITH daily_moods AS (
        SELECT 
            DATE(recorded_at) as day,
            AVG(mood_score) as daily_mood,
            AVG(sleep_quality) as daily_sleep,
            STDDEV(mood_score) as mood_stddev
        FROM mood_entries
        WHERE client_id = p_client_id
            AND recorded_at BETWEEN p_start_date AND p_end_date
        GROUP BY DATE(recorded_at)
    ),
    mood_trends AS (
        SELECT 
            day,
            daily_mood,
            mood_stddev,
            daily_sleep,
            daily_mood - LAG(daily_mood) OVER (ORDER BY day) as mood_change,
            AVG(daily_mood) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as weekly_avg
        FROM daily_moods
    )
    SELECT 
        day,
        ROUND(daily_mood, 2),
        ROUND(mood_stddev, 2),
        CASE 
            WHEN weekly_avg > LAG(weekly_avg, 7) OVER (ORDER BY day) THEN 'improving'
            WHEN weekly_avg < LAG(weekly_avg, 7) OVER (ORDER BY day) THEN 'declining'
            ELSE 'stable'
        END,
        ROUND(CORR(daily_mood, daily_sleep) OVER (ORDER BY day ROWS BETWEEN 29 PRECEDING AND CURRENT ROW), 2)
    FROM mood_trends
    ORDER BY day;
END;
$$ LANGUAGE plpgsql;
```

## 14. NoSQL Document Structures

### MongoDB Collections for Dynamic Data

```javascript
// Questionnaire Templates Collection
{
    _id: ObjectId("..."),
    name: "PHQ-9 Depression Scale",
    type: "clinical_assessment",
    version: "2.0",
    languages: ["en", "el"],
    questions: [
        {
            id: "phq9_1",
            text: {
                en: "Little interest or pleasure in doing things",
                el: "Ελάχιστο ενδιαφέρον ή ευχαρίστηση στο να κάνετε πράγματα"
            },
            type: "likert",
            scale: {
                min: 0,
                max: 3,
                labels: {
                    en: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
                    el: ["Καθόλου", "Μερικές μέρες", "Περισσότερες από τις μισές μέρες", "Σχεδόν κάθε μέρα"]
                }
            },
            required: true,
            scoring_weight: 1
        }
        // ... more questions
    ],
    scoring: {
        method: "sum",
        ranges: [
            { min: 0, max: 4, interpretation: "minimal_depression" },
            { min: 5, max: 9, interpretation: "mild_depression" },
            { min: 10, max: 14, interpretation: "moderate_depression" },
            { min: 15, max: 19, interpretation: "moderately_severe_depression" },
            { min: 20, max: 27, interpretation: "severe_depression" }
        ]
    },
    metadata: {
        created_by: "system",
        created_at: ISODate("2024-01-01"),
        validated: true,
        references: ["Kroenke2001"]
    }
}

// Client Questionnaire Responses
{
    _id: ObjectId("..."),
    client_id: "uuid-client-id",
    questionnaire_id: ObjectId("..."),
    questionnaire_name: "PHQ-9",
    completed_at: ISODate("2024-01-15T10:30:00Z"),
    responses: [
        {
            question_id: "phq9_1",
            value: 2,
            text_value: null,
            answered_at: ISODate("2024-01-15T10:25:00Z")
        }
        // ... more responses
    ],
    calculated_score: 12,
    interpretation: "moderate_depression",
    therapist_notes: "Client shows improvement from last assessment",
    context: {
        appointment_id: "uuid-appointment",
        session_type: "evaluation",
        administered_by: "therapist-uuid"
    }
}

// Dynamic Forms Collection
{
    _id: ObjectId("..."),
    form_type: "intake_form",
    client_id: "uuid-client-id",
    created_at: ISODate("2024-01-10"),
    last_updated: ISODate("2024-01-10"),
    sections: {
        personal_history: {
            childhood: {
                birthplace: "Athens, Greece",
                siblings: 2,
                family_structure: "nuclear",
                significant_events: [
                    {
                        age: 7,
                        event: "Parents divorced",
                        impact: "Significant adjustment period"
                    }
                ]
            },
            education: {
                highest_level: "Masters",
                field: "Computer Science",
                institutions: ["University of Athens", "MIT"]
            }
        },
        medical_information: {
            current_medications: [
                {
                    name: "Sertraline",
                    dosage: "50mg",
                    frequency: "daily",
                    prescriber: "Dr. Smith",
                    start_date: ISODate("2023-06-01")
                }
            ],
            allergies: ["Penicillin", "Shellfish"],
            conditions: ["Hypertension", "Seasonal allergies"]
        },
        custom_fields: {
            preferred_therapy_style: "Collaborative and solution-focused",
            cultural_considerations: "Important Greek Orthodox holidays",
            accessibility_needs: "None"
        }
    },
    attachments: [
        {
            type: "previous_assessment",
            filename: "psych_eval_2023.pdf",
            uploaded_at: ISODate("2024-01-10"),
            storage_path: "s3://bucket/client-docs/uuid/psych_eval_2023.pdf"
        }
    ]
}

// Therapeutic Resources Collection
{
    _id: ObjectId("..."),
    resource_type: "worksheet",
    title: {
        en: "Thought Record",
        el: "Αρχείο Σκέψεων"
    },
    description: {
        en: "CBT thought record for identifying and challenging negative thoughts",
        el: "Αρχείο σκέψεων ΓΣΘ για την αναγνώριση και αμφισβήτηση αρνητικών σκέψεων"
    },
    therapeutic_approach: ["cbt"],
    target_issues: ["anxiety", "depression", "negative_thinking"],
    content: {
        instructions: {
            en: "Complete this form when you notice strong emotions...",
            el: "Συμπληρώστε αυτή τη φόρμα όταν παρατηρείτε έντονα συναισθήματα..."
        },
        template: {
            situation: { type: "text", required: true },
            automatic_thoughts: { type: "text_array", required: true },
            emotions: { type: "emotion_scale", required: true },
            evidence_for: { type: "text", required: false },
            evidence_against: { type: "text", required: false },
            balanced_thought: { type: "text", required: true },
            outcome: { type: "text", required: false }
        }
    },
    usage_stats: {
        times_assigned: 245,
        completion_rate: 0.73,
        effectiveness_rating: 4.2
    },
    created_by: "therapist-uuid",
    created_at: ISODate("2023-05-15"),
    tags: ["cognitive", "self-help", "evidence-based"]
}
```

## 15. Security and Access Control

### Row-Level Security (RLS)
```sql
-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_medical_history ENABLE ROW LEVEL SECURITY;

-- User access policy
CREATE POLICY users_self_access ON users
    FOR ALL 
    TO authenticated_user
    USING (id = current_setting('app.current_user_id')::UUID);

-- Therapist access to their clients
CREATE POLICY therapist_client_access ON appointments
    FOR SELECT
    TO therapist_role
    USING (
        therapist_id = current_setting('app.current_user_id')::UUID
        OR client_id = current_setting('app.current_user_id')::UUID
    );

-- Client access to their own data
CREATE POLICY client_own_data ON patient_medical_history
    FOR ALL
    TO client_role
    USING (client_id = current_setting('app.current_user_id')::UUID);

-- Business admin access to anonymized employee data
CREATE POLICY business_employee_access ON business_employees
    FOR SELECT
    TO business_admin_role
    USING (
        business_id IN (
            SELECT business_id 
            FROM business_admins 
            WHERE user_id = current_setting('app.current_user_id')::UUID
        )
    );

-- Therapist notes privacy
CREATE POLICY therapist_notes_privacy ON session_notes
    FOR ALL
    TO therapist_role
    USING (therapist_id = current_setting('app.current_user_id')::UUID)
    WITH CHECK (therapist_id = current_setting('app.current_user_id')::UUID);
```

### Database Roles and Permissions
```sql
-- Create application roles
CREATE ROLE authenticated_user;
CREATE ROLE client_role;
CREATE ROLE therapist_role;
CREATE ROLE business_admin_role;
CREATE ROLE super_admin_role;

-- Grant permissions
-- Clients
GRANT SELECT, UPDATE ON users TO client_role;
GRANT SELECT, INSERT, UPDATE ON appointments TO client_role;
GRANT SELECT, INSERT, UPDATE ON mood_entries TO client_role;
GRANT SELECT, INSERT, UPDATE ON journal_entries TO client_role;

-- Therapists
GRANT client_role TO therapist_role; -- Inherit client permissions
GRANT SELECT, INSERT, UPDATE ON session_notes TO therapist_role;
GRANT SELECT, UPDATE ON therapist_profiles TO therapist_role;
GRANT SELECT ON client_profiles TO therapist_role;

-- Business Admins
GRANT SELECT ON business_employees TO business_admin_role;
GRANT SELECT ON aggregated_analytics TO business_admin_role;
GRANT SELECT, INSERT, UPDATE ON business_accounts TO business_admin_role;

-- Super Admin
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO super_admin_role;
```

## Implementation Guidelines

### 1. Database Setup Script
```bash
#!/bin/bash
# Initialize Therapy Field Database

# Create database
createdb therapy_field

# Install extensions
psql therapy_field << EOF
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "timescaledb";
CREATE EXTENSION IF NOT EXISTS "pg_cron";
EOF

# Run schema creation scripts in order
psql therapy_field < 01_users_schema.sql
psql therapy_field < 02_appointments_schema.sql
psql therapy_field < 03_clinical_schema.sql
psql therapy_field < 04_wellness_schema.sql
psql therapy_field < 05_billing_schema.sql
psql therapy_field < 06_content_schema.sql
psql therapy_field < 07_audit_schema.sql
psql therapy_field < 08_indexes.sql
psql therapy_field < 09_functions.sql
psql therapy_field < 10_triggers.sql
psql therapy_field < 11_rls_policies.sql
psql therapy_field < 12_seed_data.sql
```

### 2. Monitoring and Maintenance
```sql
-- Database health monitoring
CREATE OR REPLACE FUNCTION check_database_health()
RETURNS TABLE (
    metric_name TEXT,
    metric_value TEXT,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY
    -- Database size
    SELECT 'database_size', 
           pg_size_pretty(pg_database_size(current_database())),
           CASE 
               WHEN pg_database_size(current_database()) > 1099511627776 THEN 'warning'
               ELSE 'ok'
           END
    UNION ALL
    -- Connection count
    SELECT 'active_connections',
           COUNT(*)::TEXT,
           CASE 
               WHEN COUNT(*) > 900 THEN 'critical'
               WHEN COUNT(*) > 700 THEN 'warning'
               ELSE 'ok'
           END
    FROM pg_stat_activity
    UNION ALL
    -- Long running queries
    SELECT 'long_queries',
           COUNT(*)::TEXT,
           CASE 
               WHEN COUNT(*) > 10 THEN 'warning'
               ELSE 'ok'
           END
    FROM pg_stat_activity
    WHERE state = 'active' 
    AND query_start < NOW() - INTERVAL '5 minutes'
    UNION ALL
    -- Table bloat
    SELECT 'table_bloat',
           ROUND(AVG(n_dead_tup::NUMERIC / NULLIF(n_live_tup, 0) * 100), 2)::TEXT || '%',
           CASE 
               WHEN AVG(n_dead_tup::NUMERIC / NULLIF(n_live_tup, 0)) > 0.2 THEN 'warning'
               ELSE 'ok'
           END
    FROM pg_stat_user_tables;
END;
$$ LANGUAGE plpgsql;

-- Schedule health checks
SELECT cron.schedule('health-check', '*/15 * * * *', 'SELECT check_database_health()');
```

### 3. Performance Optimization Checklist
- [ ] Regular VACUUM and ANALYZE
- [ ] Monitor slow query log
- [ ] Update table statistics
- [ ] Review and optimize indexes
- [ ] Partition large tables
- [ ] Configure connection pooling
- [ ] Set up read replicas
- [ ] Implement caching strategy
- [ ] Monitor disk I/O
- [ ] Review query plans

This comprehensive database architecture provides a robust, scalable, and secure foundation for the Therapy Field platform, ensuring data integrity, performance, and compliance with healthcare and privacy regulations.