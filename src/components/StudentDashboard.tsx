import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, MessageCircle, Filter, QrCode, Trophy, Home, User, LogOut, Sparkles } from 'lucide-react';
import { useCollege } from '../context/CollegeContext';
import { useAuthContext } from '../context/AuthContext';
import { supabase, Event } from '../lib/supabase';
import FilterChips from './FilterChips';
import EventCard from './EventCard';
import LoadingSpinner from './LoadingSpinner';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCollege } = useCollege();
  const { user, profile, signOut } = useAuthContext();
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('home');
  const [events, setEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (user && profile) {
      fetchEvents();
      fetchMyEvents();
    }
  }, [user, profile, activeFilter]);

  const fetchEvents = async () => {
    try {
      let query = supabase
        .from('events')
        .select(`
          *,
          college:colleges(*),
          registration_count:registrations(count)
        `)
        .eq('status', 'published')
        .order('date', { ascending: true });

      if (activeFilter !== 'All') {
        query = query.eq('type', activeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyEvents = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          *,
          event:events(
            *,
            college:colleges(*)
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      setMyEvents(data?.map(reg => reg.event).filter(Boolean) || []);
    } catch (error) {
      console.error('Error fetching my events:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user || !profile) {
    return <LoadingSpinner />;
  }

  const eventTypes = ['All', 'Workshop', 'Fest', 'Seminar', 'Hackathon', 'Cultural', 'Sports'];
  const filteredEvents = events;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div 
        className="sticky top-0 z-10 px-4 py-4"
        style={{
          background: `linear-gradient(135deg, ${selectedCollege.gradientFrom} 0%, ${selectedCollege.gradientTo} 100%)`
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{selectedCollege.logo}</div>
            <div>
              <h1 className="text-white font-bold text-lg">Welcome, {profile.name.split(' ')[0]}!</h1>
              <p className="text-white/80 text-sm">{profile.college?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right mr-3">
              <div className="text-white font-bold">{profile.points}</div>
              <div className="text-white/80 text-xs">points</div>
            </div>
            <button
              onClick={() => navigate('/leaderboard')}
              className="bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors"
            >
              <Trophy className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {activeTab === 'home' && (
          <div>
            {/* Filter Chips */}
            <FilterChips 
              options={eventTypes}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              primaryColor={selectedCollege.primaryColor}
            />

            {/* Events Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-4 mt-6">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={() => navigate(`/event/${event.id}`)}
                      primaryColor={selectedCollege.primaryColor}
                      isRegistered={myEvents.some(me => me.id === event.id)}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No events found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-events' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">My Events</h2>
            {myEvents.length > 0 ? (
              <div className="space-y-4">
                {myEvents.map(event => (
                  <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <EventCard
                      event={event}
                      onClick={() => navigate(`/event/${event.id}`)}
                      primaryColor={selectedCollege.primaryColor}
                      isRegistered={true}
                    />
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => navigate(`/event/${event.id}/ticket`)}
                        className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <QrCode className="h-4 w-4" />
                        Show QR Code
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No registered events yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl"
                  style={{ backgroundColor: selectedCollege.primaryColor }}
                >
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                  <p className="text-gray-600">{profile.department} • {profile.year}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{myEvents.length}</div>
                  <div className="text-sm text-gray-600">Events Attended</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">#{Math.floor(Math.random() * 10) + 1}</div>
                  <div className="text-sm text-gray-600">College Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{profile.points}</div>
                  <div className="text-sm text-gray-600">Total Points</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/student/insights')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mb-4"
            >
              <Sparkles className="h-4 w-4" />
              View AI Insights
            </button>

            <button
              onClick={() => navigate('/admin')}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors mb-4"
            >
              Switch to Admin View
            </button>

            <button
              onClick={handleSignOut}
              className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'home' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('my-events')}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'my-events' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-xs">My Events</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'profile' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>

      {/* Add padding to prevent content from being hidden behind bottom nav */}
      <div className="h-20"></div>
    </div>
  );
};

export default StudentDashboard;