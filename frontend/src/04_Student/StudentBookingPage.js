import React, { useCallback, useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import ResponsiveNavbar from '../Components/Navbar';
import apiService from '../utils/apiService';

const StudentBookingPage = () => {
  const [packages, setPackages] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [application, setApplication] = useState(null);
  const [paymentProof, setPaymentProof] = useState(null);
  const [hasExpired, setHasExpired] = useState(false);
  const [isDone, setisDone] = useState(false);
  const [wasCancelled, setWasCancelled] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedWeekday, setSelectedWeekday] = useState(null);
  const [alert, setAlert] = useState({ message: '', severity: '', show: false });
  const [fadeOut, setFadeOut] = useState(false);

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const userId = parseInt(sessionStorage.getItem('user_id'), 10);

  const [bookedDates, setBookedDates] = useState([]);

  const calculateTotalPrice = (price_package, total_sessions, price_sessions) => {
    const totalPrice = parseFloat(price_package || 0) + (parseInt(total_sessions || 0) * parseFloat(price_sessions || 0));
    return parseFloat(totalPrice.toFixed(2));
  };

  const formatCurrency = (amount) => `₱${amount.toFixed(2)}`;

  useEffect(() => {
    if (alert.show) {
      // Start fade-out after 3.5s
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 3500);
  
        // Fully hide after fade ends (e.g., 500ms later)
      const hideTimer = setTimeout(() => {
      setAlert({ ...alert, show: false });
        setFadeOut(false); // reset
      }, 4000);
      
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [alert]);
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

    // Map of booked date strings -> booking status
    const bookingStatusMap = {};
    bookedDates.forEach(b => {
      const dateOnly = formatDateLocal(new Date(b.session_date));
      bookingStatusMap[dateOnly] = b.status;
    });

    // Empty cells before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Calendar day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateStr = formatDateLocal(date);
      const isSelected = selectedDates.includes(dateStr);
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
      const dayOfWeek = date.getDay();
      const bookingStatus = bookingStatusMap[dateStr];
      const isBooked = !!bookingStatus;

      let className = "p-2 border rounded text-center ";

      // Cursor and click state
      const isClickable = !isPast && !isBooked;
      className += isClickable ? "cursor-pointer hover:bg-gray-100 " : "cursor-not-allowed ";

      // Status color logic
      if (isSelected) {
        className += "bg-blue-500 text-white ";
      } else if (isPast) {
        className += "bg-gray-100 text-gray-400 ";
      }

      if (bookingStatus === 'pending') {
        className += "bg-yellow-100 border-yellow-400 ";
      } else if (bookingStatus === 'scheduled' || bookingStatus === 'accepted') {
        className += "bg-green-100 border-green-400 ";
      } else if (bookingStatus === 'cancelled') {
        className += "bg-red-100 border-red-400 ";
      }

      days.push(
        <div
          key={day}
          onClick={() => isClickable && handleDateSelect(date)}
          className={className}
          title={`${weekdays[dayOfWeek]}${bookingStatus ? ` - ${bookingStatus}` : ''}`}
        >
          {day}
        </div>
      );
    }

    return days;
  };


  const handleDateSelect = (date) => {
    const dateStr = formatDateLocal(date);
    setSelectedDates(prev => {
      if (prev.includes(dateStr)) {
        return prev.filter(d => d !== dateStr);
      } else if (prev.length < application.remaining_sessions) {
        return [...prev, dateStr];
      } else {
        setAlert({ message: `You can only book up to ${application.total_sessions} sessions.`, severity: 'error', show: true });
        return prev;
      }
    });
  };

  const handleMonthChange = (increment) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
    setSelectedWeekday(null);
  };

