// import React, { useState, useEffect } from 'react';
// import apiService from '../utils/apiService';
// import ResponsiveNavbar from './Navbar';

// const StudentBookingPage = () => {
//   const [packages, setPackages] = useState([]);
//   const [tutors, setTutors] = useState([]);
//   const [timeslots, setTimeslots] = useState([]);
//   const [formData, setFormData] = useState({
//     package_id: '',
//     tutor_id: '',
//     timeslot_id: '',
//     payment_proof: null,
//   });

//   const fetchPackages = async () => {
//     const res = await apiService.get('/packages/active');
//     setPackages(res.data);
//   };

//   const fetchTutors = async () => {
//     const res = await apiService.get('/users/active-tutors');
//     setTutors(res.data);
//   };

//   const fetchTimeslots = async (tutorId) => {
//     const res = await apiService.get(`/timeslots/available-slots/${tutorId}`);
//     setTimeslots(res.data);
//   };

//   useEffect(() => {
//     fetchPackages();
//     fetchTutors();
//   }, []);

//   useEffect(() => {
//     if (formData.tutor_id) {
//       fetchTimeslots(formData.tutor_id);
//     } else {
//       setTimeslots([]);
//     }
//   }, [formData.tutor_id]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === 'payment_proof' ? files[0] : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const payload = new FormData();
//     Object.entries(formData).forEach(([key, val]) => payload.append(key, val));

//     try {
//       await apiService.post('/bookings/create', payload, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       alert('Booking submitted. Await admin approval.');
//       setFormData({ package_id: '', tutor_id: '', timeslot_id: '', payment_proof: null });
//     } catch {
//       alert('Submission failed. Try again.');
//     }
//   };

//   return (
//     <>
//     <ResponsiveNavbar username={username}/>
//     <div className="max-w-xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-4">Book a Tutorial Package</h2>
//       <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">

//         <select name="package_id" value={formData.package_id} onChange={handleChange} required className="w-full border p-2">
//           <option value="">Select Package</option>
//           {packages.map(pkg => (
//             <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
//           ))}
//         </select>

//         <select name="tutor_id" value={formData.tutor_id} onChange={handleChange} required className="w-full border p-2">
//           <option value="">Select Tutor</option>
//           {tutors.map(t => (
//             <option key={t.id} value={t.id}>{t.fname} {t.lname}</option>
//           ))}
//         </select>

//         <select name="timeslot_id" value={formData.timeslot_id} onChange={handleChange} required className="w-full border p-2">
//           <option value="">Select Timeslot</option>
//           {timeslots.map(slot => (
//             <option key={slot.id} value={slot.id}>
//               {slot.start_time} - {slot.end_time}
//             </option>
//           ))}
//         </select>

//         <input
//           type="file"
//           name="payment_proof"
//           accept="image/*"
//           onChange={handleChange}
//           required
//           className="w-full border p-2"
//         />

//         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
//           Submit Booking
//         </button>
//       </form>
//     </div>
//     </>
//   );
// };

// export default StudentBookingPage;
