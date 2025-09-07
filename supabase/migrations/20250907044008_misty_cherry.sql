/*
  # Initial Schema for Campus Event Management Platform

  1. New Tables
    - `colleges`
      - `id` (uuid, primary key)
      - `name` (text)
      - `logo` (text)
      - `primary_color` (text)
      - `secondary_color` (text)
      - `gradient_from` (text)
      - `gradient_to` (text)
      - `created_at` (timestamp)
    
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `type` (text)
      - `date` (date)
      - `time` (time)
      - `location` (text)
      - `capacity` (integer)
      - `college_id` (uuid, foreign key)
      - `organizer` (text)
      - `image_url` (text)
      - `is_inter_college` (boolean)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `registrations`
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `registered_at` (timestamp)
      - `attended` (boolean)
      - `checked_in_at` (timestamp)
      - `feedback_rating` (integer)
      - `feedback_comment` (text)
    
    - `discussions`
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `message` (text)
      - `created_at` (timestamp)
      - `likes` (integer)
    
    - `polls`
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key)
      - `question` (text)
      - `options` (jsonb)
      - `created_at` (timestamp)
    
    - `poll_votes`
      - `id` (uuid, primary key)
      - `poll_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `option_id` (text)
      - `created_at` (timestamp)
    
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `email` (text)
      - `college_id` (uuid, foreign key)
      - `department` (text)
      - `year` (text)
      - `role` (text)
      - `points` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
</sql>

-- Create colleges table
CREATE TABLE IF NOT EXISTS colleges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo text DEFAULT '🏛️',
  primary_color text DEFAULT '#3B82F6',
  secondary_color text DEFAULT '#1E40AF',
  gradient_from text DEFAULT '#3B82F6',
  gradient_to text DEFAULT '#8B5CF6',
  created_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  type text NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  location text NOT NULL,
  capacity integer DEFAULT 100,
  college_id uuid REFERENCES colleges(id) ON DELETE CASCADE,
  organizer text DEFAULT 'Event Organizer',
  image_url text DEFAULT 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800',
  is_inter_college boolean DEFAULT false,
  status text DEFAULT 'published',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  college_id uuid REFERENCES colleges(id) ON DELETE SET NULL,
  department text DEFAULT '',
  year text DEFAULT '',
  role text DEFAULT 'student',
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  registered_at timestamptz DEFAULT now(),
  attended boolean DEFAULT false,
  checked_in_at timestamptz,
  feedback_rating integer CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  feedback_comment text DEFAULT '',
  UNIQUE(event_id, user_id)
);

-- Create discussions table
CREATE TABLE IF NOT EXISTS discussions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  likes integer DEFAULT 0
);

-- Create polls table
CREATE TABLE IF NOT EXISTS polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Create poll_votes table
CREATE TABLE IF NOT EXISTS poll_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid REFERENCES polls(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  option_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(poll_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public colleges are viewable by everyone" ON colleges FOR SELECT USING (true);

CREATE POLICY "Public events are viewable by everyone" ON events FOR SELECT USING (true);

CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view registrations" ON registrations FOR SELECT USING (true);
CREATE POLICY "Users can register for events" ON registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own registrations" ON registrations FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view discussions" ON discussions FOR SELECT USING (true);
CREATE POLICY "Users can create discussions" ON discussions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view polls" ON polls FOR SELECT USING (true);

CREATE POLICY "Users can view poll votes" ON poll_votes FOR SELECT USING (true);
CREATE POLICY "Users can vote in polls" ON poll_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own votes" ON poll_votes FOR UPDATE USING (auth.uid() = user_id);

-- Insert sample data
INSERT INTO colleges (name, logo, primary_color, secondary_color, gradient_from, gradient_to) VALUES
('IIT Delhi', '🏛️', '#3B82F6', '#1E40AF', '#3B82F6', '#8B5CF6'),
('BITS Pilani', '🎓', '#EF4444', '#DC2626', '#EF4444', '#F97316'),
('NIT Trichy', '⚡', '#10B981', '#059669', '#10B981', '#06B6D4');