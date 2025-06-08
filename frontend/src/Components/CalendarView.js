// Updated CalendarView.js
import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function CalendarView({ events, onReschedule }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    const filtered = events.filter(event =>
      event.start.toISOString().startsWith(arg.dateStr)
    );
    setSelectedEvents(filtered);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: 'prev,next today',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        dateClick={handleDateClick}
        height="auto"
      />

      {selectedDate && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Schedules on {selectedDate}</h2>
          <ul className="mt-2 space-y-2">
            {selectedEvents.map((event, index) => (
              <li key={index} className="flex justify-between items-center border p-2 rounded">
                <span>
                  {event.title} ({event.start.toLocaleTimeString()} - {event.end.toLocaleTimeString()})
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
        </div>
      )}
    </div>
  );
}
