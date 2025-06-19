// StaffSessionsPage.js
import React, { useEffect, useState } from 'react';
import ResponsiveNavbar from '../Components/Navbar';
import apiService from '../utils/apiService';
import Alert from '@mui/material/Alert';

const StaffSessionsPage = () => {
  const username = sessionStorage.getItem('username') || '';
  const [sessions, setSessions] = useState([]);
  const [sessionLogs, setSessionLogs] = useState([]);
  const [modalInfo, setModalInfo] = useState({ open: false, sessionId: null, status: '' });
  const [userId, setUserId] = useState(null);

  const todayDate = new Date().toISOString().split('T')[0];
  const [alert, setAlert] = useState({ message: '', severity: '', show: false });
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const id = sessionStorage.getItem('user_id');
    if (!id) {
      console.warn('⚠️ No user_id found in sessionStorage');
    }
    setUserId(id);
    fetchSessions();
    fetchSessionLogs();
    const interval = setInterval(fetchSessions, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await apiService.get('/sessions');
      setSessions(res.data);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    }
  };

  const fetchSessionLogs = async () => {
    try {
      const res = await apiService.get('/sessions/logs');
      setSessionLogs(res.data);
    } catch (err) {
      console.error('Failed to load session logs:', err);
    }
  };

  const confirmStatusUpdate = async () => {
    const { sessionId, status } = modalInfo;
    try {
      await apiService.put(`/sessions/${sessionId}/status`, { 
        status,
        user_id: userId  
      });
      setSessions(prev =>
        prev.map(session =>
          session.session_id === sessionId ? { ...session, status } : session
        )
      );
      fetchSessionLogs();
      setAlert({ message: `Session marked as ${status}.`, severity: 'success', show: true });
    } catch (err) {
      console.error('Failed to update session status:', err);
      setAlert({ message: 'Failed to update session status.', severity: 'error', show: true });
    } finally {
      setModalInfo({ open: false, sessionId: null, status: '' });
    }
  };


  const filteredSessions = sessions.filter(session => {
    const localDate = new Date(session.scheduled_date);
    const adjustedDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000)
                          .toISOString().split('T')[0];
    return adjustedDate === todayDate;
  });

  const SessionTable = ({ data }) => (
    <div className="overflow-x-auto mb-10">
      <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Student</th>
            <th className="border px-4 py-2 text-left">Tutor</th>
            <th className="border px-4 py-2 text-left">Date</th>
            <th className="border px-4 py-2 text-left">Time</th>
            <th className="border px-4 py-2 text-left">Status</th>
            <th className="border px-4 py-2 text-left">Update Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((session) => (
            <tr key={session.session_id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{session.student_name}</td>
              <td className="border px-4 py-2">{session.tutor_name}</td>
              <td className="border px-4 py-2">{new Date(session.scheduled_date).toLocaleDateString()}</td>
              <td className="border px-4 py-2">
                {new Date(`1970-01-01T${session.start_time}`).toLocaleTimeString([], {
                  hour: '2-digit', minute: '2-digit', hour12: true,
                })}
              </td>
              <td className="border px-4 py-2 capitalize">{session.status}</td>
              <td className="border px-4 py-2">
                {session.status === 'completed' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setModalInfo({ open: true, sessionId: session.session_id, status: 'confirmed' })}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setModalInfo({ open: true, sessionId: session.session_id, status: 'missed' })}
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
  );

  useEffect(() => {
  if (alert.show) {
    const fadeTimer = setTimeout(() => setFadeOut(true), 3500);
    const hideTimer = setTimeout(() => {
      setAlert({ ...alert, show: false });
      setFadeOut(false);
    }, 4000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }
}, [alert]);


  return (
    <div>
      <ResponsiveNavbar username={username} />
      <div className="h-24" />
      <div className="items-center justify-center flex flex-col">
        <div className="max-w-5xl w-full mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Today's Sessions</h1>

          <div className="mb-6">
            <h2 className="text-lg font-medium">Sessions for: {todayDate}</h2>
          </div>

          {filteredSessions.length === 0 ? (
            <p className="text-gray-500 mb-8">No sessions scheduled for today.</p>
          ) : (
            <SessionTable data={filteredSessions} />
          )}

          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Session Logs</h2>
            {sessionLogs.length === 0 ? (
              <p className="text-gray-500">No recent updates.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700 border border-gray-200 rounded">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2">Student</th>
                      <th className="p-2">Tutor</th>
                      <th className="p-2">Date</th>
                      <th className="p-2">Time</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Updated At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessionLogs
                      .filter(log => log.status === 'confirmed' || log.status === 'missed')
                      .map((log, index) => (
                        <tr key={index} className="border-t border-gray-200">
                          <td className="p-2">{log.student_name}</td>
                          <td className="p-2">{log.tutor_name}</td>
                          <td className="p-2">{new Date(log.scheduled_date).toLocaleDateString()}</td>
                          <td className="p-2">
                            {new Date(`1970-01-01T${log.start_time}`).toLocaleTimeString([], {
                              hour: '2-digit', minute: '2-digit', hour12: true,
                            })}
                          </td>
                          <td className="p-2 capitalize">{log.status}</td>
                          <td className="p-2 italic">{new Date(log.updated_at).toLocaleString()}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {modalInfo.open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h3 className="text-lg font-semibold mb-4">Confirm Action</h3>
            <p className="mb-4">Are you sure you want to mark this session as <strong>{modalInfo.status}</strong>?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalInfo({ open: false, sessionId: null, status: '' })}
                className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusUpdate}
                className={`px-3 py-1 text-white rounded ${modalInfo.status === 'confirmed' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {alert.show && (
        <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-500 ${
          fadeOut ? 'opacity-0' : 'opacity-100'
        }`}>
          <Alert
            severity={alert.severity}
            variant="filled"
            onClose={() => setAlert({ ...alert, show: false })}
          >
            {alert.message}
          </Alert>
        </div>
      )}
    </div>
  );
};

export default StaffSessionsPage;
