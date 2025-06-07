import React, { useState } from 'react';

function formatTimeTo12Hour(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return '';

  const [hourStr, minuteStr] = timeStr.split(':');
  let hours = parseInt(hourStr, 10);
  const minutes = minuteStr.padStart(2, '0');

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

const BookingList = ({ bookings = [], onAccept, onCancel, title, role = 'tutor' }) => {
  const grouped = bookings.reduce((acc, booking) => {
    const key = booking.application_id || 'unknown';
    if (!acc[key]) {
      acc[key] = {
        studentName: booking.student_name || 'Unknown Student',
        bookings: [],
      };
    }
    acc[key].bookings.push(booking);
    return acc;
  }, {});

  const [expandedGroups, setExpandedGroups] = useState({});

  const toggleGroup = (key) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <h2 className="text-xl font-bold mb-4">{title || 'Bookings'}</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        Object.entries(grouped).map(([appId, group]) => (
          <div key={appId} className="mb-6 border rounded">
            <button
              onClick={() => toggleGroup(appId)}
              className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 flex justify-between items-center font-semibold"
            >
              <span>Application ID: {appId} ({group.studentName})</span>
              <span>{expandedGroups[appId] ? '▲' : '▼'}</span>
            </button>

            {expandedGroups[appId] && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-sm text-gray-600">
                    <th className="p-2">#</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Timeslot</th>
                    <th className="p-2">Status</th>
                    {role !== 'tutor' && <th className="p-2">Tutor</th>}
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {group.bookings.map((booking, index) => (
                    <tr key={booking.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{new Date(booking.session_date).toLocaleDateString()}</td>
                      <td className="p-2">
                        {formatTimeTo12Hour(booking.snapshot_start_time)} - {formatTimeTo12Hour(booking.snapshot_end_time)}
                      </td>
                      <td className="p-2 capitalize">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium
                            ${booking.booking_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            booking.booking_status === 'scheduled' || booking.booking_status === 'accepted' ? 'bg-green-100 text-green-700' :
                            booking.booking_status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}
                        >
                          {booking.booking_status}
                        </span>
                      </td>
                      {role !== 'tutor' && (
                        <td className="p-2">{booking.tutor_name || 'N/A'}</td>
                      )}
                      <td className="p-2">
                        {/* Role-Based Actions */}
                        {(role === 'tutor' || role === 'admin') && booking.booking_status === 'pending' && (
                          <button
                            onClick={() => onAccept?.(booking.booking_id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Confirm Booking
                          </button>
                        )}

                        {role === 'student' && ['scheduled', 'pending'].includes(booking.booking_status) && (
                          <button
                            onClick={() => onCancel?.(booking.booking_id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Cancel
                          </button>
                        )}

                        {/* {(!((role === '' && booking.booking_status === 'pending') ||
                            (role === 'student' && ['scheduled', 'pending'].includes(booking.booking_status)))) && (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )} */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default BookingList;
