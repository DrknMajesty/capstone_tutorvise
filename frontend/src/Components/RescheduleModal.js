import React, { useState, useEffect } from 'react';

export default function RescheduleModal({ event, isOpen, onClose, onSubmit }) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    if (event) {
      const start = event.start.toTimeString().slice(0, 5);
      const end = event.end.toTimeString().slice(0, 5);
      setStartTime(start);
      setEndTime(end);
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (endTime <= startTime) {
      alert("End time must be after start time.");
      return;
    }

    onSubmit(startTime, endTime);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Reschedule Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">New Start Time</label>
            <input
              type="time"
              className="w-full border px-3 py-2 rounded"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
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
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
