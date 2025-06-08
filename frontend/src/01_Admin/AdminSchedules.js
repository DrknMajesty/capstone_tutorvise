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
        // Parse the scheduled_date as a Date object (UTC)
        const scheduled = new Date(schedule.scheduled_date);

        // Extract UTC year, month, day
        const year = scheduled.getUTCFullYear();
        const month = scheduled.getUTCMonth();
        const day = scheduled.getUTCDate();

        // Parse start/end time strings "HH:mm:ss"
        const [startHour, startMinute] = schedule.start_time.split(':').map(Number);
        const [endHour, endMinute] = schedule.end_time.split(':').map(Number);

        // Create UTC Date objects for start and end
        const startUTC = new Date(Date.UTC(year, month, day, startHour, startMinute));
        const endUTC = new Date(Date.UTC(year, month, day, endHour, endMinute));

        // Convert UTC Date objects to local Date objects
        const start = new Date(startUTC.getTime() + startUTC.getTimezoneOffset() * 60000 * -1);
        const end = new Date(endUTC.getTime() + endUTC.getTimezoneOffset() * 60000 * -1);

        return {
          ...schedule,
          title: 'Tutorial Event',
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
