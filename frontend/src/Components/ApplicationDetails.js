import React, { useState } from 'react';
import apiService from '../utils/apiService';

const ApplicationDetails = ({ application, fetchApplication, hasExpired }) => {
  const [paymentProof, setPaymentProof] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedWeekday, setSelectedWeekday] = useState(null);

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const formatTime12h = (time) => {
    if (!time) return '';
    const [hourStr, minute] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const previewPaymentProof = () => {
    if (application?.payment_proof) {
      window.open(`http://localhost:5000/uploads/payment_proofs/${application.payment_proof}`, '_blank');
    }
  };

  const handleFileChange = (e) => {
    setPaymentProof(e.target.files[0]);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentProof) return alert("Please select a file.");

    const formData = new FormData();
    formData.append('payment_proof', paymentProof);

    try {
      await apiService.post(`/applications/submit-proof/${application.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Payment proof submitted. Waiting for admin approval.');
      fetchApplication();
    } catch (err) {
      alert('Failed to submit payment proof.');
    }
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateStr = date.toISOString().split('T')[0];
      const isSelected = selectedDates.includes(dateStr);
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
      const dayOfWeek = date.getDay();

      days.push(
        <div
          key={day}
          onClick={() => !isPast && handleDateSelect(date)}
          className={`p-2 border rounded text-center cursor-pointer ${
            isSelected ? 'bg-blue-500 text-white' : 
            isPast ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 
            'hover:bg-gray-100'
          }`}
          title={weekdays[dayOfWeek]}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const handleDateSelect = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDates(prev => {
      if (prev.includes(dateStr)) {
        return prev.filter(d => d !== dateStr);
      } else {
        return [...prev, dateStr];
      }
    });
  };

  const handleMonthChange = (increment) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
    setSelectedWeekday(null); // Reset weekday selection when month changes
  };

  const handleWeekdaySelect = (weekdayIndex) => {
    setSelectedWeekday(prev => prev === weekdayIndex ? null : weekdayIndex);
    
    const daysInMonth = getDaysInMonth(currentMonth);
    const newSelectedDates = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (date.getDay() === weekdayIndex) {
        const dateStr = date.toISOString().split('T')[0];
        if (date >= new Date(new Date().setHours(0, 0, 0, 0))) {
          newSelectedDates.push(dateStr);
        }
      }
    }

    setSelectedDates(prev => {
      // If all weekday dates are already selected, deselect them
      const allAlreadySelected = newSelectedDates.every(date => prev.includes(date));
      if (allAlreadySelected) {
        return prev.filter(date => !newSelectedDates.includes(date));
      }
      // Otherwise add the new dates, removing duplicates
      return [...new Set([...prev, ...newSelectedDates])];
    });
  };

  const handleSessionBooking = async () => {
    if (selectedDates.length === 0) {
      return alert('Please select at least one date');
    }

    try {
      await apiService.post('/bookings/schedule-sessions', {
        application_id: application.id,
        dates: selectedDates
      });
      alert('Sessions booked successfully!');
      setShowCalendar(false);
      setSelectedDates([]);
      setSelectedWeekday(null);
      fetchApplication();
    } catch (err) {
      alert('Failed to book sessions: ' + (err.response?.data?.message || ''));
    }
  };

  if (application.application_status === 'approved') {
    return (
      <div className="mt-4 w-full bg-white p-6 rounded-lg shadow-lg border border-gray-300">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Application Details</h2>
        <p><strong>Application ID:</strong> {application.id}</p>
        <p><strong>Package:</strong> {application.package_name}</p>
        <p><strong>Tutor:</strong> {application.tutor_fname} {application.tutor_lname}</p>
        <p><strong>Timeslot:</strong> {formatTime12h(application.snapshot_start_time)} - {formatTime12h(application.snapshot_end_time)}</p>
        <p className='capitalize'><strong>Status:</strong> {application.application_status}</p>
        <p><strong>Date Applied:</strong> {application.created_at}</p>
        
        <div className="mt-6">
          {!showCalendar ? (
            <button
              onClick={() => setShowCalendar(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Book Session Dates
            </button>
          ) : (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Select Dates for Sessions</h3>
              
              {/* Month navigation */}
              <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={() => handleMonthChange(-1)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  &lt; Prev
                </button>
                <h4 className="text-xl font-bold">
                  {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h4>
                <button 
                  onClick={() => handleMonthChange(1)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Next &gt;
                </button>
              </div>

              {/* Weekday selector */}
              <div className="flex justify-between mb-2">
                {weekdays.map((day, index) => (
                  <button
                    key={day}
                    onClick={() => handleWeekdaySelect(index)}
                    className={`px-2 py-1 text-sm rounded ${
                      selectedWeekday === index ? 'bg-blue-200 font-semibold' : 'hover:bg-gray-100'
                    }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>

              {/* Calendar grid with weekday headers */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {weekdays.map(day => (
                  <div key={day} className="text-center font-semibold p-1 text-sm">
                    {day.substring(0, 1)}
                  </div>
                ))}
                {renderCalendar()}
              </div>

              {/* Selected dates summary */}
              {selectedDates.length > 0 && (
                <div className="mb-4">
                  <p className="font-semibold">Selected Dates ({selectedDates.length}):</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedDates
                      .sort()
                      .map(date => (
                        <span 
                          key={date} 
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                        >
                          {new Date(date).toLocaleDateString()}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowCalendar(false);
                    setSelectedDates([]);
                    setSelectedWeekday(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSessionBooking}
                  disabled={selectedDates.length === 0}
                  className={`px-4 py-2 rounded text-white ${
                    selectedDates.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  Confirm {selectedDates.length} Session{selectedDates.length !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 w-full bg-white p-6 rounded-lg shadow-lg border border-gray-300">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Application Details</h2>
      <p><strong>Application ID:</strong> {application.id}</p>
      <p><strong>Package:</strong> {application.package_name}</p>
      <p><strong>Tutor:</strong> {application.tutor_fname} {application.tutor_lname}</p>
      <p><strong>Timeslot:</strong> {formatTime12h(application.snapshot_start_time)} - {formatTime12h(application.snapshot_end_time)}</p>
      <p className='capitalize'><strong>Status:</strong> {application.application_status}</p>
      <p><strong>Date Applied:</strong> {application.created_at}</p>
      
      <div className="mt-4">
        {application.application_status === 'pending' ? (
          <>
            <p className="text-yellow-700 font-semibold">Please submit payment proof before the deadline.</p>
            
            <form onSubmit={handlePaymentSubmit} encType="multipart/form-data" className="mt-4">
              <input
                type="file"
                name="payment_proof"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="mb-2"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Submit Payment Proof
              </button>
            </form>
          </>
        ) : (
          <div className="mt-4">
            <p className="text-green-700 font-semibold">Payment proof submitted and awaiting review.</p>
            {application.payment_proof && (
              <div className="mt-2">
                <button
                  onClick={previewPaymentProof}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  View Payment Proof
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetails;