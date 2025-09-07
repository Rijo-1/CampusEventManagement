import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, QrCode as QrCodeIcon } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { useCollege } from '../context/CollegeContext';
import { supabase, Event } from '../lib/supabase';
import { generateQRCode, generateEventTicket, downloadTicketPDF } from '../lib/qr';
import LoadingSpinner from './LoadingSpinner';
import { format } from 'date-fns';

// No need for EventTicketParams interface since we're using inline type

const EventTicket: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const eventId = id || ''; // Provide a default empty string if id is undefined
  const navigate = useNavigate();
  const { user, profile } = useAuthContext();
  const { selectedCollege } = useCollege();
  const [event, setEvent] = useState<Partial<Event> | null>(null);
  const [qrCode, setQrCode] = useState<string>('');
  const [ticketImage, setTicketImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (eventId && user) {
      fetchEventAndGenerateTicket();
    }
  }, [eventId, user]);

  const fetchEventAndGenerateTicket = async () => {
    try {
      // Fetch event details
      if (!eventId) {
        throw new Error('Event ID is required');
      }

      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError) {
        console.error('Error fetching event:', eventError);
        throw eventError;
      }

      // Check if user is registered
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      const { data: registration, error: regError } = await supabase
        .from('registrations')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      if (regError) {
        console.error('Error checking registration:', regError);
        throw regError;
      }

      if (regError || !registration) {
        navigate(`/event/${eventId}`);
        return;
      }

      setEvent(eventData as Event);

      // Generate QR code data
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      if (!eventData?.id) {
        throw new Error('Event ID is missing');
      }
      
      const qrData = JSON.stringify({
        eventId: eventData.id,
        userId: user.id,
        timestamp: new Date().toISOString(),
      });

      const qrCodeDataURL = await generateQRCode(qrData);
      setQrCode(qrCodeDataURL);

      // Generate ticket image
      const ticket = await generateEventTicket({
        eventName: eventData?.name || 'Event',
        userName: profile?.name || 'User',
        collegeName: selectedCollege?.name || '',
        qrCodeUrl: qrCodeDataURL,
        eventDate: format(new Date(eventData?.start_time), 'MMMM d, yyyy'),
        eventTime: format(new Date(eventData?.start_time), 'h:mm a'),
        location: eventData?.location || 'TBD',
      });

      setTicketImage(ticket);
    } catch (error) {
      console.error('Error generating ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!ticketImage || !event) return;

    setGenerating(true);
    try {
      await downloadTicketPDF(ticketImage, event.name || 'Event Ticket');
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && event) {
      try {
        await navigator.share({
          title: `${event.name || 'Event Ticket'} - Event Ticket`,
          text: `I'm attending ${event.name || 'Event Ticket'}!`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!event || !user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ticket not found</h2>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div 
        className="px-4 py-4"
        style={{
          background: `linear-gradient(135deg, ${selectedCollege.gradientFrom} 0%, ${selectedCollege.gradientTo} 100%)`
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="text-white p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-white font-bold text-xl">Event Ticket</h1>
              <p className="text-white/80 text-sm">Your digital pass</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={generating}
              className="bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors disabled:opacity-50"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Ticket Display */}
        <div className="max-w-md mx-auto">
          {ticketImage ? (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <img
                src={ticketImage}
                alt="Event Ticket"
                className="w-full h-auto"
              />
            </div>
          ) : (
            <div 
              className="rounded-2xl p-8 text-white text-center shadow-lg mb-6"
              style={{
                background: `linear-gradient(135deg, ${selectedCollege.gradientFrom}, ${selectedCollege.gradientTo})`
              }}
            >
              <h2 className="text-2xl font-bold mb-4">{event.name || 'Event Ticket'}</h2>
              <div className="bg-white/20 rounded-xl p-6 mb-6">
                <p className="mb-2"><strong>Date:</strong> {event?.start_time ? format(new Date(event.start_time), 'MMMM d, yyyy') : 'TBD'}</p>
                <p className="mb-2"><strong>Time:</strong> {event?.start_time ? format(new Date(event.start_time), 'h:mm a') : 'TBD'}</p>
                <p className="mb-2"><strong>Location:</strong> {event?.location || 'TBD'}</p>
                <p><strong>Student:</strong> {profile?.name || 'User'}</p>
              </div>
              
              {qrCode && (
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-xl">
                    <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                  </div>
                </div>
              )}
              
              <p className="mt-4 text-sm opacity-90">Scan for check-in</p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <QrCodeIcon className="h-5 w-5" />
              How to Use Your Ticket
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <p>Save this ticket to your device or take a screenshot</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <p>Show the QR code to event organizers at the venue</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <p>Keep your ticket handy throughout the event</p>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">{event?.name || 'Event Ticket'}</h1>
                </div>
                {event?.type && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium text-gray-900">{event.type}</span>
                  </div>
                )}
                {event?.organizer && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Organizer:</span>
                    <span className="font-medium text-gray-900">{event.organizer}</span>
                  </div>
                )}
                <div className="flex flex-col space-y-2 mt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Attendee:</span>
                    <span className="font-medium text-gray-900">{profile?.name || 'User'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">College:</span>
                    <span className="font-medium text-gray-900">{selectedCollege?.name || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleDownloadPDF}
              disabled={generating}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              {generating ? 'Generating PDF...' : 'Download PDF Ticket'}
            </button>
            
            <button
              onClick={() => navigate(`/event/${event.id}`)}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Back to Event Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTicket;