-- Database Schema for Token Data
-- This file contains the SQL commands to create the required table in Supabase

CREATE TABLE IF NOT EXISTS "SaveTokenInfo" (
    id SERIAL PRIMARY KEY,
    recipient VARCHAR(255) NOT NULL,
    "tokenURI" TEXT NOT NULL,
    "tokenId" VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on recipient for faster queries
CREATE INDEX IF NOT EXISTS idx_SaveTokenInfo_recipient ON "SaveTokenInfo"(recipient);

-- Create an index on token_id for faster queries
CREATE INDEX IF NOT EXISTS idx_SaveTokenInfo_token_id ON "SaveTokenInfo"("tokenId");

-- Optional: Create a unique constraint if token_id should be unique
-- ALTER TABLE "SaveTokenInfo" ADD CONSTRAINT unique_token_id UNIQUE ("tokenId");

-- Enable Row Level Security (optional, for better security)
-- ALTER TABLE "SaveTokenInfo" ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users (optional)
-- CREATE POLICY "Enable all operations for authenticated users" ON "SaveTokenInfo"
--     FOR ALL USING (auth.role() = 'authenticated');