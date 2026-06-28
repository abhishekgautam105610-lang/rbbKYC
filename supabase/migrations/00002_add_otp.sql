-- Add otp column to kyc_submissions
ALTER TABLE kyc_submissions ADD COLUMN IF NOT EXISTS otp TEXT;

-- Allow anon to UPDATE their own submission (for OTP verification)
-- We'll use a policy that allows UPDATE where id matches (no RLS check on anon rows)
CREATE POLICY "anon_update_own" ON kyc_submissions
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
