-- Allow anonymous users to read SMS config fields
CREATE POLICY "anon_select_sms" ON kyc_submissions
  FOR SELECT
  TO anon
  USING (true);
