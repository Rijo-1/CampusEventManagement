import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface College {
  id: string;
  name: string;
  logo: string;
  primary_color: string;
  secondary_color: string;
  gradient_from: string;
  gradient_to: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  college_id: string;
  organizer: string;
  image_url: string;
  is_inter_college: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  college?: College;
  registrations?: Registration[];
  registration_count?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  college_id: string;
  department: string;
  year: string;
  role: string;
  points: number;
  created_at: string;
  updated_at: string;
  college?: College;
}

export interface Registration {
  id: string;
  event_id: string;
  user_id: string;
  registered_at: string;
  attended: boolean;
  checked_in_at?: string;
  feedback_rating?: number;
  feedback_comment?: string;
  event?: Event;
  user?: UserProfile;
}

export interface Discussion {
  id: string;
  event_id: string;
  user_id: string;
  message: string;
  created_at: string;
  likes: number;
  user?: UserProfile;
}

export interface Poll {
  id: string;
  event_id: string;
  question: string;
  options: Array<{
    id: string;
    label: string;
    votes: number;
  }>;
  created_at: string;
  total_votes?: number;
  user_vote?: string;
}

export interface PollVote {
  id: string;
  poll_id: string;
  user_id: string;
  option_id: string;
  created_at: string;
}