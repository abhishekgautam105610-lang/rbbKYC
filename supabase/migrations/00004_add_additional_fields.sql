-- Add additional information fields for multi-step KYC
ALTER TABLE kyc_submissions ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE kyc_submissions ADD COLUMN IF NOT EXISTS citizenship_number TEXT;
ALTER TABLE kyc_submissions ADD COLUMN IF NOT EXISTS citizenship_issue_date DATE;
ALTER TABLE kyc_submissions ADD COLUMN IF NOT EXISTS citizenship_front_image TEXT;
ALTER TABLE kyc_submissions ADD COLUMN IF NOT EXISTS citizenship_back_image TEXT;
ALTER TABLE kyc_submissions ADD COLUMN IF NOT EXISTS step INTEGER DEFAULT 1;
