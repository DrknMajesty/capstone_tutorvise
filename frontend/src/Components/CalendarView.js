import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function CalendarView({ events, onReschedule }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleDateClick = (arg) => {
    const clickedDate = new Date(arg.dateStr); // Local date
    setSelectedDate(clickedDate);

    const filtered = events.filter(event => isSameDay(event.start, clickedDate));
    setSelectedEvents(filtered);
  };

  const formatDateString = (date) => {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: 'prev,next today',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        dateClick={handleDateClick}
        height="auto"
      />

      {selectedDate && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">
            Schedules on {formatDateString(selectedDate)}
          </h2>
          {selectedEvents.length === 0 ? (
            <p className="text-gray-500 mt-2">No schedules for this date.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {selectedEvents.map((event, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <span>
                    {event.title} ({event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                  </span>
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => onReschedule(event)}
                  >
                    Reschedule
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
