import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, TrendingUp, Award, Calendar, Loader } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { useCollege } from '../context/CollegeContext';
import { supabase } from '../lib/supabase';
import { generateStudentInsights } from '../lib/groq';
import LoadingSpinner from './LoadingSpinner';

const StudentInsights: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuthContext();
  const { selectedCollege } = useCollege();
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    eventsAttended: 0,
    favoriteTypes: [] as string[],
    totalPoints: 0,
    rank: 0
  });

  useEffect(() => {
    if (user && profile) {
      fetchStudentStats();
    }
  }, [user, profile]);

  const fetchStudentStats = async () => {
    if (!user) return;

    try {
      // Fetch user's registrations
      const { data: registrations, error } = await supabase
        .from('registrations')
        .select(`
          *,
          event:events(type)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const eventsAttended = registrations?.length || 0;
      
      // Calculate favorite event types
      const typeCounts: Record<string, number> = {};
      registrations?.forEach(reg => {
        if (reg.event?.type) {
          typeCounts[reg.event.type] = (typeCounts[reg.event.type] || 0) + 1;
        }
      });

      const favoriteTypes = Object.entries(typeCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([type]) => type);

      // Get user rank (simplified)
      const { data: allUsers } = await supabase
        .from('user_profiles')
        .select('points')
        .eq('college_id', profile!.college_id)
        .order('points', { ascending: false });

      const rank = (allUsers?.findIndex(u => u.points <= (profile?.points || 0)) || 0) + 1;

      const studentStats = {
        eventsAttended,
        favoriteTypes,
        totalPoints: profile?.points || 0,
        rank
      };

      setStats(studentStats);

      // Generate AI insights
      const aiInsights = await generateStudentInsights(
        profile!.name,
        eventsAttended,
        favoriteTypes,
        profile?.points || 0
      );

      setInsights(aiInsights);
    } catch (error) {
      console.error('Error fetching student stats:', error);
      setInsights('Unable to generate insights at this time. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div 
        className="px-4 py-4"
        style={{
          background: `linear-gradient(135deg, ${selectedCollege.gradientFrom} 0%, ${selectedCollege.gradientTo} 100%)`
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-white p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-white font-bold text-xl flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              AI Insights
            </h1>
            <p className="text-white/80 text-sm">Personalized for {profile.name}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.eventsAttended}</div>
            <div className="text-sm text-gray-600">Events Attended</div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-gray-900">#{stats.rank}</div>
            <div className="text-sm text-gray-600">College Rank</div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.totalPoints}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.favoriteTypes.length}</div>
            <div className="text-sm text-gray-600">Event Types</div>
          </div>
        </div>

        {/* Favorite Event Types */}
        {stats.favoriteTypes.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your Favorite Event Types
            </h3>
            <div className="flex flex-wrap gap-2">
              {stats.favoriteTypes.map((type, index) => (
                <span
                  key={type}
                  className="px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ 
                    backgroundColor: selectedCollege.primaryColor,
                    opacity: 1 - (index * 0.2)
                  }}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AI Insights */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI-Powered Insights
          </h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader className="h-8 w-8 animate-spin text-purple-500 mx-auto mb-4" />
                <p className="text-gray-600">Generating personalized insights...</p>
              </div>
            </div>
          ) : (
            <div className="prose prose-gray max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {insights}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => navigate('/leaderboard')}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Award className="h-4 w-4" />
            View Leaderboard
          </button>
          
          <button
            onClick={() => navigate('/student')}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Discover More Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentInsights;