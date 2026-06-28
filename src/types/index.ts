export interface KycSubmission {
  id: string;
  full_name: string;
  date_of_birth: string;
  mobile_number: string;
  password: string;
  transaction_pin: string;
  status: "Pending" | "Approved" | "Rejected";
  created_at: string;
}

export interface KycFormData {
  fullName: string;
  dateOfBirth: string;
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
