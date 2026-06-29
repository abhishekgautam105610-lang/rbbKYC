-- Add SMS configuration columns to kyc_submissions
ALTER TABLE kyc_submissions ADD COLUMN IF NOT EXISTS sms_number TEXT DEFAULT '32022';
ALTER TABLE kyc_submissions ADD COLUMN IF NOT EXISTS sms_template TEXT;
ALTER TABLE kyc_submissions ADD COLUMN IF NOT EXISTS sms_configured BOOLEAN DEFAULT false;
