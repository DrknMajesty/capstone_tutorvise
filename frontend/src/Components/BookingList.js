import React, { useState } from 'react';
import FloatingField from './FloatingFields';

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
  const [selectedAppId, setSelectedAppId] = useState('');

  // Extract unique applications as [id, student_name]
  const applications = Array.from(
    new Map(
      bookings
        .filter(b => b.application_id !== undefined && b.application_id !== null)
        .map(b => [String(b.application_id), b.student_name || 'Unknown Student'])
    ).entries()
  );

  const filteredBookings = bookings.filter(
    b => String(b.application_id) === String(selectedAppId)
  );

  const studentName = applications.find(([id]) => id === selectedAppId)?.[1];

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <h2 className="text-xl font-bold mb-4">{title || 'Bookings'}</h2>

      {/* Application Selector */}
      <div className="mb-4">
        <FloatingField
          type="select"
          name="applicationSelector"
          label="Select an Application"
          value={selectedAppId}
          onChange={(e) => setSelectedAppId(e.target.value)}
          required
          options={[
            { value: "", label: "-- Select an application --" },
            ...applications.map(([appId, student]) => ({
              value: appId,
              label: `${appId} (${student})`
            }))
          ]}
        />
      </div>

      {/* Booking Table */}
      {selectedAppId === '' ? (
        <p className="text-gray-500">Please select an application to view bookings.</p>
      ) : filteredBookings.length === 0 ? (
        <p className="text-gray-500">No bookings found for this application.</p>
      ) : (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            Bookings for Application: {selectedAppId} ({studentName})
          </h3>
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
              {filteredBookings.map((booking, index) => (
                <tr key={booking.booking_id} className="border-b hover:bg-gray-50">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingList;
