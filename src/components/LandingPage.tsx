import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, BarChart3, MessageCircle, Trophy, Smartphone, LogIn } from 'lucide-react';
import { useCollege } from '../context/CollegeContext';
import { useAuthContext } from '../context/AuthContext';
import AuthModal from './AuthModal';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCollege, colleges, setSelectedCollege } = useCollege();
  const { user } = useAuthContext();
  const [authModal, setAuthModal] = React.useState<{ isOpen: boolean; mode: 'signin' | 'signup' }>({
    isOpen: false,
    mode: 'signin'
  });

  const handleGetStarted = () => {
    if (user) {
      navigate('/student');
    } else {
      setAuthModal({ isOpen: true, mode: 'signup' });
    }
  };

  const handleSignIn = () => {
    if (user) {
      navigate('/student');
    } else {
      setAuthModal({ isOpen: true, mode: 'signin' });
    }
  };

  return (
    <>
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-10 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{selectedCollege.logo}</div>
              <span className="text-white font-bold text-xl">CampusHub</span>
            </div>
            {!user && (
              <button
                onClick={handleSignIn}
                className="bg-white/20 text-white px-6 py-2 rounded-full hover:bg-white/30 transition-colors flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
            )}
          </div>
        </nav>

      {/* Hero Section */}
      <div 
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${selectedCollege.gradientFrom} 0%, ${selectedCollege.gradientTo} 100%)`
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="text-6xl mb-6">{selectedCollege.logo}</div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Campus Events,
              <br />
              <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              The hyperlocal event platform where your college community comes alive. 
              Discover, engage, and connect with events that matter to you.
            </p>
            
            {/* College Selector */}
            <div className="mb-8">
              <p className="text-white/80 mb-4">Choose your college:</p>
              <div className="flex flex-wrap justify-center gap-4">
                {colleges.map((college) => (
                  <button
                    key={college.id}
                    onClick={() => setSelectedCollege(college)}
                    className={`px-6 py-3 rounded-full transition-all duration-300 ${
                      selectedCollege.id === college.id
                        ? 'bg-white text-gray-800 shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {college.logo} {college.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-white text-gray-800 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <Smartphone className="h-5 w-5" />
                {user ? 'Go to Dashboard' : 'Get Started'}
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="bg-black/20 text-white border-2 border-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <BarChart3 className="h-5 w-5" />
                Admin Portal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Students Love CampusHub
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for college communities, not generic corporate events
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div 
                className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-white text-2xl"
                style={{ background: `linear-gradient(135deg, ${selectedCollege.gradientFrom}, ${selectedCollege.gradientTo})` }}
              >
                🏫
              </div>
              <h3 className="text-xl font-semibold mb-4">Hyperlocal Branding</h3>
              <p className="text-gray-600">
                Every college gets its own branded portal with custom colors, logos, and event feeds that reflect your campus culture.
              </p>
            </div>

            <div className="text-center group">
              <div 
                className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-white text-2xl"
                style={{ background: `linear-gradient(135deg, ${selectedCollege.gradientFrom}, ${selectedCollege.gradientTo})` }}
              >
                <MessageCircle />
              </div>
              <h3 className="text-xl font-semibold mb-4">Community First</h3>
              <p className="text-gray-600">
                Discussion tabs on every event, quick polls, and real-time chat. Events become conversation starters, not just listings.
              </p>
            </div>

            <div className="text-center group">
              <div 
                className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-white text-2xl"
                style={{ background: `linear-gradient(135deg, ${selectedCollege.gradientFrom}, ${selectedCollege.gradientTo})` }}
              >
                <Trophy />
              </div>
              <h3 className="text-xl font-semibold mb-4">Gamified Engagement</h3>
              <p className="text-gray-600">
                Leaderboards for most active students, attendance streaks, and badges that make participation fun and rewarding.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div 
        className="py-24"
        style={{
          background: `linear-gradient(135deg, ${selectedCollege.gradientFrom} 0%, ${selectedCollege.gradientTo} 100%)`
        }}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Campus Events?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of students and staff already using CampusHub to create meaningful campus experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-white text-gray-800 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              {user ? 'Go to Dashboard' : 'Get Started'}
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="bg-black/20 text-white border-2 border-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-gray-800 transition-colors"
            >
              Try Admin Portal
            </button>
          </div>
        </div>
      </div>
    </div>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        mode={authModal.mode}
        onModeChange={(mode) => setAuthModal({ ...authModal, mode })}
      />
    </>
  );
};

export default LandingPage;