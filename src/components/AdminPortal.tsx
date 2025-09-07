import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BarChart3, Users, Calendar, Settings, ArrowLeft } from 'lucide-react';
import { useCollege } from '../context/CollegeContext';

const AdminPortal: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCollege } = useCollege();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalEvents: 24,
    totalRegistrations: 1248,
    avgAttendance: 87,
    avgRating: 4.6
  };

  const recentEvents = [
    {
      id: '1',
      title: 'Tech Fest 2024',
      type: 'Fest',
      date: '2024-03-15',
      registrations: 245,
      capacity: 500,
      status: 'Published'
    },
    {
      id: '2',
      title: 'ML Workshop',
      type: 'Workshop',
      date: '2024-03-12',
      registrations: 67,
      capacity: 100,
      status: 'Published'
    },
    {
      id: '3',
      title: 'Startup Pitch',
      type: 'Hackathon',
      date: '2024-03-20',
      registrations: 89,
      capacity: 150,
      status: 'Draft'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div 
        className="px-6 py-4 shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${selectedCollege.gradientFrom} 0%, ${selectedCollege.gradientTo} 100%)`
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-white p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="text-2xl">{selectedCollege.logo}</div>
            <div>
              <h1 className="text-white font-bold text-xl">Admin Portal</h1>
              <p className="text-white/80 text-sm">{selectedCollege.name}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/reports')}
            className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Reports
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="h-5 w-5" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'events'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Calendar className="h-5 w-5" />
                Events
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'create'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Plus className="h-5 w-5" />
                Create Event
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'students'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Users className="h-5 w-5" />
                Students
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
              
              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${selectedCollege.primaryColor}20` }}
                    >
                      <Calendar className="h-6 w-6" style={{ color: selectedCollege.primaryColor }} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stats.totalEvents}</div>
                      <div className="text-sm text-gray-600">Total Events</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stats.totalRegistrations}</div>
                      <div className="text-sm text-gray-600">Registrations</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stats.avgAttendance}%</div>
                      <div className="text-sm text-gray-600">Avg Attendance</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center">
                      <span className="text-yellow-600 text-xl">⭐</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stats.avgRating}</div>
                      <div className="text-sm text-gray-600">Avg Rating</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Events */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                            style={{ backgroundColor: selectedCollege.primaryColor }}
                          >
                            {event.type.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{event.title}</h4>
                            <p className="text-sm text-gray-600">{event.date} • {event.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {event.registrations} / {event.capacity}
                            </div>
                            <div className="text-xs text-gray-600">registered</div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            event.status === 'Published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {event.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h2>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter event title..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Type
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Workshop</option>
                        <option>Fest</option>
                        <option>Seminar</option>
                        <option>Hackathon</option>
                        <option>Cultural</option>
                        <option>Sports</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Capacity
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Max attendees"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Event venue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Event description and details..."
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="inter-college" className="rounded" />
                    <label htmlFor="inter-college" className="text-sm text-gray-700">
                      Allow inter-college registrations
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Save as Draft
                    </button>
                    <button
                      type="submit"
                      className="flex-1 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: selectedCollege.primaryColor }}
                    >
                      Publish Event
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {(activeTab === 'events' || activeTab === 'students') && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {activeTab === 'events' ? 'All Events' : 'Student Management'}
              </h2>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <p className="text-gray-600 text-center py-8">
                  {activeTab === 'events' 
                    ? 'Event management interface would be implemented here.'
                    : 'Student management and analytics would be implemented here.'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;