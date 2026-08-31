-- ============================================================
-- PATH HR Platform - Full Database Reset
-- Run with: psql -U postgres -d hrplatform -f database_full_reset.sql
-- ============================================================

-- Drop all tables (in reverse dependency order)
DROP TABLE IF EXISTS payment_submissions CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS membership_plans CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS membership_status CASCADE;
DROP TYPE IF EXISTS article_category CASCADE;
DROP TYPE IF EXISTS resource_category CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;

-- Re-create Custom ENUM types
CREATE TYPE user_role         AS ENUM ('ADMIN', 'MEMBER');
CREATE TYPE membership_status AS ENUM ('FREE', 'PENDING', 'PREMIUM');
CREATE TYPE article_category  AS ENUM ('ACTUALITE', 'INTERVIEW', 'ETUDE', 'NOMINATION');
CREATE TYPE resource_category AS ENUM ('LEGAL', 'TEMPLATE', 'ONBOARDING');
CREATE TYPE payment_status    AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- Users
CREATE TABLE users (
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name              VARCHAR(255) NOT NULL,
    email             VARCHAR(255) UNIQUE NOT NULL,
    password_hash     VARCHAR(255) NOT NULL,
    role              user_role          DEFAULT 'MEMBER',
    membership_status membership_status  DEFAULT 'FREE',
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profiles
CREATE TABLE profiles (
    user_id   BIGINT PRIMARY KEY,
    job_title VARCHAR(255),
    company   VARCHAR(255),
    city      VARCHAR(255),
    bio       TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Articles (with the new 4 categories)
CREATE TABLE articles (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title        VARCHAR(500) NOT NULL,
    content      TEXT NOT NULL,
    category     article_category NOT NULL,
    image_url    VARCHAR(500),
    is_premium   BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_articles_category     ON articles(category);
CREATE INDEX idx_articles_is_premium   ON articles(is_premium);
CREATE INDEX idx_articles_published_at ON articles(published_at);

-- Jobs
CREATE TABLE jobs (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title      VARCHAR(255) NOT NULL,
    company    VARCHAR(255) NOT NULL,
    location   VARCHAR(255) NOT NULL,
    type       VARCHAR(50)  NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resources
CREATE TABLE resources (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title      VARCHAR(500) NOT NULL,
    file_url   VARCHAR(500) NOT NULL,
    category   resource_category NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_resources_category   ON resources(category);
CREATE INDEX idx_resources_is_premium ON resources(is_premium);

-- Membership Plans
CREATE TABLE membership_plans (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    price_mad      DECIMAL(10, 2) NOT NULL,
    description    TEXT,
    billing_period VARCHAR(50)
);

-- Payment Submissions
CREATE TABLE payment_submissions (
    id                    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id               BIGINT NOT NULL,
    plan_id               BIGINT NOT NULL,
    transaction_reference VARCHAR(255) UNIQUE NOT NULL,
    receipt_image_url     VARCHAR(500),
    status                payment_status DEFAULT 'PENDING',
    submitted_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at           TIMESTAMP,
    review_notes          TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES membership_plans(id)
);

CREATE INDEX idx_payments_status       ON payment_submissions(status);
CREATE INDEX idx_payments_user_id      ON payment_submissions(user_id);
CREATE INDEX idx_payments_submitted_at ON payment_submissions(submitted_at);

-- ─── Seed Data ────────────────────────────────────────────────

-- Admin user (BCrypt of 'admin123' -- update to a real password!)
INSERT INTO users (name, email, password_hash, role, membership_status) VALUES
('Admin PATH', 'admin@hrplatform.ma', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh32', 'ADMIN', 'PREMIUM');

-- Membership plans
INSERT INTO membership_plans (name, price_mad, description, billing_period) VALUES
('Plan Community',     100.00,  'Acces a la communaute WhatsApp et agenda des meetups', 'MONTHLY'),
('Plan Professionnel', 2500.00, 'Tous meetups inclus + Benchmark RH premium',           'MONTHLY'),
('Plan Senior',        4000.00, 'Droits editoriaux complets + publication sur la plateforme', 'MONTHLY');

-- Sample articles using the new categories
INSERT INTO articles (title, content, category, is_premium, published_at) VALUES
('[LIVRE] Augmenting HR Management with AI',
 'Une analyse approfondie de impact de IA sur les pratiques RH modernes au Maroc et en Afrique.',
 'ACTUALITE', FALSE, NOW()),
('[INTERVIEW] Mahja NAIT BARKA, fondatrice de CitizOn',
 'Dans cette interview exclusive, Mahja NAIT BARKA revient sur son parcours entrepreneurial.',
 'INTERVIEW', FALSE, NOW()),
('[ETUDE] Ce que 81 000 personnes attendent vraiment de IA',
 'Une etude mondiale menee aupres de 81 000 professionnels revele les attentes vis-a-vis de IA.',
 'ETUDE', FALSE, NOW()),
('[NOMINATION] Allianz Trade Maroc confie sa direction generale a Francis JESPERS',
 'Francis JESPERS prend la tete Allianz Trade Maroc a compter du 1er avril 2026.',
 'NOMINATION', FALSE, NOW());

-- Sample resources
INSERT INTO resources (title, file_url, category, is_premium) VALUES
('Code du Travail Marocain - Loi 65-99',               'https://documents.example.com/code-travail.pdf',  'LEGAL',      FALSE),
('Loi sur la Protection des Donnees Personnelles 09-08','https://documents.example.com/loi-09-08.pdf',     'LEGAL',      FALSE),
('Decret relatif au teletravail - Circulaire 2022',     'https://documents.example.com/teletravail.pdf',  'LEGAL',      FALSE),
('Modele Fiche de Poste',                               'https://documents.example.com/fiche-poste.docx', 'TEMPLATE',   FALSE),
('Contrat de Travail CDI Standard',                     'https://documents.example.com/contrat-cdi.docx', 'TEMPLATE',   FALSE),
('Guide Onboarding DayOne',                             'https://documents.example.com/dayone-guide.pdf', 'ONBOARDING', TRUE);

-- Sample jobs
INSERT INTO jobs (title, company, location, type) VALUES
('Responsable RH et Paie',            'Groupe OCP',        'Casablanca', 'CDI'),
('HR Business Partner Senior',        'Attijariwafa Bank',  'Rabat',      'CDI'),
('Charge(e) de Recrutement',          'Maroc Telecom',      'Casablanca', 'CDD'),
('Directeur des Ressources Humaines', 'Groupe Akdital',     'Casablanca', 'CDI');
