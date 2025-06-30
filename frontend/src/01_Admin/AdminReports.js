import React, { useEffect, useState, useCallback } from 'react';
import ResponsiveNavbar from '../Components/Navbar';
import apiService from '../utils/apiService';

const AdminReportPage = () => {
  const username = sessionStorage.getItem('username') || '';
  const [ratingsData, setRatingsData] = useState([]);
  const [selectedTutorId, setSelectedTutorId] = useState('');
  const [tutorFeedback, setTutorFeedback] = useState([]);
  const [dateInputs, setDateInputs] = useState({ start: '', end: '' }); // Temporary input values
  const [activeFilters, setActiveFilters] = useState({ start: '', end: '' }); // Active filter values
  const [activeTab, setActiveTab] = useState('ratings');
  const [financeData, setFinanceData] = useState({ 
    income: 0, 
    receivables: 0, 
    applications: [] 
  });
  const [isLoading, setIsLoading] = useState({
    ratings: false,
    finance: false,
    feedback: false
  });

  // Reset relevant states when tab changes
  useEffect(() => {
    if (activeTab === 'comments') {
      setDateInputs({ start: '', end: '' });
      setActiveFilters({ start: '', end: '' });
      setSelectedTutorId('');
      setTutorFeedback([]);
    } else if (activeTab === 'finance') {
      setDateInputs({ start: '', end: '' });
      setActiveFilters({ start: '', end: '' });
    }
  }, [activeTab]);

  const fetchRatings = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, ratings: true }));
    try {
      const params = new URLSearchParams();
      if (activeFilters.start) params.append('start', activeFilters.start);
      if (activeFilters.end) params.append('end', activeFilters.end);

      const res = await apiService.get(`/reports/tutor-ratings?${params.toString()}`);
      const sorted = res.data.sort((a, b) => b.average_rating - a.average_rating);
      setRatingsData(sorted);
    } catch (err) {
      console.error('Failed to fetch tutor ratings report:', err);
    } finally {
      setIsLoading(prev => ({ ...prev, ratings: false }));
    }
  }, [activeFilters]);

  const fetchFinance = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, finance: true }));
    try {
      const params = new URLSearchParams();
      if (activeFilters.start) params.append('start', activeFilters.start);
      if (activeFilters.end) params.append('end', activeFilters.end);

      const res = await apiService.get(`/reports/finance?${params.toString()}`);
      setFinanceData(res.data);
    } catch (err) {
      console.error('Failed to fetch financial report:', err);
    } finally {
      setIsLoading(prev => ({ ...prev, finance: false }));
    }
  }, [activeFilters]);

  const fetchTutorFeedback = useCallback(async (tutorId) => {
    if (!tutorId) {
      setTutorFeedback([]);
      return;
    }
    
    setIsLoading(prev => ({ ...prev, feedback: true }));
    try {
      const res = await apiService.get(`/reports/tutor-feedback/${tutorId}`);
      setTutorFeedback(res.data);
    } catch (err) {
      console.error('Failed to fetch tutor feedback:', err);
    } finally {
      setIsLoading(prev => ({ ...prev, feedback: false }));
    }
  }, []);

  // Load initial data for the active tab
  useEffect(() => {
    if (activeTab === 'ratings') {
      fetchRatings();
    } else if (activeTab === 'finance') {
      fetchFinance();
    }
  }, [activeTab, fetchRatings, fetchFinance, activeFilters]);

  const handleFilterApply = () => {
    // Only update active filters when Apply is clicked
    setActiveFilters({
      start: dateInputs.start,
      end: dateInputs.end
    });
  };

  const handleFilterReset = () => {
    setDateInputs({ start: '', end: '' });
    setActiveFilters({ start: '', end: '' });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <ResponsiveNavbar username={username} />
      <div className="h-24" />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Generate Report</h1>

        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-2">
            <button
              onClick={() => handleTabChange('ratings')}
              className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium ${
                activeTab === 'ratings' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Ratings
            </button>
            <button
              onClick={() => {
                handleTabChange('comments');
                fetchRatings();
              }}
              className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium ${
                activeTab === 'comments' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Comments
            </button>
            <button
              onClick={() => handleTabChange('finance')}
              className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium ${
                activeTab === 'finance' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Finances
            </button>
          </nav>
        </div>

        {(activeTab === 'ratings' || activeTab === 'finance') && (
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Start Date:</label>
              <input
                type="date"
                value={dateInputs.start}
                onChange={(e) => setDateInputs(prev => ({ ...prev, start: e.target.value }))}
                className="border border-gray-300 px-3 py-1 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">End Date:</label>
              <input
                type="date"
                value={dateInputs.end}
                onChange={(e) => setDateInputs(prev => ({ ...prev, end: e.target.value }))}
                className="border border-gray-300 px-3 py-1 rounded"
              />
            </div>
            <div className="mt-4 md:mt-6 flex gap-2">
              <button
                onClick={handleFilterApply}
                disabled={isLoading[activeTab] || (!dateInputs.start && !dateInputs.end)}
                className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
                  isLoading[activeTab] ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading[activeTab] ? 'Loading...' : 'Apply Filters'}
              </button>
              <button
                onClick={handleFilterReset}
                disabled={isLoading[activeTab] || (!activeFilters.start && !activeFilters.end)}
                className={`bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 ${
                  isLoading[activeTab] ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Reset
              </button>
            </div>
          </div>
        )}

       {activeTab === 'finance' && (
        <div className="bg-gray-100 p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Income Report</h2>
          {isLoading.finance ? (
            <p>Loading financial data...</p>
          ) : (
            <>
              <p className="text-lg">
                Total Income: <strong>₱{Number(financeData.income).toFixed(2)}</strong>
              </p>
              <p className="text-lg">
                Total Receivables: <strong>₱{Number(financeData.receivables).toFixed(2)}</strong>
              </p>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Application Details</h3>

                {financeData.applications?.length === 0 ? (
                  <p className="text-gray-500 italic">
                    {activeFilters.start || activeFilters.end
                      ? 'No applications found for the selected date range.'
                      : 'No application records available.'}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border px-4 py-2">ID</th>
                          <th className="border px-4 py-2">Status</th>
                          <th className="border px-4 py-2">Student</th>
                          <th className="border px-4 py-2">Package</th>
                          <th className="border px-4 py-2">Submitted</th>
                          <th className="border px-4 py-2">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {financeData.applications.map((app, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="border px-4 py-2">{app.application_id}</td>
                            <td className="border px-4 py-2 capitalize">{app.application_status}</td>
                            <td className="border px-4 py-2">{app.student_name}</td>
                            <td className="border px-4 py-2">{app.package_name}</td>
                            <td className="border px-4 py-2">
                              {new Date(app.submitted_at).toLocaleDateString()}
                            </td>
                            <td className="border px-4 py-2">
                              ₱{Number(app.total_price).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

        {activeTab === 'ratings' && (
          isLoading.ratings ? (
            <p>Loading ratings data...</p>
          ) : ratingsData.length === 0 ? (
            <p className="text-gray-500">No ratings data available.</p>
          ) : (
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full table-auto border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-left">Rank</th>
                    <th className="border px-4 py-2 text-left">Tutor Name</th>
                    <th className="border px-4 py-2 text-left">Average Rating</th>
                    <th className="border px-4 py-2 text-left">Total Ratings</th>
                  </tr>
                </thead>
                <tbody>
                  {ratingsData.map((tutor, index) => (
                    <tr key={tutor.tutor_id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{tutor.name}</td>
                      <td className="border px-4 py-2">{Number(tutor.average_rating).toFixed(2)}</td>
                      <td className="border px-4 py-2">{tutor.rating_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {activeTab === 'comments' && (
          <div className="space-y-6">
            <div className="mb-6">
              <label className="block mb-2 font-medium">Select a Tutor to View Feedback:</label>
              <select
                value={selectedTutorId}
                onChange={(e) => {
                  setSelectedTutorId(e.target.value);
                  fetchTutorFeedback(e.target.value);
                }}
                className="border border-gray-300 rounded px-3 py-2"
                disabled={isLoading.feedback || ratingsData.length === 0}
              >
                <option value="">-- Select Tutor --</option>
                {ratingsData.map(tutor => (
                  <option key={tutor.tutor_id} value={tutor.tutor_id}>{tutor.name}</option>
                ))}
              </select>
            </div>

            {isLoading.feedback ? (
              <p>Loading feedback...</p>
            ) : selectedTutorId && tutorFeedback.length > 0 ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">Confirmed Sessions Feedback</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-4 py-2 text-left">Date</th>
                        <th className="border px-4 py-2 text-left">Time</th>
                        <th className="border px-4 py-2 text-left">Student</th>
                        <th className="border px-4 py-2 text-left">Rating</th>
                        <th className="border px-4 py-2 text-left">Comment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tutorFeedback.map((fb, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="border px-4 py-2">{new Date(fb.scheduled_date).toLocaleDateString()}</td>
                          <td className="border px-4 py-2">
                            {new Date(`1970-01-01T${fb.start_time}`).toLocaleTimeString([], {
                              hour: '2-digit', minute: '2-digit', hour12: true,
                            })} - {new Date(`1970-01-01T${fb.end_time}`).toLocaleTimeString([], {
                              hour: '2-digit', minute: '2-digit', hour12: true,
                            })}
                          </td>     
                          <td className="border px-4 py-2">
                            {fb.student_lname}
                          </td>
                          <td className="border px-4 py-2">
                            <div className="flex text-yellow-500 text-sm">
                              {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
                            </div>
                          </td>

                          <td className="border px-4 py-2 italic text-gray-700">{fb.comment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : selectedTutorId ? (
              <p className="text-gray-500">No feedback available for this tutor.</p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReportPage;