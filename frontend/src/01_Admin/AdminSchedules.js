// Updated AdminSchedules.js with correct date parsing using scheduled_date datetime
import React, { useEffect, useState } from 'react';
import CalendarView from '../Components/CalendarView';
import ResponsiveNavbar from '../Components/Navbar';
import ApiService from '../utils/apiService';
import RescheduleModal from '../Components/RescheduleModal';

export default function SchedulePage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchedules();
  }, []);

  async function fetchSchedules() {
    setLoading(true);

    try {
      const res = await ApiService.get('/schedules/all');
      const data = res.data;
      console.log("Data:", res.data) 

      const formattedEvents = data.map(schedule => {
        const scheduled = new Date(schedule.scheduled_date);

        // Extract local year/month/day
        const year = scheduled.getFullYear();  // local time
        const month = scheduled.getMonth();    // 0-indexed
        const day = scheduled.getDate();

        // Parse start/end time
        const [startHour, startMinute] = schedule.start_time.split(':').map(Number);
        const [endHour, endMinute] = schedule.end_time.split(':').map(Number);

        // Create local Date objects — DO NOT use Date.UTC here
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
      setError('Failed to load schedules:');
    } finally {
      setLoading(false);
    }
  }

    const handleReschedule = (event) => {
      setSelectedEvent(event);
      setModalOpen(true);
    };

const handleModalSubmit = async (newDate, newStart, newEnd) => {
  // Parse newDate parts
  const [year, month, day] = newDate.split('-').map(Number); // month: 1-based
  const [startHour, startMinute] = newStart.split(':').map(Number);
  const [endHour, endMinute] = newEnd.split(':').map(Number);

  // Create Date objects in LOCAL timezone (monthIndex = month-1)
  const newStartDate = new Date(year, month - 1, day, startHour, startMinute);
  const newEndDate = new Date(year, month - 1, day, endHour, endMinute);

  // Conflict detection
  const conflict = events.some(e => {
    if (e.id === selectedEvent.id) return false;

    const eYear = e.start.getFullYear();
    const eMonth = e.start.getMonth() + 1; // monthIndex to 1-based
    const eDay = e.start.getDate();

    if (eYear !== year || eMonth !== month || eDay !== day) return false;

    if (e.tutor_id !== selectedEvent.tutor_id && e.student_id !== selectedEvent.student_id) return false;

    // Check for overlap:
    // Overlap if start < e.end && end > e.start
    return newStartDate < e.end && newEndDate > e.start;
  });

  if (conflict) {
    alert('Conflict detected! Please choose a different time.');
    return;
  }

  try {
    await ApiService.put(`/schedules/${selectedEvent.id}`, {
      scheduled_date: newDate,
      start_time: newStart,
      end_time: newEnd,
    });

    alert('Rescheduled successfully');
    setModalOpen(false);
    setSelectedEvent(null);
    fetchSchedules();
  } catch (err) {
    console.error('Failed to reschedule:', err);
    alert('Rescheduling failed.');
  }
};

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
            <p>Login Token Expire.</p>
          ) : (
          <>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Tutorial Schedule</h1>
              <CalendarView events={events} onReschedule={handleReschedule} />
            </div>
            <RescheduleModal
              event={selectedEvent}
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              onSubmit={handleModalSubmit}
            />        
          </>
          )}
        </div>
     </div>
    </>
  );
}
