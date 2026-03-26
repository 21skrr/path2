-- PostgreSQL Database Setup for HR Platform
-- Run with: psql -U postgres -f database_setup.sql

-- Create database (run separately or via psql)
-- CREATE DATABASE hrplatform;
-- \c hrplatform

-- Custom ENUM types
CREATE TYPE user_role AS ENUM ('ADMIN', 'MEMBER');
CREATE TYPE membership_status AS ENUM ('FREE', 'PENDING', 'PREMIUM');
CREATE TYPE article_category AS ENUM ('NEWS', 'NOMINATION', 'ARTICLE');
CREATE TYPE resource_category AS ENUM ('LEGAL', 'TEMPLATE', 'ONBOARDING');
CREATE TYPE payment_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- Users table
CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'MEMBER',
    membership_status membership_status DEFAULT 'FREE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profiles table
CREATE TABLE profiles (
    user_id BIGINT PRIMARY KEY,
    job_title VARCHAR(255),
    company VARCHAR(255),
    city VARCHAR(255),
    bio TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Articles table
CREATE TABLE articles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    category article_category NOT NULL,
    image_url VARCHAR(500),
    is_premium BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_is_premium ON articles(is_premium);
CREATE INDEX idx_articles_published_at ON articles(published_at);

-- Resources table
CREATE TABLE resources (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    category resource_category NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_is_premium ON resources(is_premium);

-- Membership Plans table
CREATE TABLE membership_plans (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price_mad DECIMAL(10, 2) NOT NULL,
    description TEXT,
    billing_period VARCHAR(50)
);

-- Payment Submissions table
CREATE TABLE payment_submissions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,
    plan_id BIGINT NOT NULL,
    transaction_reference VARCHAR(255) UNIQUE NOT NULL,
    receipt_image_url VARCHAR(500),
    status payment_status DEFAULT 'PENDING',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    review_notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (plan_id) REFERENCES membership_plans(id)
);

CREATE INDEX idx_payments_status ON payment_submissions(status);
CREATE INDEX idx_payments_user_id ON payment_submissions(user_id);
CREATE INDEX idx_payments_submitted_at ON payment_submissions(submitted_at);

-- Insert sample membership plans
INSERT INTO membership_plans (name, price_mad, description, billing_period) VALUES
('Plan Mensuel', 99.00, 'Accès complet pendant un mois', 'MONTHLY'),
('Plan Annuel', 999.00, 'Accès complet pendant une année', 'ANNUAL');

-- Insert sample articles
INSERT INTO articles (title, content, category, is_premium, published_at) VALUES
('Tendances RH 2026', 'Les principales tendances en gestion des ressources humaines pour 2026...', 'NEWS', FALSE, NOW()),
('Nomination: Dr. Ahmed Hassan', 'Le Dr. Ahmed Hassan a été nommé Directeur RH chez TechCorp Morocco...', 'NOMINATION', FALSE, NOW()),
('Entretien Exclusif', 'Découvrez les secrets du succès avec nos experts RH...', 'ARTICLE', FALSE, NOW());

-- Insert sample resources
INSERT INTO resources (title, file_url, category, is_premium) VALUES
('Contrat de Travail Standard', 'https://documents.example.com/contrat.pdf', 'LEGAL', FALSE),
('Modèle Fiche de Poste', 'https://documents.example.com/fiche-poste.docx', 'TEMPLATE', FALSE),
('Guide Onboarding DayOne', 'https://documents.example.com/dayone-guide.pdf', 'ONBOARDING', TRUE);

-- Insert sample admin user
INSERT INTO users (name, email, password_hash, role, membership_status) VALUES
('Admin User', 'admin@hrplatform.ma', 'hashed_password_123', 'ADMIN', 'PREMIUM');
