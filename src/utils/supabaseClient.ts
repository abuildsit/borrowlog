import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your actual Supabase URL and anon key in a .env file
// For development purposes only
const TEMP_SUPABASE_URL = 'https://lrttwtftobljizzyzbqb.supabase.co';
const TEMP_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxydHR3dGZ0b2Jsaml6enl6YnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDMxMjgsImV4cCI6MjA2MjY3OTEyOH0.edFdnAPek--hntPFgzPBypaX5_SseVqoMIkcqUIevYQ';

// Use environment variables or fallback to temporary values
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || TEMP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || TEMP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema definition for documentation purposes only
/*
-- PROFILES TABLE
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  display_name TEXT,
  avatar_url TEXT
);

-- CONTACTS TABLE
CREATE TABLE contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  contact_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LOANS TABLE
CREATE TABLE loans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  owner_id UUID REFERENCES profiles(id) NOT NULL,
  borrower_id UUID REFERENCES profiles(id),
  borrower_contact_id UUID REFERENCES contacts(id),
  item_name TEXT NOT NULL,
  description TEXT,
  photo_url TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('active', 'pending_return', 'completed')),
  return_photo_url TEXT,
  return_date TIMESTAMP WITH TIME ZONE,
  is_lending BOOLEAN NOT NULL
);

-- NOTIFICATIONS TABLE
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  recipient_id UUID REFERENCES profiles(id) NOT NULL,
  sender_id UUID REFERENCES profiles(id),
  loan_id UUID REFERENCES loans(id),
  type TEXT NOT NULL CHECK (type IN ('due_date', 'return_request', 'return_confirmation')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE
);

-- ROW LEVEL SECURITY POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD their own contacts" ON contacts USING (auth.uid() = user_id);

ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners can view their loans" ON loans FOR SELECT USING (auth.uid() = owner_id OR auth.uid() = borrower_id);
CREATE POLICY "Owners can update their loans" ON loans FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete their loans" ON loans FOR DELETE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can insert loans" ON loans FOR INSERT WITH CHECK (auth.uid() = owner_id);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = recipient_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = recipient_id);
*/ 