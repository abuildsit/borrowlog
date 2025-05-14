# BorrowLog

A web application to help users track items they lend and borrow from others. Built with React and Supabase.

## Features

- **User Authentication**: Email/password login using Supabase Auth
- **Item Loan Management**: Track items you've lent or borrowed
- **Dashboard**: View and filter your active, pending, and completed loans
- **Return Process**: Request returns and document item condition
- **Contact Management**: Manage a list of people you lend to or borrow from
- **Notifications**: Stay updated on due dates and return requests

## Setup Instructions

### Prerequisites

- Node.js and npm (or yarn)
- A Supabase account (https://supabase.com)

### Supabase Setup

1. Create a new Supabase project
2. Run the database setup SQL in the Supabase SQL Editor (see below)
3. Set up storage buckets:
   - Create `avatars` bucket
   - Create `loan-photos` bucket
4. Configure authentication:
   - Enable Email/Password sign-in
   - (Optional) Set up social logins

### Database Schema

Run the following SQL in the Supabase SQL Editor:

```sql
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

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### Application Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```
3. Create a `.env` file in the root directory with your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Update the `src/utils/supabaseClient.ts` file with your Supabase credentials
5. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

### Supabase CLI Usage

The Supabase CLI is installed as a dev dependency in this project, allowing you to manage database migrations and other Supabase-related tasks directly from the project.

#### Available Scripts

The following npm scripts are available to work with Supabase:

```bash
# Push migrations to your remote Supabase database
npm run supabase:push

# Create a new migration file
npm run supabase:migration:new your_migration_name

# List all migrations and their status
npm run supabase:migration:list

# Start the local Supabase development environment
npm run supabase:start

# Stop the local Supabase development environment
npm run supabase:stop
```

#### Creating a New Migration

To add a new column or make other database changes:

1. Create a new migration file:
   ```bash
   npm run supabase:migration:new add_new_column
   ```
   This creates a timestamped SQL file in the `supabase/migrations` directory.

2. Edit the migration file with your SQL changes.

3. Push the migration to your Supabase database:
   ```bash
   npm run supabase:push
   ```

#### Manual Migration Execution

If you prefer to write SQL directly and execute it:

1. Create a new SQL file in the `supabase/migrations` directory with a timestamp prefix:
   ```
   supabase/migrations/YYYYMMDDHHMMSS_your_migration_name.sql
   ```

2. Add your SQL code to the file.

3. Push the migration:
   ```bash
   npm run supabase:push
   ```

## Mobile App Development

For future development, this web application can be adapted to a mobile app using React Native with Expo.

## License

MIT 