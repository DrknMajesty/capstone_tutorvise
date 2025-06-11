import React, { useEffect, useState } from 'react';
import ResponsiveNavbar from '../Components/Navbar';
import apiService from '../utils/apiService';

const StudentSessionsPage = () => {
  const username = sessionStorage.getItem('username') || '';
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(checkSessionStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await apiService.get(`/sessions/student/${username}`);
      setSessions(res.data);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    }
  };

  const checkSessionStatus = () => {
    const now = new Date();
    setSessions(prev => prev.map(session => {
      const sessionDate = new Date(session.scheduled_date);
      const startTime = new Date(`1970-01-01T${session.start_time}Z`);
      const endTime = new Date(`1970-01-01T${session.end_time}Z`);

      const sessionStart = new Date(sessionDate);
      sessionStart.setHours(startTime.getHours(), startTime.getMinutes());
      
      const sessionEnd = new Date(sessionDate);
      sessionEnd.setHours(endTime.getHours(), endTime.getMinutes());

      if (now >= sessionStart && now <= sessionEnd && session.status !== 'completed') {
        return { ...session, status: 'ongoing' };
      } else if (now > sessionEnd && session.status === 'ongoing') {
        return { ...session, status: 'completed' };
      }
      return session;
    }));
  };

  return (
    <div>
      <ResponsiveNavbar username={username} />
      <div className="h-24" />

      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-2xl font-bold mb-6">My Sessions</h1>
        <div className="grid gap-4">
          {sessions.map((session) => (
            <div
              key={session.session_id}
              className="border border-gray-300 rounded-md p-4"
            >
              <div>
                <p><strong>Tutor:</strong> {session.tutor_name}</p>
                <p><strong>Date:</strong> {new Date(session.scheduled_date).toISOString().slice(0, 10)}</p>
                <p><strong>Time:</strong>   
                  {new Date(`1970-01-01T${session.start_time}Z`).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })} - 
                  {new Date(`1970-01-01T${session.end_time}Z`).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
                <p><strong>Status:</strong> {session.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentSessionsPage;