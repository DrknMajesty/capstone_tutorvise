import React, { useEffect, useState, useCallback } from 'react';
import ResponsiveNavbar from '../Components/Navbar';
import apiService from '../utils/apiService';

const TutorSessionsPage = () => {
  const user_id = sessionStorage.getItem('user_id') || '';
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [modalInfo, setModalInfo] = useState({ open: false, sessionId: null, action: '' });

  const fetchSessions = useCallback(async () => {
    try {
      const res = await apiService.get(`/sessions/tutor/${user_id}`);
      setSessions(res.data);
      console.log(res.data);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    }
  }, [user_id]);

  const autoUpdateSessionStatus = useCallback(() => {
    const now = new Date();
    setSessions(prevSessions =>
      prevSessions.map(session => {
        const sessionDate = new Date(session.scheduled_date);
        const start = new Date(sessionDate);
        const end = new Date(sessionDate);

        const [sh, sm] = session.start_time.split(":");
        const [eh, em] = session.end_time.split(":");
        start.setHours(Number(sh), Number(sm));
        end.setHours(Number(eh), Number(em));

        if (
          now >= start &&
          now < end &&
          session.status !== 'ongoing' &&
          session.status !== 'confirmed' &&
          session.status !== 'missed'
        ) {
          updateStatusOnServer(session.session_id, 'ongoing');
          return { ...session, status: 'ongoing' };
        }

        if (
          now >= end &&
          session.status !== 'completed' &&
          session.status !== 'confirmed' &&
          session.status !== 'missed'
        ) {
          updateStatusOnServer(session.session_id, 'completed');
          return { ...session, status: 'completed' };
        }

        return session;
      })
    );
  }, []);

  useEffect(() => {
    fetchSessions();
    autoUpdateSessionStatus(); // run once immediately
    const interval = setInterval(() => {
      autoUpdateSessionStatus();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchSessions, autoUpdateSessionStatus]);

  useEffect(() => {
    const filtered = sessions.filter(session => {
      const localDate = new Date(session.scheduled_date);
      const adjustedDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000)
        .toISOString().split('T')[0];
      return adjustedDate === selectedDate;
    });
    setFilteredSessions(filtered);
  }, [sessions, selectedDate]);

  const updateStatusOnServer = async (id, status) => {
    try {
      await apiService.put(`/sessions/${id}/auto-status`, { status });
    } catch (err) {
      console.error('Failed to update session status:', err);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleStatusChange = (id, status) => {
    setStatusUpdates(prev => ({ ...prev, [id]: status }));
  };

  const saveStatus = async (id) => {
    const session = sessions.find(s => s.session_id === id);
    const status = statusUpdates[id];
    if (!status || session.status !== 'completed') return;
    try {
      await apiService.put(`/sessions/${id}/status`, { status });
      setSessions(prev =>
        prev.map(session =>
          session.session_id === id ? { ...session, status } : session
        )
      );
    } catch (err) {
      console.error('Failed to update session status:', err);
    }
  };

  const confirmAction = () => {
    handleStatusChange(modalInfo.sessionId, modalInfo.action);
    saveStatus(modalInfo.sessionId);
    setModalInfo({ open: false, sessionId: null, action: '' });
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
                    <th className="border px-4 py-2 text-left">Student</th>
                    <th className="border px-4 py-2 text-left">Date</th>
                    <th className="border px-4 py-2 text-left">Time</th>
                    <th className="border px-4 py-2 text-left">Status</th>
                    <th className="border px-4 py-2 text-left">Student Feedback</th>
                    <th className="border px-4 py-2 text-left">Request Status Update</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.map((session) => (
                    <tr key={session.session_id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{session.student_name}</td>
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
                        <div>
                          <div className="flex items-center text-yellow-500 text-sm">
                            {'★'.repeat(session.rating)}{'☆'.repeat(5 - session.rating)}
                            <span className="text-xs text-gray-500 ml-2">({session.rating}/5)</span>
                          </div>
                          <p className="text-sm italic text-gray-600 mt-1">{session.comment}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No feedback</span>
                      )}
                    </td>
                      <td className="border px-4 py-2">
                        {session.status === 'completed' && (
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => setModalInfo({ open: true, sessionId: session.session_id, action: 'confirmed' })}
                              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setModalInfo({ open: true, sessionId: session.session_id, action: 'missed' })}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                            >
                              Missed
                            </button>
                          </div>
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

      {/* Confirmation Modal */}
      {modalInfo.open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h3 className="text-lg font-semibold mb-4">Confirm Action</h3>
            <p className="mb-4">
              Are you sure you want to mark this session as <strong>{modalInfo.action}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalInfo({ open: false, sessionId: null, action: '' })}
                className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-3 py-1 text-white rounded ${
                  modalInfo.action === 'confirmed'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorSessionsPage;
