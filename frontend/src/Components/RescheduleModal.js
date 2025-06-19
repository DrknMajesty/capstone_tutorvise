import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';

export default function RescheduleModal({ event, isOpen, onClose, onSubmit }) {
  const [sessionDate, setSessionDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [alert, setAlert] = useState({ message: '', severity: '', show: false });
  const [fadeOut, setFadeOut] = useState(false);
  
  // Reset state on modal close
  useEffect(() => {
    if (!isOpen) {
      setSessionDate('');
      setStartTime('');
      setEndTime('');
    }
  }, [isOpen]);

  // Set initial values when modal opens
  useEffect(() => {
    if (event && isOpen) {
      const date = formatDateForInput(event.start);
      const start = formatTimeForInput(event.start);
      const end = formatTimeForInput(event.end);

      setSessionDate(date);
      setStartTime(start);
      setEndTime(end);
    }
  }, [event, isOpen]);

  // Helper functions to format date and time for input fields
  const formatDateForInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTimeForInput = (date) => {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Generate end time automatically 1 hour after start time
  const generateEndTime = (start) => {
    if (!start) return;

    const [hour, minute] = start.split(':').map(Number);
    const endHour = (hour + 1) % 24;
    const endHourStr = String(endHour).padStart(2, '0');
    const endMinuteStr = String(minute).padStart(2, '0');

    setEndTime(`${endHourStr}:${endMinuteStr}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (endTime <= startTime) {
      setAlert({
        message: 'End time must be after start time.',
        severity: 'error',
        show: true,
      });
      return;
    }

    onSubmit(sessionDate, startTime, endTime);
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

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Reschedule Booking</h2>
        <h1 className="text-m mb-2">
          <strong>ScheduleID:</strong> {`${event.id}`}
        </h1>
        <h1 className="text-m mb-2">
          <strong>Student:</strong> {`${event.student_last_name}, ${event.student_first_name}`}
        </h1>
        <h1 className="text-m mb-2">
          <strong>Tutor:</strong> {`${event.tutor_last_name}, ${event.tutor_first_name}`}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">New Date</label>
            <input
              type="date"
              className="w-full border px-3 py-2 rounded"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">New Start Time</label>
            <input
              type="time"
              className="w-full border px-3 py-2 rounded"
              value={startTime}
              onChange={(e) => {
                const value = e.target.value;
                setStartTime(value);
                generateEndTime(value);
              }}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">New End Time</label>
            <input
              type="time"
              className="w-full border px-3 py-2 rounded"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              readOnly
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              disabled={endTime <= startTime}
            >
              Save
            </button>
          </div>
        </form>
      </div>
       {alert.show && (
              <div
                className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-500 ${
                  fadeOut ? 'opacity-0' : 'opacity-100'
                }`}
              >
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
}