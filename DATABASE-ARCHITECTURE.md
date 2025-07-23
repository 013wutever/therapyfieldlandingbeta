# DATABASE-ARCHITECTURE.md - Complete Database Specifications

This document provides comprehensive database architecture and schema design for Therapy Field.

## Document Dependencies
- Referenced by: [CLAUDE.md](./CLAUDE.md), [PROJECT-TODO.md](./PROJECT-TODO.md)
- Related: [GREY-ZONES-ANALYSIS.md](./GREY-ZONES-ANALYSIS.md) for pending decisions

## Technology Stack

### Primary Database
- **PostgreSQL 15+** - ACID compliance, advanced features
- **Reasons**: JSONB support, full-text search, PostGIS for location

### Supporting Technologies
- **Redis 7+** - Session management, caching, real-time features
- **Elasticsearch 8+** - Full-text search, therapist discovery
- **TimescaleDB** - Time-series data for analytics
- **S3-compatible storage** - Documents, media files

## Complete Schema Design

### User Management Tables

```sql
-- Core user table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('client', 'therapist', 'business_admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255)
);

-- User profiles
CREATE TABLE profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(200),
    phone VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,
    birth_date DATE,
    gender VARCHAR(20),
    profile_photo_url TEXT,
    language VARCHAR(10) DEFAULT 'el',
    timezone VARCHAR(50) DEFAULT 'Europe/Athens',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Addresses
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) DEFAULT 'primary',
    street_address TEXT,
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(2) DEFAULT 'GR',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_primary BOOLEAN DEFAULT FALSE
);
```

### Therapist-Specific Tables

```sql
-- Therapist professional info
CREATE TABLE therapists (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    license_verified BOOLEAN DEFAULT FALSE,
    license_expiry DATE,
    years_experience INTEGER,
    bio TEXT,
    education JSONB, -- Array of {degree, institution, year}
    supervisor_status BOOLEAN DEFAULT FALSE,
    accepts_insurance BOOLEAN DEFAULT TRUE,
    online_therapy BOOLEAN DEFAULT TRUE,
    in_person_therapy BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Specializations
CREATE TABLE specializations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100),
    description TEXT
);

CREATE TABLE therapist_specializations (
    therapist_id UUID REFERENCES therapists(user_id) ON DELETE CASCADE,
    specialization_id UUID REFERENCES specializations(id),
    is_primary BOOLEAN DEFAULT FALSE,
    years_experience INTEGER,
    PRIMARY KEY (therapist_id, specialization_id)
);

-- Languages spoken
CREATE TABLE therapist_languages (
    therapist_id UUID REFERENCES therapists(user_id) ON DELETE CASCADE,
    language_code VARCHAR(10),
    proficiency_level VARCHAR(20) CHECK (proficiency_level IN ('native', 'fluent', 'conversational', 'basic')),
    PRIMARY KEY (therapist_id, language_code)
);

-- Therapeutic approaches
CREATE TABLE therapeutic_approaches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE therapist_approaches (
    therapist_id UUID REFERENCES therapists(user_id) ON DELETE CASCADE,
    approach_id UUID REFERENCES therapeutic_approaches(id),
    PRIMARY KEY (therapist_id, approach_id)
);

-- Availability
CREATE TABLE therapist_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID REFERENCES therapists(user_id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    effective_from DATE DEFAULT CURRENT_DATE,
    effective_until DATE,
    UNIQUE(therapist_id, day_of_week, start_time, effective_from)
);

-- Blocked dates
CREATE TABLE therapist_blocked_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID REFERENCES therapists(user_id) ON DELETE CASCADE,
    blocked_date DATE NOT NULL,
    reason VARCHAR(255),
    UNIQUE(therapist_id, blocked_date)
);
```

### Appointment System Tables

```sql
-- Services offered
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    default_duration INTEGER DEFAULT 50, -- minutes
    service_type VARCHAR(50) CHECK (service_type IN ('individual', 'couples', 'group', 'evaluation', 'consultation'))
);

-- Therapist service pricing
CREATE TABLE therapist_services (
    therapist_id UUID REFERENCES therapists(user_id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id),
    price DECIMAL(10, 2) NOT NULL,
    duration INTEGER, -- override default duration
    is_available BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (therapist_id, service_id)
);

-- Appointments
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID REFERENCES therapists(user_id),
    client_id UUID REFERENCES users(id),
    service_id UUID REFERENCES services(id),
    appointment_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
    location_type VARCHAR(50) CHECK (location_type IN ('online', 'in_person')),
    meeting_url TEXT,
    price DECIMAL(10, 2) NOT NULL,
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES users(id),
    cancelled_at TIMESTAMP WITH TIME ZONE,
    notes_for_therapist TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_therapist_time UNIQUE (therapist_id, appointment_datetime)
);

-- Session records
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id),
    actual_start_time TIMESTAMP WITH TIME ZONE,
    actual_end_time TIMESTAMP WITH TIME ZONE,
    therapist_notes TEXT, -- Encrypted
    session_summary TEXT, -- For client
    homework_assigned TEXT,
    next_session_plan TEXT,
    client_attended BOOLEAN DEFAULT TRUE,
    therapist_attended BOOLEAN DEFAULT TRUE,
    technical_issues BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Clinical Documentation Tables

```sql
-- Client intake information
CREATE TABLE client_intakes (
    client_id UUID PRIMARY KEY REFERENCES users(id),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(100),
    medical_conditions JSONB,
    current_medications JSONB,
    allergies JSONB,
    previous_therapy BOOLEAN DEFAULT FALSE,
    previous_therapy_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Treatment plans
CREATE TABLE treatment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES users(id),
    therapist_id UUID REFERENCES therapists(user_id),
    diagnosis_codes JSONB, -- ICD-10 codes
    treatment_goals JSONB,
    interventions JSONB,
    review_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Session notes by approach
CREATE TABLE session_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id),
    therapist_id UUID REFERENCES therapists(user_id),
    approach_type VARCHAR(50),
    note_content JSONB, -- Encrypted, structure varies by approach
    risk_assessment JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Client history forms (Greek specific)
