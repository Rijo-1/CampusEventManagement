import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Award, Star } from 'lucide-react';
import { useCollege } from '../context/CollegeContext';

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCollege } = useCollege();

  const topStudents = [
    {
      id: '1',
      name: 'Emma Rodriguez',
      department: 'Computer Science',
      year: 'Final Year',
      points: 2850,
      eventsAttended: 28,
      badge: 'Event Champion',
      rank: 1
    },
    {
      id: '2',
      name: 'Alex Johnson',
      department: 'Electronics',
      year: 'Third Year',
      points: 2640,
      eventsAttended: 22,
      badge: 'Community Builder',
      rank: 2
    },
    {
      id: '3',
      name: 'Priya Sharma',
      department: 'Mechanical',
      year: 'Final Year',
      points: 2480,
      eventsAttended: 19,
      badge: 'Workshop Enthusiast',
      rank: 3
    }
  ];

  const otherStudents = [
    { id: '4', name: 'Michael Chen', department: 'Computer Science', points: 2200, rank: 4 },
    { id: '5', name: 'Sarah Wilson', department: 'Civil', points: 2100, rank: 5 },
    { id: '6', name: 'David Kumar', department: 'Electronics', points: 1980, rank: 6 },
    { id: '7', name: 'Lisa Zhang', department: 'Chemical', points: 1850, rank: 7 },
    { id: '8', name: 'James Park', department: 'Mechanical', points: 1720, rank: 8 }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Event Champion':
        return 'bg-yellow-100 text-yellow-800';
      case 'Community Builder':
        return 'bg-blue-100 text-blue-800';
      case 'Workshop Enthusiast':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div 
        className="sticky top-0 z-10 px-4 py-4"
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
            <h1 className="text-white font-bold text-xl">Leaderboard</h1>
            <p className="text-white/80 text-sm">Most Active Students</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Top 3 Students */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Top Performers
          </h2>
          
          <div className="space-y-4">
            {topStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden"
              >
                <div 
                  className="absolute top-0 right-0 w-20 h-20 opacity-10"
                  style={{
                    background: `linear-gradient(135deg, ${selectedCollege.gradientFrom}, ${selectedCollege.gradientTo})`
                  }}
                />
                
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {getRankIcon(student.rank)}
                  </div>
                  
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
                    style={{ backgroundColor: selectedCollege.primaryColor }}
                  >
                    {student.name.charAt(0)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.department} • {student.year}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(student.badge)}`}
                      >
                        {student.badge}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{student.points}</div>
                    <div className="text-sm text-gray-600">points</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {student.eventsAttended} events
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Other Students */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Other Rankings</h2>
          <div className="space-y-3">
            {otherStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8">
                    {getRankIcon(student.rank)}
                  </div>
                  
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: selectedCollege.primaryColor }}
                  >
                    {student.name.charAt(0)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.department}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{student.points}</div>
                    <div className="text-xs text-gray-600">points</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current User Position */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Position</h3>
            <div className="text-3xl font-bold text-blue-600 mb-1">#15</div>
            <p className="text-gray-600 mb-4">1,420 points</p>
            <p className="text-sm text-gray-500">
              Keep attending events to climb the leaderboard! 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;