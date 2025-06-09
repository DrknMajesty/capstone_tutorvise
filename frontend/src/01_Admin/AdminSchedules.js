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

  useEffect(() => {
    fetchSchedules();
  }, []);

  async function fetchSchedules() {
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
      console.error('Failed to load schedules:', err);
    }
  }

  const handleReschedule = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleModalSubmit = async (newStart, newEnd) => {
    const dateOnly = selectedEvent.start.toISOString().split('T')[0];
    const newStartDate = new Date(`${dateOnly}T${newStart}`);
    const newEndDate = new Date(`${dateOnly}T${newEnd}`);

    const conflict = events.some(e =>
      e.id !== selectedEvent.id &&
      e.start.toISOString().split('T')[0] === dateOnly &&
      (
        (newStartDate >= e.start && newStartDate < e.end) ||
        (newEndDate > e.start && newEndDate <= e.end) ||
        (newStartDate <= e.start && newEndDate >= e.end)
      )
    );

    if (conflict) {
      alert('Conflict detected! Please choose a different time.');
      return;
    }

    try {
      await ApiService.put(`/schedules/${selectedEvent.id}`, {
        scheduled_date: dateOnly,
        start_time: newStart,
        end_time: newEnd
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
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Admin Schedule</h1>
          <CalendarView events={events} onReschedule={handleReschedule} />
        </div>
      </div>
      <RescheduleModal
        event={selectedEvent}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </>
  );
}