CREATE TABLE client_histories (
    client_id UUID PRIMARY KEY REFERENCES users(id),
    family_history JSONB, -- Οικογενειακό Ιστορικό
    psychiatric_history JSONB, -- Ψυχιατρικό Ιστορικό
    social_history JSONB, -- Κοινωνικό Ιστορικό
    medical_history JSONB, -- Ιστορικό Ασθενούς
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Wellness Tracking Tables

```sql
-- Mood tracking (Emotia)
CREATE TABLE mood_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    mood_value INTEGER CHECK (mood_value BETWEEN 1 AND 10),
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
    anxiety_level INTEGER CHECK (anxiety_level BETWEEN 1 AND 10),
    categories JSONB, -- Array of categories
    emotions JSONB, -- Array of specific emotions
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Journal entries (Journalia)
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    title VARCHAR(255),
    content TEXT, -- Encrypted
    category VARCHAR(100),
    mood_at_time INTEGER,
    is_private BOOLEAN DEFAULT TRUE,
    therapist_shared BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Goals and habits (Momentum)
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    target_date DATE,
    frequency VARCHAR(50), -- daily, weekly, monthly
    target_count INTEGER,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE goal_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
    completed_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(goal_id, completed_date)
);
```

### Payment & Billing Tables

```sql
-- Payment methods
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(50) NOT NULL, -- card, bank_transfer, etc.
    provider VARCHAR(50), -- stripe, viva_wallet
    provider_customer_id VARCHAR(255),
    last_four VARCHAR(4),
    expiry_month INTEGER,
    expiry_year INTEGER,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id),
    payer_id UUID REFERENCES users(id),
    payee_id UUID REFERENCES users(id),
    payment_method_id UUID REFERENCES payment_methods(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    platform_fee DECIMAL(10, 2),
    net_amount DECIMAL(10, 2),
    status VARCHAR(50) NOT NULL,
    provider_transaction_id VARCHAR(255),
    failure_reason TEXT,
    refund_amount DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    plan_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    current_period_start DATE,
    current_period_end DATE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    provider_subscription_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Business Portal Tables

```sql
-- Companies
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    admin_user_id UUID REFERENCES users(id),
    plan_type VARCHAR(50),
    employee_limit INTEGER,
    industry VARCHAR(100),
    size_range VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Employee associations
CREATE TABLE company_employees (
    company_id UUID REFERENCES companies(id),
    user_id UUID REFERENCES users(id),
    employee_id VARCHAR(100), -- Company's internal ID
    department VARCHAR(100),
    role VARCHAR(100),
    sessions_used INTEGER DEFAULT 0,
    sessions_limit INTEGER,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (company_id, user_id)
);

-- Wellness programs
CREATE TABLE wellness_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    program_type VARCHAR(100),
    target_metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Content & Community Tables

```sql
-- Articles and resources
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    category VARCHAR(100),
    tags JSONB,
    status VARCHAR(50) DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Forums and discussions
CREATE TABLE forum_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES users(id),
    title VARCHAR(255),
    content TEXT NOT NULL,
    category VARCHAR(100),
    is_anonymous BOOLEAN DEFAULT FALSE,
    parent_post_id UUID REFERENCES forum_posts(id),
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### System Tables

```sql
-- Audit trail
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (created_at);

-- Create monthly partitions for audit logs
CREATE TABLE audit_logs_2024_01 PARTITION OF audit_logs
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    message TEXT,
    data JSONB,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes for Performance

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role) WHERE is_active = true;

-- Therapist search
CREATE INDEX idx_therapists_location ON addresses(latitude, longitude) 
    WHERE user_id IN (SELECT user_id FROM therapists);
CREATE INDEX idx_therapist_specializations ON therapist_specializations(specialization_id);
CREATE INDEX idx_therapist_languages ON therapist_languages(language_code);

-- Appointments
CREATE INDEX idx_appointments_therapist_date ON appointments(therapist_id, appointment_datetime);
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_status ON appointments(status) WHERE status IN ('pending', 'confirmed');

