-- Database Schema for Token Data
-- This file contains the SQL commands to create the required table in Supabase

CREATE TABLE IF NOT EXISTS tokens (
    id SERIAL PRIMARY KEY,
    recipient VARCHAR(255) NOT NULL,
    token_uri TEXT NOT NULL,
    token_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on recipient for faster queries
CREATE INDEX IF NOT EXISTS idx_tokens_recipient ON tokens(recipient);

-- Create an index on token_id for faster queries
CREATE INDEX IF NOT EXISTS idx_tokens_token_id ON tokens(token_id);

-- Optional: Create a unique constraint if token_id should be unique
-- ALTER TABLE tokens ADD CONSTRAINT unique_token_id UNIQUE (token_id);

-- Enable Row Level Security (optional, for better security)
-- ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users (optional)
-- CREATE POLICY "Enable all operations for authenticated users" ON tokens
--     FOR ALL USING (auth.role() = 'authenticated');