const handleWeekdaySelect = (weekdayIndex) => {
  setSelectedWeekday(prev => prev === weekdayIndex ? null : weekdayIndex);

  const daysInMonth = getDaysInMonth(currentMonth);
  const newDates = [];
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    if (date.getDay() === weekdayIndex && date >= new Date(new Date().setHours(0, 0, 0, 0))) {
      const dateStr = formatDateLocal(date);
      newDates.push(dateStr);
    }
  }

  setSelectedDates(prev => {
    const allAlreadySelected = newDates.every(date => prev.includes(date));

    if (allAlreadySelected) {
      // If all these weekday dates are already selected, remove them (toggle off)
      return prev.filter(date => !newDates.includes(date));
    }

    // Filter out duplicates and add only if under the allowed limit
    const remaining = application.remaining_sessions - prev.length;

    if (remaining <= 0) {
      setAlert({ message: `You can only book up to ${application.total_sessions} sessions.`, severity: 'error', show: true });
      return prev;
    }

    const datesToAdd = newDates.filter(date => !prev.includes(date)).slice(0, remaining);

    if (datesToAdd.length < newDates.length) {
      setAlert({ message: `Only ${datesToAdd.length} of the selected dates could be added (limit: ${application.total_sessions}).`, severity: 'warning', show: true });
      // alert(`Only ${datesToAdd.length} of the selected dates could be added (limit: ${application.total_sessions}).`);
    }

    return [...prev, ...datesToAdd];
  });
};


  const handleSessionBooking = async () => {
    if (selectedDates.length === 0) {
      setAlert({ message: 'Please select at least one date.', severity: 'error', show: true });
    }

    try {
      await apiService.post('/bookings/schedule-sessions', {
        application_id: application.id,
        dates: selectedDates
      });
      setAlert({ message: 'Sessions booked successfully!', severity: 'success', show: true });
      setShowCalendar(false);
      setSelectedDates([]);
      setSelectedWeekday(null);
      fetchApplication();
    } catch (err) {
      setAlert({ message: 'Failed to book sessions: ' + (err.response?.data?.message || ''), severity: 'error', show: true });
    }
  };

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
    if (!paymentProof) 
      return setAlert({ message: "Please select a file.", severity: 'error', show: true });

    const formData = new FormData();
    formData.append('payment_proof', paymentProof);

    try {
      await apiService.post(`/applications/submit-proof/${application.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAlert({ message: 'Payment proof submitted successfully. Waiting for admin approval.', severity: 'success', show: true });
      fetchApplication();
    } catch (err) {
      console.error('Error submitting payment proof:', err);
      setAlert({ message: 'Failed to submit payment proof: ' + (err.response?.data?.message || ''), severity: 'error', show: true });
    }
  };

  const checkApplicationExpiry = useCallback((app) => {
    if (!app || app.application_status === 'expired') return true;
    if (app.application_status === 'pending' &&
        new Date(app.deadline) < new Date() &&
        !app.payment_proof) {
      return true;
    }
    return false;
  }, []);

  const fetchApplication = useCallback(async () => {
    try {
      const res = await apiService.get(`/applications/my-applications/${userId}`);
      console.log("Data:", res);
      if (!res.data) {
        setApplication(null);
        setHasExpired(false);
        setWasCancelled(false);
        return;
      }

      const status = res.data.application_status;

      if (status === 'cancelled') {
        setWasCancelled(true);
        setHasExpired(false);
        setApplication(null);
        return;
      }

      if (status === 'done') {
        setisDone(true);
        setHasExpired(false);
        setApplication(null);
      }

      const isExpired = checkApplicationExpiry(res.data);

      if (isExpired) {
        setHasExpired(true);
        setWasCancelled(false);
        setApplication(null);
        return;
      }

      // Valid application
      setApplication(res.data);
      setBookedDates(res.data.bookings || []); // from extended API
      setHasExpired(false);
      setWasCancelled(false);
    } catch (err) {
      console.warn('Error fetching application:', err);
      setApplication(null);
      setHasExpired(false);
      setWasCancelled(false);
    }
  }, [userId, checkApplicationExpiry]);


  const fetchPackages = async () => {
    try {
      const res = await apiService.get('/bookings/avail-packages');
      setPackages(res.data);
    } catch (err) {
      setError('Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      try {
        await apiService.post('/applications/expire-applications');
        await fetchPackages();
        await fetchApplication();
      } catch (err) {
        console.error('Initialization error:', err);
      }
    };

    initializePage();
  }, [fetchApplication]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  useEffect(() => {
    if (hasExpired || wasCancelled) {
      const timer = setTimeout(() => {
        setHasExpired(false);
        setWasCancelled(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [hasExpired, wasCancelled]);


  const fetchTutors = async () => {
    try {
      const res = await apiService.get('/users/active-tutors');
      setTutors(res.data);
      console.log("Data:", res.data);
    } catch {
      setAlert({ message: 'Failed to fetch tutors.', severity: 'error', show: true });
    }
  };

  const [loadingTimeslots, setLoadingTimeslots] = useState(false);

  const fetchTimeslots = async (tutorId) => {
    setLoadingTimeslots(true);
    try {
      const res = await apiService.get(`/bookings/book-timeslots/${tutorId}`);
      setTimeslots(res.data);
      if (res.data.length === 0) {
        setAlert({ message: 'No available timeslots for this tutor. Please select another tutor.', severity: 'warning', show: true });
      }
    } catch (err) {
      console.error('Error fetching timeslots:', err);
      setAlert({ message: 'Failed to fetch timeslots. Please try again.', severity: 'error', show: true });
      setTimeslots([]);
    } finally {
      setLoadingTimeslots(false);
    }
  };

  const handleApplyClick = async (pkg) => {
    setSelectedPackage(pkg);
    setShowModal(true);
    setSelectedTutor(null);
    setSelectedSlot('');
    setTimeslots([]);
    await fetchTutors();
  };

  const handleTutorChange = async (e) => {
    const tutor = tutors.find(t => t.id === parseInt(e.target.value));
    setSelectedTutor(tutor);
    if (tutor) {
      await fetchTimeslots(tutor.id);
    }
  };

  const handleBookingSubmit = async () => {
    if (!selectedTutor || !selectedSlot) {
      return setAlert({ message: 'Please select a tutor and timeslot.', severity: 'error', show: true });
    }
    try {
      await apiService.post('/bookings/apply', {
        student_id: userId,
        package_id: selectedPackage.id,
        tutor_id: selectedTutor.id,
        timeslot_id: parseInt(selectedSlot, 10)
      });

      setSelectedTutor(null);
      setSelectedSlot('');
      setTimeslots([]);
      setShowModal(false);
      await fetchApplication();
      setAlert({ message: 'Booking submitted successfully. Please wait for admin approval.', severity: 'success', show: true });
    } catch (err) {
      console.error('Error submitting booking:', err);
      setAlert({ message: 'Failed to submit booking. ' + (err.response?.data?.message || ''), severity: 'error', show: true });
    }
  };

  const CountdownTimer = ({ deadline, onExpire }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
      const interval = setInterval(() => {
        const diff = new Date(deadline) - new Date();

        if (diff <= 0) {
          clearInterval(interval);
          setTimeLeft('Expired');
          if (onExpire) onExpire();
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }, [deadline, onExpire]);

    return <p className="text-red-600 font-bold">Time Left: {timeLeft}</p>;
  };

  const handleCancelApplication = async () => {
  if (!window.confirm('Are you sure you want to cancel this application?')) return;
  try {
    await apiService.post(`/applications/cancel/${application.id}`);
    setAlert({ message: 'Application cancelled successfully.', severity: 'success', show: true });
    setApplication(null);
    setPaymentProof(null);
    await fetchApplication();
  } catch (error) {
    console.error('Error cancelling application:', error);
    setAlert({ message: 'Failed to cancel application: ' + (error.response?.data?.message || ''), severity: 'error', show: true });
  }
};
  const formatDateLocal = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

  const shouldShowApplication = application && 
                              (application.application_status === 'pending' || 
                               application.application_status === 'submitted' || 
                               application.application_status === 'approved') && 
                              !hasExpired;

  const renderApplicationDetails = () => {
    if (application.application_status === 'approved') {
      return (
        <div className="mt-4 w-full bg-white p-6 rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Application Details</h2>
          <p><strong>Application ID:</strong> {application.id}</p>
          <p><strong>Package:</strong> {application.package_name}</p>
          <p><strong>Tutor:</strong> {application.tutor_fname} {application.tutor_lname} {application.gender === "male" && <span title="Male">♂️</span>} {application.gender === "female" && <span title="Female">♀️</span>}    
      </p>
          <p><strong>Timeslot:</strong> {formatTime12h(application.snapshot_start_time)} - {formatTime12h(application.snapshot_end_time)}</p>
          <p className='capitalize'><strong>Status:</strong> {application.application_status}</p>
          <p><strong>Date Applied:</strong> {new Date(application.created_at).toLocaleDateString()}</p>
          <p>
            <strong>Remaining Session:</strong>{' '}
            <span className="font-bold text-red-600">
              {application.remaining_sessions - selectedDates.length}
            </span>
          </p>

          
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

                <div className="flex items-start gap-8">
                  <h3 className="text-lg font-semibold mb-2">Select Dates for Sessions</h3>
                  {/* <h3 className="text-lg font-semibold mb-2">Legend: </h3> */}

                  <div className="flex gap-4 mt-2 text-sm">
                  <div className="flex items-center gap-1">
                    <span><strong>Legend:</strong> </span>
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-yellow-100 border border-yellow-400 rounded"></div>
                    <span>Pending</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-green-100 border border-green-400 rounded"></div>
                    <span>Scheduled</span>
                  </div>
                  {/* <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-red-100 border border-red-400 rounded"></div>
                    <span>Cancelled</span>
                  </div> */}
                </div>
                </div>
                
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

                  {/* WeekDay Selector */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {weekdays.map((day, index) => (
                    <div key={day} className="text-center font-semibold p-1 text-sm">
                      <button
                        key={day}
                        onClick={() => handleWeekdaySelect(index)}
                        className={`px-2 py-1 text-sm rounded ${
                          selectedWeekday === index ? 'bg-blue-200 font-semibold' : 'hover:bg-gray-100'
                        }`}
                      >
                        {day.substring(0, 3)}
                      </button>
                    </div>
                  ))}
                  {renderCalendar()}
                </div>

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
        <p><strong>Tutor:</strong> 
          {application.tutor_fname} 
          {application.tutor_lname}
          {application.gender === "male" && <span title="Male">♂️</span>}
          {application.gender === "female" && <span title="Female">♀️</span>}    
        </p>
        <p><strong>Timeslot:</strong> {formatTime12h(application.snapshot_start_time)} - {formatTime12h(application.snapshot_end_time)}</p>
        <p className='capitalize'><strong>Status:</strong> {application.application_status}</p>
        <p><strong>Date Applied:</strong> {new Date(application.created_at).toLocaleDateString()}</p>
        
        <div className="mt-4">
          {application.application_status === 'pending' ? (
            <>
              <p className="text-yellow-700 font-semibold">Please submit payment proof before the deadline.</p>
                    <CountdownTimer
                      deadline={application.deadline}
                      onExpire={async () => {
                        try {
                          await apiService.post(`/applications/expire/${application.id}`);
                          setHasExpired(true);
                          setApplication(null);
                          setPaymentProof(null);
                          await fetchApplication(); // Re-fetch updated state
                        } catch (error) {
                          console.error("Error expiring application:", error);
                        }
                      }}
                    />
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
                <button
                  onClick={handleCancelApplication}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Cancel Application
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

  return (
    <>
      <ResponsiveNavbar />
      <div className="h-24" />

      <div className="max-w-6xl mx-auto p-6">
        <div className="items-center justify-center flex flex-col w-full max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-10 text-center">Apply for Tutorial Service</h1>
          
          {shouldShowApplication && renderApplicationDetails()}

          {wasCancelled ? (
            <div className="mt-4 mb-8 w-full p-4 bg-red-100 border border-red-400 text-red-800 rounded">
              Your application has been <strong>cancelled</strong>. Please select a new package to start again.
            </div>
          ) : hasExpired ? (
            <div className="mt-4 mb-8 w-full p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
              Your application has expired. Please select a new package and try again.
            </div>
          ) : null}

          {(!application || hasExpired || isDone ) && (
            loading ? (
              <p>Loading Available Packages...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : packages.length === 0 ? (
              <p>No available packages found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 w-full">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="border border-gray-300 rounded-3xl p-8 shadow-2xl bg-white min-h-[280px] flex flex-col justify-between transition-transform transform hover:scale-105"
                  >
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-blue-700">{pkg.package_name}</h3>
                      <p className="text-lg mb-1"><strong>Total Price:</strong> {formatCurrency(calculateTotalPrice(pkg.price_package, pkg.total_sessions, pkg.price_sessions))}</p>
                      <p className="text-lg mb-1"><strong>Sessions:</strong> {pkg.total_sessions}</p>
                      <p className="text-lg mb-2 capitalize"><strong>Tutorial Type:</strong> {pkg.tutorial_type}</p>
                      <p className="text-sm text-gray-600">{pkg.description}</p>
                    </div>
                    <button
                      onClick={() => handleApplyClick(pkg)}
                      className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium text-lg rounded-xl hover:bg-blue-700"
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {showModal && (!application || hasExpired) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 text-xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-4">Apply for: {selectedPackage?.package_name}</h2>

            <div className="mb-4">
              <label className="block font-medium mb-1">Select Tutor</label>
              <select
                value={selectedTutor?.id || ''}
                onChange={handleTutorChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">-- Select Tutor --</option>
                {tutors.map((tutor) => (
                  <option key={tutor.id} value={tutor.id}>
                    {tutor.fname} {tutor.lname}
                  </option>
                ))}
              </select>
            </div>

{selectedTutor && (
  <div className="border rounded p-4 mb-4 bg-gray-50 flex items-center gap-4">
    {selectedTutor.profile_image_url && (
      <img
        src={`http://localhost:5000/uploads/${selectedTutor.profile_image_url}`}
        alt="Profile"
        className="w-40 h-40 object-cover rounded-full border"
      />
    )}
    <div>
      <p className="flex items-center gap-1">
        <strong>Name:</strong>&nbsp;
        {selectedTutor.fname} {selectedTutor.lname}
        {selectedTutor.gender === "male" && <span title="Male">♂️</span>}
        {selectedTutor.gender === "female" && <span title="Female">♀️</span>}
      </p>
      
      {/* ⭐ Average Rating Display */}
      <p className="flex items-center gap-1">
        <strong>Ratings<span role="img" aria-label="star">⭐</span>&nbsp;:</strong>&nbsp;
        {selectedTutor.average_rating !== null ? (
          <>
            {Number(selectedTutor.average_rating).toFixed(1)}&nbsp;

            out of {selectedTutor.total_reviews}&nbsp;
            {selectedTutor.total_reviews === 1 ? 'review' : 'reviews'}
          </>
        ) : (
          <span>No ratings yet</span>
        )}
      </p>

      {selectedTutor.certification && <p><strong>Certification:</strong> {selectedTutor.certification}</p>}
      {selectedTutor.subject && <p><strong>Specialization:</strong> {selectedTutor.subject}</p>}
      {selectedTutor.teaching_lvl && <p><strong>Academic Level:</strong> {selectedTutor.teaching_lvl}</p>}
      {selectedTutor.experiences && <p><strong>Experiences:</strong> {selectedTutor.experiences}</p>}
      {selectedTutor.graduate_at && <p><strong>Graduate At:</strong> {selectedTutor.graduate_at}</p>}
    </div>
  </div>
)}

            <div className="mb-4">
              <label className="block font-medium mb-1">Select Timeslot</label>
              {loadingTimeslots ? (
                <p>Loading available timeslots...</p>
              ) : (
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  disabled={timeslots.length === 0}
                >
                  <option value="">-- Select Timeslot --</option>
                  {timeslots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {formatTime12h(slot.start_time)} - {formatTime12h(slot.end_time)}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleBookingSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Submit Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {alert.show && (
        <div className={`fixed top-28 right-4 z-50 transition-opacity duration-500 ${
          fadeOut ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <Alert
            severity={alert.severity}
            onClose={() => setAlert({ ...alert, show: false })}
            variant="filled"
          >
            {alert.message}
          </Alert>
        </div>
      )}
    </>
  );
};

export default StudentBookingPage;