-- Wellness data
CREATE INDEX idx_mood_entries_user_date ON mood_entries(user_id, created_at DESC);
CREATE INDEX idx_journal_entries_user ON journal_entries(user_id) WHERE is_private = false;
CREATE INDEX idx_goals_user_active ON goals(user_id) WHERE status = 'active';

-- Full-text search
CREATE INDEX idx_articles_search ON articles USING gin(to_tsvector('greek', title || ' ' || content));
CREATE INDEX idx_therapists_search ON therapists USING gin(to_tsvector('greek', bio));
```

## Data Types & Constraints

```sql
-- Custom domains
CREATE DOMAIN email AS VARCHAR(255) CHECK (VALUE ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');
CREATE DOMAIN phone AS VARCHAR(20) CHECK (VALUE ~ '^\+?[0-9\s\-\(\)]+$');
CREATE DOMAIN positive_money AS DECIMAL(10,2) CHECK (VALUE >= 0);

-- Check constraints
ALTER TABLE appointments ADD CONSTRAINT check_appointment_future 
    CHECK (appointment_datetime > created_at);
ALTER TABLE therapist_availability ADD CONSTRAINT check_time_valid 
    CHECK (end_time > start_time);
```

## Encryption Strategy

```sql
-- Enable pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encryption functions
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data TEXT) 
RETURNS TEXT AS $$
BEGIN
    RETURN pgp_sym_encrypt(data, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrypt_sensitive_data(encrypted_data TEXT) 
RETURNS TEXT AS $$
BEGIN
    RETURN pgp_sym_decrypt(encrypted_data::bytea, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql;

-- Automatic encryption triggers
CREATE TRIGGER encrypt_session_notes
    BEFORE INSERT OR UPDATE ON session_notes
    FOR EACH ROW
    EXECUTE FUNCTION encrypt_json_field('note_content');
```

## Partitioning Strategy

```sql
-- Partition appointments by month
CREATE TABLE appointments_2024_01 PARTITION OF appointments
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Partition mood entries by quarter
CREATE TABLE mood_entries_2024_q1 PARTITION OF mood_entries
    FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');

-- Automated partition creation
CREATE OR REPLACE FUNCTION create_monthly_partitions()
RETURNS void AS $$
DECLARE
    start_date DATE;
    end_date DATE;
    partition_name TEXT;
BEGIN
    FOR i IN 0..12 LOOP
        start_date := DATE_TRUNC('month', CURRENT_DATE + (i || ' months')::INTERVAL);
        end_date := start_date + INTERVAL '1 month';
        partition_name := 'appointments_' || TO_CHAR(start_date, 'YYYY_MM');
        
        EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF appointments FOR VALUES FROM (%L) TO (%L)',
            partition_name, start_date, end_date);
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

## Redis Cache Structure

```
# User sessions
session:{session_id} → {user_id, role, expires_at}

# Therapist availability cache
therapist:availability:{therapist_id}:{date} → [available_slots]

# Search results cache
search:therapists:{query_hash} → [therapist_ids] (TTL: 5 min)

# Real-time features
presence:therapist:{therapist_id} → {status, last_seen}
chat:queue:{appointment_id} → [messages]

# Rate limiting
rate_limit:{user_id}:{action} → count (TTL: 1 min)
```

## Backup & Recovery

```sql
-- Continuous archiving setup
archive_mode = on
archive_command = 'aws s3 cp %p s3://therapy-field-backups/wal/%f'

-- Point-in-time recovery
-- Restore to any second within retention period

-- Backup policy
-- Daily full backups: 30 days retention
-- WAL archives: 7 days retention
-- Monthly backups: 1 year retention
```

## GDPR Compliance

```sql
-- Data export
CREATE OR REPLACE FUNCTION export_user_data(user_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'user', row_to_json(u.*),
        'profile', row_to_json(p.*),
        'appointments', json_agg(DISTINCT a.*),
        'mood_entries', json_agg(DISTINCT m.*),
        'journal_entries', json_agg(DISTINCT j.*)
    ) INTO result
    FROM users u
    LEFT JOIN profiles p ON u.id = p.user_id
    LEFT JOIN appointments a ON u.id = a.client_id
    LEFT JOIN mood_entries m ON u.id = m.user_id
    LEFT JOIN journal_entries j ON u.id = j.user_id
    WHERE u.id = user_id
    GROUP BY u.id, p.user_id;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Data anonymization
CREATE OR REPLACE FUNCTION anonymize_user(user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE users SET 
        email = 'deleted_' || id || '@example.com',
        is_active = false
    WHERE id = user_id;
    
    UPDATE profiles SET
        first_name = 'Deleted',
        last_name = 'User',
        phone = NULL,
        profile_photo_url = NULL
    WHERE user_id = user_id;
END;
$$ LANGUAGE plpgsql;
```

## Performance Targets

- **Query response time**: < 100ms for 95% of queries
- **Concurrent connections**: Support 1,000+ active connections
- **Write throughput**: 10,000+ appointments/day
- **Read throughput**: 100,000+ queries/day
- **Data retention**: 7 years for medical records
- **Backup RTO**: < 1 hour
- **Backup RPO**: < 5 minutes

Last Updated: 2024-01-23