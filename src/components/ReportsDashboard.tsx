import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Filter, Calendar, BarChart3, Users, Trophy } from 'lucide-react';
import { useCollege } from '../context/CollegeContext';

const ReportsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCollege } = useCollege();
  const [dateRange, setDateRange] = useState('last-30-days');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');

  const reportData = {
    totalEvents: 24,
    totalAttendees: 1248,
    avgAttendanceRate: 87.3,
    avgFeedbackRating: 4.6,
    topEventTypes: [
      { type: 'Workshop', count: 12, percentage: 50 },
      { type: 'Seminar', count: 6, percentage: 25 },
      { type: 'Hackathon', count: 4, percentage: 16.7 },
      { type: 'Cultural', count: 2, percentage: 8.3 }
    ],
    topStudents: [
      { name: 'Emma Rodriguez', events: 28, points: 2850 },
      { name: 'Alex Johnson', events: 22, points: 2640 },
      { name: 'Priya Sharma', events: 19, points: 2480 }
    ],
    eventPerformance: [
      {
        name: 'Tech Fest 2024',
        type: 'Fest',
        registered: 245,
        attended: 220,
        attendanceRate: 89.8,
        avgRating: 4.8
      },
      {
        name: 'ML Workshop',
        type: 'Workshop',
        registered: 67,
        attended: 58,
        attendanceRate: 86.6,
        avgRating: 4.5
      },
      {
        name: 'Startup Bootcamp',
        type: 'Seminar',
        registered: 123,
        attended: 105,
        attendanceRate: 85.4,
        avgRating: 4.7
      }
    ]
  };

  const handleExport = (format: string) => {
    console.log(`Exporting data in ${format} format`);
    // Export logic would be implemented here
  };

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
              onClick={() => navigate('/admin')}
              className="text-white p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-white font-bold text-xl">Reports Dashboard</h1>
              <p className="text-white/80 text-sm">Analytics & Insights</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2 text-sm"
            >
              <option value="last-7-days">Last 7 Days</option>
              <option value="last-30-days">Last 30 Days</option>
              <option value="last-90-days">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>
            
            <button
              onClick={() => handleExport('pdf')}
              className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Key Metrics */}
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
                <div className="text-2xl font-bold text-gray-900">{reportData.totalEvents}</div>
                <div className="text-sm text-gray-600">Total Events</div>
                <div className="text-xs text-green-600 mt-1">+12% vs last month</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{reportData.totalAttendees}</div>
                <div className="text-sm text-gray-600">Total Attendees</div>
                <div className="text-xs text-green-600 mt-1">+8% vs last month</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{reportData.avgAttendanceRate}%</div>
                <div className="text-sm text-gray-600">Avg Attendance</div>
                <div className="text-xs text-green-600 mt-1">+2.3% vs last month</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center">
                <span className="text-yellow-600 text-xl">⭐</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{reportData.avgFeedbackRating}</div>
                <div className="text-sm text-gray-600">Avg Rating</div>
                <div className="text-xs text-green-600 mt-1">+0.1 vs last month</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Event Types Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Event Types Distribution</h3>
            <div className="space-y-4">
              {reportData.topEventTypes.map((item, index) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: selectedCollege.primaryColor, opacity: 1 - (index * 0.2) }}
                    />
                    <span className="font-medium text-gray-700">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${item.percentage}%`,
                          backgroundColor: selectedCollege.primaryColor,
                          opacity: 1 - (index * 0.2)
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top 3 Most Active Students */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top 3 Most Active Students
            </h3>
            <div className="space-y-4">
              {reportData.topStudents.map((student, index) => (
                <div key={student.name} className="flex items-center gap-4">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: selectedCollege.primaryColor }}
                  >
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-600">{student.events} events attended</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{student.points}</div>
                    <div className="text-xs text-gray-600">points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Event Performance Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Event Performance</h3>
              <select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Event Types</option>
                <option value="workshop">Workshop</option>
                <option value="fest">Fest</option>
                <option value="seminar">Seminar</option>
                <option value="hackathon">Hackathon</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attended
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Rating
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.eventPerformance.map((event) => (
                  <tr key={event.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{event.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: selectedCollege.primaryColor }}
                      >
                        {event.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.registered}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.attended}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-green-500"
                            style={{ width: `${event.attendanceRate}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-900">{event.attendanceRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm text-gray-900">{event.avgRating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;