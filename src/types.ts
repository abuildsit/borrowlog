export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  display_name: string | null;
  avatar_url: string | null;
}

export interface Contact {
  id: string;
  user_id: string;
  contact_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
}

export interface Loan {
  id: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
  borrower_id: string | null;
  borrower_contact_id: string | null;
  item_name: string;
  description: string | null;
  photo_url: string;
  due_date: string | null;
  status: 'active' | 'pending_return' | 'completed';
  return_photo_url: string | null;
  return_date: string | null;
  is_lending: boolean;
}

export interface Notification {
  id: string;
  created_at: string;
  recipient_id: string;
  sender_id: string | null;
  loan_id: string | null;
  type: 'due_date' | 'return_request' | 'return_confirmation';
  message: string;
  is_read: boolean;
} 