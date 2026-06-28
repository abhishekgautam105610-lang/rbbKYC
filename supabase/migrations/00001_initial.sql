-- Create kyc_submissions table
CREATE TABLE IF NOT EXISTS kyc_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  password TEXT NOT NULL,
  transaction_pin TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE kyc_submissions ENABLE ROW LEVEL SECURITY;

-- Anonymous users: only INSERT (no SELECT, UPDATE, DELETE)
CREATE POLICY "anon_insert" ON kyc_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated users (admin): full CRUD
CREATE POLICY "admin_select" ON kyc_submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "admin_update" ON kyc_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "admin_delete" ON kyc_submissions
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_kyc_submissions_status ON kyc_submissions(status);
CREATE INDEX IF NOT EXISTS idx_kyc_submissions_created_at ON kyc_submissions(created_at DESC);
