import React, { useCallback, useEffect, useState } from 'react';
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

  const userId = parseInt(localStorage.getItem('user_id'), 10);

  useEffect(() => {
    fetchPackages();
  }, []);
  
  useEffect(() => {
    if (hasExpired) {
      const timer = setTimeout(() => {
        setHasExpired(false);
      }, 5000); // 5000ms = 5 seconds

      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [hasExpired]);

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

  const fetchApplication = useCallback(async () => {
    try {
      const res = await apiService.get(`/applications/my-applications/${userId}`);
      if (res.data) {
        setApplication(res.data);
      }
    } catch (err) {
      console.warn('No application found or failed to load.');
      setApplication(null); // Ensure application is null if not found
    }
  }, [userId]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  const fetchTutors = async () => {
    try {
      const res = await apiService.get('/users/active-tutors');
      setTutors(res.data);
    } catch {
      alert('Failed to fetch tutors.');
    }
  };

  const fetchTimeslots = async (tutorId) => {
    try {
      const res = await apiService.get(`/bookings/book-timeslots/${tutorId}`);
      setTimeslots(res.data);
    } catch (err) {
      console.error('Error fetching timeslots:', err);
      alert('Failed to fetch timeslots.');
    }
  };

  const handleApplyClick = async (pkg) => {
    setSelectedPackage(pkg);
    setShowModal(true);
    setSelectedTutor(null);
    setSelectedSlot('');
    setTimeslots([]); // 🧹 Clear previous timeslots
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
      return alert('Please select a tutor and timeslot.');
    }
    try {
      await apiService.post('/bookings/apply', {
        student_id: userId,
        package_id: selectedPackage.id,
        tutor_id: selectedTutor.id,
        timeslot_id:  parseInt(selectedSlot, 10)
      });

      // ✅ Refresh the application state immediately
      await fetchApplication();

      alert('Booking submitted. Please wait for admin approval.');
      setShowModal(false);
    } catch {
      alert('Failed to submit booking.');
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

  const CountdownTimer = ({ deadline, onExpire }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
      const interval = setInterval(() => {
        const diff = new Date(deadline) - new Date();

        if (diff <= 0) {
          clearInterval(interval);
          setTimeLeft('Expired');
          if (onExpire) onExpire(); // ✅ Notify parent
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

  const handleFileChange = (e) => {
    setPaymentProof(e.target.files[0]);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentProof) return alert("Please select a file.");

    const formData = new FormData();
    formData.append('payment_proof', paymentProof);

    try {
      await apiService.post(`/bookings/submit-proof/${application.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Payment proof submitted. Waiting for admin approval.');
      fetchApplication(); // Refresh details
    } catch (err) {
      alert('Failed to submit payment proof.');
    }
  };

  return (
    <>
      <ResponsiveNavbar />
      <div className="h-24" />

      <div className="max-w-6xl mx-auto p-6">
        <div className="items-center justify-center flex flex-col w-full max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-10 text-center">Book a Tutorial Service</h1>

          {/* Application Details Block */}
          {application?.application_status === 'pending' && !hasExpired && (
            <div className="mt-4 w-full bg-white p-6 rounded-lg shadow-lg border border-gray-300">
              <h2 className="text-2xl font-bold text-green-600 mb-4">Application Details</h2>
              <p><strong>Package:</strong> {application.package_name}</p>
              <p><strong>Tutor:</strong> {application.tutor_fname} {application.tutor_lname}</p>
              <p><strong>Timeslot:</strong> {formatTime12h(application.snapshot_start_time)} - {formatTime12h(application.snapshot_end_time)}</p>
              <p className='capitalize'><strong>Status:</strong> {application.application_status}</p>

              <div className="mt-4">
                <p className="text-yellow-700 font-semibold">Please submit payment proof before the deadline.</p>
                <CountdownTimer
                  deadline={application.deadline}
                  onExpire={() => {
                    setHasExpired(true);
                    setApplication(null);
                    setPaymentProof(null);
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
                </form>
              </div>
            </div>
          )}

          {hasExpired && (
            <div className="mt-4 mb-8 w-full p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
              Your application has expired. Please select a new package and try again.
            </div>
          )}

          {/* Packages Section: Show if no application or if expired */}
          {(!application || hasExpired) && (
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
                      <p className="text-lg mb-1"><strong>Total Price:</strong> ₱{pkg.price_package}</p>
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

      {/* Modal - only show if allowed */}
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
                  <p><strong>Name:</strong> {selectedTutor.fname} {selectedTutor.lname}</p>
                  {selectedTutor.certification && <p><strong>Certification:</strong> {selectedTutor.certification}</p>}
                  {selectedTutor.subject && <p><strong>Subject Expertise:</strong> {selectedTutor.subject}</p>}
                  {selectedTutor.teaching_lvl && <p><strong>Academic Level:</strong> {selectedTutor.teaching_lvl}</p>}
                  {selectedTutor.credentials && <p><strong>Credentials:</strong> {selectedTutor.credentials}</p>}
                  {selectedTutor.graduate_at && <p><strong>Graduate At:</strong> {selectedTutor.graduate_at}</p>}
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block font-medium mb-1">Select Timeslot</label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">-- Select Timeslot --</option>
                {timeslots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {formatTime12h(slot.start_time)} - {formatTime12h(slot.end_time)}
                  </option>
                ))}
              </select>
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
    </>
  );
};

export default StudentBookingPage;