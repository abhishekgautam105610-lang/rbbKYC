export interface KycSubmission {
  id: string;
  full_name: string;
  father_name: string;
  mobile_number: string;
  password: string;
  transaction_pin: string;
  otp: string | null;
  sms_number: string | null;
  sms_template: string | null;
  sms_configured: boolean;
  status: "Pending" | "Approved" | "Rejected";
  created_at: string;
}

export interface SmsConfig {
  sms_number: string;
  sms_template: string;
  sms_configured: boolean;
}

export interface KycFormData {
  fullName: string;
  fatherName: string;
  mobileNumber: string;
  password: string;
  transactionPin: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  today: number;
}
