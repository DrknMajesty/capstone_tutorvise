import React, { useEffect, useState } from 'react';
import CalendarView from '../Components/CalendarView';
import ResponsiveNavbar from '../Components/Navbar';
import ApiService from '../utils/apiService';
import RescheduleModal from '../Components/RescheduleModal';
import Alert from '@mui/material/Alert';

export default function StaffSchedulesPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [alert, setAlert] = useState({ message: '', severity: '', show: false });
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const id = sessionStorage.getItem('user_id');
    if (!id) {
      console.warn('⚠️ No user_id found in sessionStorage');
    }
    setUserId(id);
    fetchStaffSchedules();
  }, []);

  async function fetchStaffSchedules() {
    setLoading(true);
    try {
      const res = await ApiService.get('/schedules/all');
      const data = res.data;

      const formattedEvents = data.map(schedule => {
        const scheduled = new Date(schedule.scheduled_date);
        const year = scheduled.getFullYear();
        const month = scheduled.getMonth();
        const day = scheduled.getDate();

        const [startHour, startMinute] = schedule.start_time.split(':').map(Number);
        const [endHour, endMinute] = schedule.end_time.split(':').map(Number);

        const start = new Date(year, month, day, startHour, startMinute);
        const end = new Date(year, month, day, endHour, endMinute);

        const studentName = `${schedule.student_first_name} ${schedule.student_last_name}`;
        const tutorName = `${schedule.tutor_first_name} ${schedule.tutor_last_name}`;

        return {
          ...schedule,
          title: `Tutorial: ${studentName} with ${tutorName}`,
          start,
          end,
          allDay: false
        };
      });
      setEvents(formattedEvents);
    } catch (err) {
      console.error('❌ Failed to load schedules:', err);
      setError('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  }

  const handleReschedule = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleModalSubmit = async (newDate, newStart, newEnd) => {
    const [year, month, day] = newDate.split('-').map(Number);
    const [startHour, startMinute] = newStart.split(':').map(Number);
    const [endHour, endMinute] = newEnd.split(':').map(Number);

    const newStartDate = new Date(year, month - 1, day, startHour, startMinute);
    const newEndDate = new Date(year, month - 1, day, endHour, endMinute);

    const conflict = events.some(e => {
      if (e.id === selectedEvent.id) return false;

      const eYear = e.start.getFullYear();
      const eMonth = e.start.getMonth() + 1;
      const eDay = e.start.getDate();

      if (eYear !== year || eMonth !== month || eDay !== day) return false;
      if (e.tutor_id !== selectedEvent.tutor_id && e.student_id !== selectedEvent.student_id) return false;

      return newStartDate < e.end && newEndDate > e.start;
    });

    if (conflict) {
      setAlert({ message: 'Conflict detected! Please choose a different time.', severity: 'error', show: true });
      return;
    }

    try {
      console.log('📤 Rescheduling with:', {
        user_id: userId,
        scheduled_date: newDate,
        start_time: newStart,
        end_time: newEnd
      });

      await ApiService.put(`/schedules/${selectedEvent.id}`, {
        user_id: userId,
        scheduled_date: newDate,
        start_time: newStart,
        end_time: newEnd,
      });

      setAlert({ message: 'Rescheduled successfully.', severity: 'success', show: true });
      setModalOpen(false);
      setSelectedEvent(null);
      fetchStaffSchedules();
    } catch (err) {
      console.error('❌ Rescheduling failed:', err);
      setAlert({ message: 'Rescheduling failed.', severity: 'error', show: true });
    }
  };

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
    <>
      <ResponsiveNavbar />
      <div className="h-24" />
      <div className="items-center justify-center flex flex-col">
        <div className="p-4 flex flex-col">
          {loading ? (
            <p>Loading schedules...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : events.length === 0 ? (
            <p>No schedules found.</p>
          ) : (
            <>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Tutorial Schedule Management</h1>
                <CalendarView events={events} onReschedule={handleReschedule} />
              </div>
              <RescheduleModal
                event={selectedEvent}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleModalSubmit}
              />
              {alert.show && (
                <div
                  className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-500 ${
                    fadeOut ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <Alert
                    severity={alert.severity}
                    onClose={() => setAlert({ ...alert, show: false })}
                    variant="filled"
                  >
                    {alert.message}
                  </Alert>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
