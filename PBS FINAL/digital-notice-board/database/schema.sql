-- Digital Notice Board Database Schema for Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Notices Table
CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Academic', 'Events', 'Sports', 'General', 'Urgent')),
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL DEFAULT 'Admin',
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster category and pinned queries
CREATE INDEX IF NOT EXISTS idx_notices_category ON notices(category);
CREATE INDEX IF NOT EXISTS idx_notices_pinned ON notices(is_pinned);

-- Row Level Security (RLS) Policies
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- Allow public read access (Anyone can view notices)
CREATE POLICY "Public notices are viewable by everyone" 
ON notices FOR SELECT 
USING (true);

-- Allow anon insert access (For educational demo purposes)
CREATE POLICY "Anyone can insert notices" 
ON notices FOR INSERT 
WITH CHECK (true);

-- Allow anon update access
CREATE POLICY "Anyone can update notices" 
ON notices FOR UPDATE 
USING (true);

-- Allow anon delete access
CREATE POLICY "Anyone can delete notices" 
ON notices FOR DELETE 
USING (true);

-- Sample Data Injection
INSERT INTO notices (title, category, content, author, is_pinned) VALUES
('Mid-Semester Exam Schedule Announced', 'Academic', 'The mid-semester examination schedule for Fall 2026 has been published. Please check the student portal for detailed subject-wise timelines.', 'Academic Cell', true),
('Annual Sports Meet 2026', 'Sports', 'Registration for the Annual Sports Meet is now open! Events include Track & Field, Football, Cricket, and Basketball. Register at the sports complex.', 'Sports Club', false),
('Hackathon 2026: Code for Future', 'Events', 'Join us for a 24-hour hackathon on Nov 15th. Exciting cash prizes and mentorship opportunities available for all participating teams.', 'Tech Club', true),
('Library Timings Update', 'General', 'The central library will remain open until 11:00 PM during exam weeks starting next Monday.', 'Library Admin', false);
