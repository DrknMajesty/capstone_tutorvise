import React, { useEffect, useState } from 'react';
import ResponsiveNavbar from '../Components/Navbar';
import apiService from '../utils/apiService';

const AdminSessionsPage = () => {
  const username = sessionStorage.getItem('username') || '';
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [sessionLogs, setSessionLogs] = useState([]);

  useEffect(() => {
    fetchSessions();
    fetchSessionLogs();
    const interval = setInterval(fetchSessions, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterSessionsByDate(selectedDate);
  }, [sessions, selectedDate]);

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

  const filterSessionsByDate = (dateStr) => {
    const filtered = sessions.filter(session => {
      const localDate = new Date(session.scheduled_date);
      const adjustedDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000)
                            .toISOString().split('T')[0];
      return adjustedDate === dateStr;
    });
    setFilteredSessions(filtered);
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
      fetchSessionLogs();
    } catch (err) {
      console.error('Failed to update session status:', err);
    }
  };

  return (
    <div>
      <ResponsiveNavbar username={username} />
      <div className="h-24" />
      <div className="items-center justify-center flex flex-col">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-2xl font-bold mb-4">Manage Sessions</h1>

        <label className="block mb-4">
          <span className="font-medium">Select Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="border border-gray-300 rounded-md px-3 py-1 ml-2"
          />
        </label>

        {filteredSessions.length === 0 ? (
          <p className="text-gray-500">No current session on selected date</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Student</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Tutor</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Time</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Update</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session) => (
                  <tr key={session.session_id}>
                    <td className="border border-gray-300 px-4 py-2">{session.student_name}</td>
                    <td className="border border-gray-300 px-4 py-2">{session.tutor_name}</td>
                    <td className="border border-gray-300 px-4 py-2">{new Date(session.scheduled_date).toLocaleDateString()}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(`1970-01-01T${session.start_time}Z`).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{session.status}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <select
                        className="border px-2 py-1 rounded mr-2"
                        value={statusUpdates[session.session_id] || ''}
                        onChange={(e) => handleStatusChange(session.session_id, e.target.value)}
                        disabled={session.status !== 'completed'}
                      >
                        <option value="">Select Status</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="missed">Missed</option>
                      </select>
                      <button
                        onClick={() => saveStatus(session.session_id)}
                        className={`px-4 py-1 rounded text-white ${session.status !== 'completed' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                        disabled={session.status !== 'completed'}
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Sessions Log</h2>
          {sessionLogs.length === 0 ? (
            <p className="text-gray-500">No recent updates</p>
          ) : (
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
                            {new Date(`1970-01-01T${log.start_time}Z`).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </td>
                          <td className="p-2 capitalize">{log.status}</td>
                          <td className="p-2 italic">{new Date(log.updated_at).toLocaleString()}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default AdminSessionsPage;
