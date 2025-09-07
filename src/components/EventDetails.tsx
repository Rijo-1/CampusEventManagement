import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, MessageCircle, Share2, Heart, Send, Loader } from 'lucide-react';
import { useCollege } from '../context/CollegeContext';
import { useAuthContext } from '../context/AuthContext';
import { supabase, Event, Discussion, Poll } from '../lib/supabase';
import { format } from 'date-fns';
import LoadingSpinner from './LoadingSpinner';

const EventDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCollege } = useCollege();
  const { user, profile } = useAuthContext();
  const [activeTab, setActiveTab] = useState('details');
  const [pollChoice, setPollChoice] = useState<string | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [posting, setPosting] = useState(false);

  React.useEffect(() => {
    if (id) {
      fetchEvent();
      fetchDiscussions();
      fetchPolls();
      if (user) {
        checkRegistration();
      }
    }
  }, [id, user]);

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          college:colleges(*),
          registration_count:registrations(count)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscussions = async () => {
    try {
      const { data, error } = await supabase
        .from('discussions')
        .select(`
          *,
          user:user_profiles(name, college_id)
        `)
        .eq('event_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiscussions(data || []);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    }
  };

  const fetchPolls = async () => {
    try {
      const { data: pollsData, error } = await supabase
        .from('polls')
        .select('*')
        .eq('event_id', id);

      if (error) throw error;

      if (pollsData && pollsData.length > 0) {
        // Fetch vote counts for each poll
        const pollsWithVotes = await Promise.all(
          pollsData.map(async (poll) => {
            const { data: votes, error: votesError } = await supabase
              .from('poll_votes')
              .select('option_id')
              .eq('poll_id', poll.id);

            if (votesError) throw votesError;

            // Count votes for each option
            const voteCounts: Record<string, number> = {};
            votes?.forEach(vote => {
              voteCounts[vote.option_id] = (voteCounts[vote.option_id] || 0) + 1;
            });

            const totalVotes = votes?.length || 0;
            const optionsWithVotes = poll.options.map((option: any) => ({
              ...option,
              votes: voteCounts[option.id] || 0,
              percentage: totalVotes > 0 ? Math.round((voteCounts[option.id] || 0) / totalVotes * 100) : 0
            }));

            // Check if user has voted
            let userVote = null;
            if (user) {
              const { data: userVoteData } = await supabase
                .from('poll_votes')
                .select('option_id')
                .eq('poll_id', poll.id)
                .eq('user_id', user.id)
                .single();
              
              userVote = userVoteData?.option_id || null;
            }

            return {
              ...poll,
              options: optionsWithVotes,
              total_votes: totalVotes,
              user_vote: userVote
            };
          })
        );

        setPolls(pollsWithVotes);
      }
    } catch (error) {
      console.error('Error fetching polls:', error);
    }
  };

  const checkRegistration = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('id')
        .eq('event_id', id)
        .eq('user_id', user.id)
        .single();

      setIsRegistered(!!data);
    } catch (error) {
      // Not registered
      setIsRegistered(false);
    }
  };

  const handleRegister = async () => {
    if (!user || !event) return;

    setRegistering(true);
    try {
      const { error } = await supabase
        .from('registrations')
        .insert({
          event_id: event.id,
          user_id: user.id
        });

      if (error) throw error;

      // Update user points
      await supabase
        .from('user_profiles')
        .update({ points: (profile?.points || 0) + 10 })
        .eq('id', user.id);

      setIsRegistered(true);
      fetchEvent(); // Refresh registration count
    } catch (error) {
      console.error('Error registering for event:', error);
    } finally {
      setRegistering(false);
    }
  };

  const handlePostMessage = async () => {
    if (!user || !newMessage.trim()) return;

    setPosting(true);
    try {
      const { error } = await supabase
        .from('discussions')
        .insert({
          event_id: id,
          user_id: user.id,
          message: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage('');
      fetchDiscussions();
    } catch (error) {
      console.error('Error posting message:', error);
    } finally {
      setPosting(false);
    }
  };

  const handlePollVote = async (pollId: string, optionId: string) => {
    if (!user) return;

    try {
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('poll_votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        // Update existing vote
        await supabase
          .from('poll_votes')
          .update({ option_id: optionId })
          .eq('id', existingVote.id);
      } else {
        // Create new vote
        await supabase
          .from('poll_votes')
          .insert({
            poll_id: pollId,
            user_id: user.id,
            option_id: optionId
          });
      }

      setPollChoice(optionId);
      fetchPolls(); // Refresh poll data
    } catch (error) {
      console.error('Error voting in poll:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Event not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const registrationCount = event.registration_count?.[0]?.count || 0;
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'EEEE, MMMM dd, yyyy');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative">
        <div className="h-64 relative">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="absolute top-4 right-4 flex gap-2">
          <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
            <Heart className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Event Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold text-white mb-3 inline-block"
                style={{ backgroundColor: selectedCollege.primaryColor }}
              >
                {event.type}
              </span>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <p className="text-gray-600">by {event.organizer}</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar className="h-5 w-5" />
              <span>{formatDate(event.date)} at {event.time}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin className="h-5 w-5" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Users className="h-5 w-5" />
              <span>{registrationCount} / {event.capacity} registered</span>
            </div>
          </div>

          {user && !isRegistered && (
            <button
              onClick={handleRegister}
              disabled={registering}
              className="w-full py-4 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: selectedCollege.primaryColor }}
            >
              {registering ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                'Register for Event'
              )}
            </button>
          )}

          {isRegistered && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-green-800 font-semibold">✅ You're registered for this event!</p>
              <button
                onClick={() => navigate(`/event/${event.id}/ticket`)}
                className="mt-2 text-green-600 hover:text-green-700 text-sm font-medium"
              >
                View Ticket & QR Code
              </button>
            </div>
          )}

          {!user && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-blue-800 font-semibold">Sign in to register for this event</p>
              <button
                onClick={() => navigate('/')}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Go to Sign In
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-xl p-1 mb-6 shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'details'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('discussion')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'discussion'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Discussion
          </button>
          <button
            onClick={() => setActiveTab('poll')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'poll'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Poll
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">About This Event</h3>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {event.description}
            </div>
          </div>
        )}

        {activeTab === 'discussion' && (
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <div key={discussion.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">
                      {discussion.user?.name?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{discussion.user?.name || 'Anonymous'}</span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(discussion.created_at), 'MMM dd, h:mm a')}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{discussion.message}</p>
                    <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {discussion.likes}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {user && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Join the discussion..."
                  className="w-full border-none outline-none resize-none text-gray-700"
                  rows={3}
                />
                <button
                  onClick={handlePostMessage}
                  disabled={posting || !newMessage.trim()}
                  className="mt-2 px-6 py-2 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  style={{ backgroundColor: selectedCollege.primaryColor }}
                >
                  {posting ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Post
                    </>
                  )}
                </button>
              </div>
            )}

            {!user && (
              <div className="bg-gray-50 rounded-2xl p-6 text-center">
                <p className="text-gray-600 mb-2">Sign in to join the discussion</p>
                <button
                  onClick={() => navigate('/')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Go to Sign In
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'poll' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {polls.length > 0 ? (
              polls.map((poll) => (
                <div key={poll.id} className="mb-6 last:mb-0">
                  <h3 className="text-lg font-semibold mb-4">{poll.question}</h3>
                  <div className="space-y-3">
                    {poll.options.map((option: any) => (
                      <button
                        key={option.id}
                        onClick={() => user ? handlePollVote(poll.id, option.id) : navigate('/')}
                        disabled={!user}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-colors disabled:cursor-not-allowed ${
                          poll.user_vote === option.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{option.label}</span>
                          <span className="text-sm text-gray-600">{option.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${option.percentage}%`,
                              backgroundColor: selectedCollege.primaryColor 
                            }}
                          />
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{option.votes} votes</div>
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    {poll.total_votes} total votes
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No polls available for this event</p>
              </div>
            )}

            {!user && polls.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-blue-800 text-sm">
                  <button
                    onClick={() => navigate('/')}
                    className="font-medium hover:underline"
                  >
                    Sign in
                  </button>
                  {' '}to participate in polls
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;