import React, { useEffect, useState, useCallback } from 'react';
import ResponsiveNavbar from '../Components/Navbar';
import apiService from '../utils/apiService';

const StudentSessionsPage = () => {
  const user_id = sessionStorage.getItem('user_id') || '';
  const [sessions, setSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [feedbackModal, setFeedbackModal] = useState({ open: false, session: null });
  const [feedbackForm, setFeedbackForm] = useState({ rating: 0, comment: '' });

  const fetchSessions = useCallback(async () => {
    try {
      const res = await apiService.get(`/sessions/student/${user_id}`);
      setSessions(res.data);
      console.log(res.data);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    }
  }, [user_id]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    const filtered = sessions.filter(session => {
      const localDate = new Date(session.scheduled_date);
      const adjustedDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000)
        .toISOString().split('T')[0];
      return adjustedDate === selectedDate;
    });
    setFilteredSessions(filtered);
  }, [sessions, selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const openFeedbackModal = (session) => {
    setFeedbackForm({
      rating: session.rating || 0,
      comment: session.comment || '',
    });
    setFeedbackModal({ open: true, session });
  };

  const submitFeedback = async () => {
    try {
      const { session_id } = feedbackModal.session;
      await apiService.post(`/sessions/${session_id}/feedback`, feedbackForm);
      setFeedbackModal({ open: false, session: null });
      fetchSessions(); // refresh
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  return (
    <div>
      <ResponsiveNavbar />
      <div className="h-24" />
      <div className="items-center justify-center flex flex-col">
        <div className="max-w-5xl w-full mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">My Sessions</h1>

          <div className="mb-6">
            <label className="block font-medium mb-2">Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="border border-gray-300 rounded-md px-3 py-1"
            />
          </div>

          {filteredSessions.length === 0 ? (
            <p className="text-gray-500 mb-8">No sessions on selected date.</p>
          ) : (
            <div className="overflow-x-auto mb-10">
              <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-left">Tutor</th>
                    <th className="border px-4 py-2 text-left">Date</th>
                    <th className="border px-4 py-2 text-left">Time</th>
                    <th className="border px-4 py-2 text-left">Status</th>
                    <th className="border px-4 py-2 text-left">Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.map(session => (
                    <tr key={session.session_id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{session.tutor_name}</td>
                      <td className="border px-4 py-2">{new Date(session.scheduled_date).toLocaleDateString()}</td>
                      <td className="border px-4 py-2">
                        {new Date(`1970-01-01T${session.start_time}`).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })} - {new Date(`1970-01-01T${session.end_time}`).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </td>
                      <td className="border px-4 py-2 capitalize">{session.status}</td>
                      <td className="border px-4 py-2">
                      {session.rating && session.comment ? (
                        <div className="mb-2">
                          <strong className="text-sm text-gray-700">Your Feedback:</strong>
                          <div className="flex items-center text-yellow-500 text-sm">
                            {'★'.repeat(session.rating)}
                            {'☆'.repeat(5 - session.rating)}
                            <span className="text-xs text-gray-500 ml-2">({session.rating}/5)</span>
                          </div>
                          <p className="text-sm text-gray-600 italic mt-1">{session.comment}</p>
                        </div>
                      ) : session.status === 'confirmed' ? (
                        <button
                          onClick={() => openFeedbackModal(session)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                          Give Feedback
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">N/A</span>
                      )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {feedbackModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Submit Feedback</h3>

            <label className="block font-medium">Rating:</label>
            <div className="flex space-x-1 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFeedbackForm(prev => ({ ...prev, rating: star }))}
                  className={`text-xl ${feedbackForm.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>

            <label className="block font-medium mt-3">Comment:</label>
            <textarea
              value={feedbackForm.comment}
              onChange={(e) => setFeedbackForm(prev => ({ ...prev, comment: e.target.value }))}
              className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
              rows={3}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setFeedbackModal({ open: false, session: null })}
                className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={submitFeedback}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSessionsPage;
