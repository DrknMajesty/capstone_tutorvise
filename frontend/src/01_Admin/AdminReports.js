import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ResponsiveNavbar from '../Components/Navbar';
import apiService from '../utils/apiService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'

const AdminReportPage = () => {
  const username = sessionStorage.getItem('username') || '';
  const [ratingsData, setRatingsData] = useState([]);
  const [selectedTutorId, setSelectedTutorId] = useState('');
  const [tutorFeedback, setTutorFeedback] = useState([]);
  const [dateInputs, setDateInputs] = useState({ start: '', end: '' });
  const [activeFilters, setActiveFilters] = useState({ start: '', end: '' });
  const [activeTab, setActiveTab] = useState('ratings');
  const [financeData, setFinanceData] = useState({
    totalCollection: 0,
    payments: [],
  });
  const [isLoading, setIsLoading] = useState({ ratings: false, collection: false, feedback: false });

  useEffect(() => {
    if (activeTab === 'comments') {
      setDateInputs({ start: '', end: '' });
      setActiveFilters({ start: '', end: '' });
      setSelectedTutorId('');
      setTutorFeedback([]);
    } else if (activeTab === 'collection') {
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
  setIsLoading(prev => ({ ...prev, collection: true }));

  try {
    const params = new URLSearchParams();
    if (activeFilters.start) params.append('start', activeFilters.start);
    if (activeFilters.end) params.append('end', activeFilters.end);

    const res = await apiService.get(`/reports/finance?${params.toString()}`);

    // Expecting: { totalCollection, payments }
    const { totalCollection, payments } = res.data;
    setFinanceData({ totalCollection, payments });

    console.log("Finance Data:", res.data);
  } catch (err) {
    console.error('Failed to fetch financial report:', err);
  } finally {
    setIsLoading(prev => ({ ...prev, collection: false }));
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

  useEffect(() => {
    if (activeTab === 'ratings') {
      fetchRatings();
    } else if (activeTab === 'collection') {
      fetchFinance();
    }
  }, [activeTab, fetchRatings, fetchFinance, activeFilters]);

  const handleFilterApply = () => {
    setActiveFilters({ start: dateInputs.start, end: dateInputs.end });
  };

  const handleFilterReset = () => {
    setDateInputs({ start: '', end: '' });
    setActiveFilters({ start: '', end: '' });
  };

  const filteredFeedback = useMemo(() => {
    return tutorFeedback.filter(fb => {
      const sessionDate = new Date(fb.scheduled_date);
      const start = activeFilters.start ? new Date(activeFilters.start) : null;
      const end = activeFilters.end ? new Date(activeFilters.end) : null;

      if (start && sessionDate < start) return false;
      if (end && sessionDate > end) return false;

      return true;
    });
  }, [tutorFeedback, activeFilters]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

const handleDownloadPDF = () => {
  const doc = new jsPDF();
  const title = `TutorVise Report - ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.text(title, 14, 20);

  // Helper for displaying date range
  const noFiltersUsed = !activeFilters.start && !activeFilters.end;
  const startDate = noFiltersUsed
    ? 'All Records'
    : activeFilters.start
      ? new Date(activeFilters.start).toLocaleDateString()
      : 'N/A';
  const endDate = noFiltersUsed
    ? ''
    : activeFilters.end
      ? new Date(activeFilters.end).toLocaleDateString()
      : 'N/A';

  if (activeTab === 'ratings') {
    doc.setFontSize(10);
    doc.text(
      `Date Range: ${noFiltersUsed ? 'All Records' : `${startDate} - ${endDate}`}`,
      14,
      28
    );

    autoTable(doc, {
      startY: 35,
      head: [['Rank', 'Tutor Name', 'Average Rating', 'Total Ratings']],
      body: ratingsData.map((tutor, idx) => [
        idx + 1,
        tutor.name,
        Number(tutor.average_rating).toFixed(2),
        tutor.rating_count,
      ]),
      theme: 'striped',
      styles: { fontSize: 10 },
    });

  } else if (activeTab === 'collection') {
    doc.setFontSize(10);
    doc.text(
      `Date Range: ${noFiltersUsed ? 'All Records' : `${startDate} - ${endDate}`}`,
      14,
      28
    );
    doc.text(`Total Collection: PHP ${Number(financeData.totalCollection).toFixed(2)}`, 14, 36);

    autoTable(doc, {
      startY: 43,
      head: [['Payment ID', 'Type', 'Student', 'Package', 'Date Paid', 'Amount Paid']],
      body: financeData.payments.map(payment => [
        payment.payment_id,
        payment.is_partial ? 'Partial' : 'Full',
        payment.student_name,
        payment.package_name,
        new Date(payment.payment_date).toLocaleDateString(),
        `PHP ${Number(payment.amount_paid).toFixed(2)}`
      ]),
      styles: { fontSize: 9 },
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133] },
    });

  } else if (activeTab === 'comments') {
    const tutor = ratingsData.find(t => t.tutor_id === parseInt(selectedTutorId));

    const filteredFeedback = tutorFeedback.filter(fb => {
      const fbDate = new Date(fb.scheduled_date);
      const start = activeFilters.start ? new Date(activeFilters.start) : null;
      const end = activeFilters.end ? new Date(activeFilters.end) : null;

      if (start && fbDate < start) return false;
      if (end && fbDate > end) return false;

      return true;
    });

    doc.setFontSize(12);
    doc.text(`Tutor: ${tutor?.name || 'N/A'}`, 14, 28);
    doc.setFontSize(10);
    doc.text(
      `Date Range: ${noFiltersUsed ? 'All Records' : `${startDate} - ${endDate}`}`,
      14,
      36
    );

    autoTable(doc, {
      startY: 43,
      head: [['Date', 'Time', 'Student', 'Rating', 'Comment']],
      body: filteredFeedback.map(fb => {
        const date = new Date(fb.scheduled_date).toLocaleDateString();
        const startTime = new Date(`1970-01-01T${fb.start_time}`).toLocaleTimeString([], {
          hour: '2-digit', minute: '2-digit', hour12: true
        });
        const endTime = new Date(`1970-01-01T${fb.end_time}`).toLocaleTimeString([], {
          hour: '2-digit', minute: '2-digit', hour12: true
        });
        return [
          date,
          `${startTime} - ${endTime}`,
          fb.student_lname,
          '★'.repeat(fb.rating),
          fb.comment,
        ];
      }),
      styles: { fontSize: 9, cellWidth: 'wrap' },
      columnStyles: { 4: { cellWidth: 70 } },
      theme: 'striped',
      headStyles: { fillColor: [52, 73, 94] },
    });
  }

  doc.save(`${activeTab}-report.pdf`);
};

return (
  <div>
    <ResponsiveNavbar username={username} />
    <div className="h-24" />
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Generate Report</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-2">
          {['ratings', 'comments', 'collection'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                handleTabChange(tab);
                if (tab === 'comments') fetchRatings();
              }}
              className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

{/* Filters + Download Button in one row */}
{(activeTab === 'ratings' || activeTab === 'collection' || activeTab === 'comments') && (
  <div className="mb-4 flex flex-col md:flex-row md:items-end md:justify-between md:gap-4">
    {/* Filters Section */}
    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
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

    {/* Export Button aligned right */}
    <div className="mt-4 md:mt-6">
      <button
        onClick={handleDownloadPDF}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Export Report as PDF
      </button>
    </div>
  </div>
)}


      {/* Report Content */}
      <div id="report-content">
        {activeTab === 'collection' && (
          <div className="bg-gray-100 p-6 rounded shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">Collection Report</h2>
            {isLoading.collection ? (
              <p>Loading payment collection data...</p>
            ) : (
              <>
                <p className="text-lg">
                  Total Collection: <strong>₱{Number(financeData.totalCollection || 0).toFixed(2)}</strong>
                </p>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
                  {financeData.payments?.length === 0 ? (
                    <p className="text-gray-500 italic">
                      {activeFilters.start || activeFilters.end
                        ? 'No payments found for the selected date range.'
                        : 'No payment records available.'}
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-300 text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="border px-4 py-2">Payment ID</th>
                            <th className="border px-4 py-2">Type</th>
                            <th className="border px-4 py-2">Student</th>
                            <th className="border px-4 py-2">Package</th>
                            <th className="border px-4 py-2">Date Paid</th>
                            <th className="border px-4 py-2">Amount Paid</th>
                          </tr>
                        </thead>
                        <tbody>
                          {financeData.payments.map((payment, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="border px-4 py-2">{payment.payment_id}</td>
                              <td className="border px-4 py-2">{payment.is_partial ? 'Partial' : 'Full'}</td>
                              <td className="border px-4 py-2">{payment.student_name}</td>
                              <td className="border px-4 py-2">{payment.package_name}</td>
                              <td className="border px-4 py-2">
                                {new Date(payment.payment_date).toLocaleDateString()}
                              </td>
                              <td className="border px-4 py-2">
                                ₱{Number(payment.amount_paid).toFixed(2)}
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
          ) : (
            <div className="overflow-x-auto mb-8">
              {ratingsData.filter(t => t.rating_count > 0).length === 0 ? (
                <p className="text-gray-500">No tutor ratings available.</p>
              ) : (
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
                    {ratingsData
                      .filter(tutor => tutor.rating_count > 0)
                      .map((tutor, index) => (
                        <tr key={tutor.tutor_id} className="hover:bg-gray-50">
                          <td className="border px-4 py-2">{index + 1}</td>
                          <td className="border px-4 py-2">{tutor.name}</td>
                          <td className="border px-4 py-2">{Number(tutor.average_rating).toFixed(2)}</td>
                          <td className="border px-4 py-2">{tutor.rating_count}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          )
        )}


      {activeTab === 'comments' && (
        <div className="space-y-6">
<div>
  <label className="block mb-2 font-medium">Select Tutor:</label>
  <select
    value={selectedTutorId}
    onChange={(e) => {
      setSelectedTutorId(e.target.value);
      fetchTutorFeedback(e.target.value);
    }}
    className="border border-gray-300 rounded px-3 py-2"
    disabled={ratingsData.length === 0}
  >
    <option value="">-- Select Tutor --</option>
    {ratingsData.map(tutor => (
      <option key={tutor.tutor_id} value={tutor.tutor_id}>{tutor.name}</option>
    ))}
  </select>
</div>

          {isLoading.feedback ? (
            <p>Loading feedback...</p>
          ) : selectedTutorId && filteredFeedback.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2">Date</th>
                    <th className="border px-4 py-2">Time</th>
                    <th className="border px-4 py-2">Student</th>
                    <th className="border px-4 py-2">Rating</th>
                    <th className="border px-4 py-2">Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFeedback.map((fb, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{new Date(fb.scheduled_date).toLocaleDateString()}</td>
                      <td className="border px-4 py-2">
                        {new Date(`1970-01-01T${fb.start_time}`).toLocaleTimeString([], {
                          hour: '2-digit', minute: '2-digit', hour12: true,
                        })} - {new Date(`1970-01-01T${fb.end_time}`).toLocaleTimeString([], {
                          hour: '2-digit', minute: '2-digit', hour12: true,
                        })}
                      </td>
                      <td className="border px-4 py-2">{fb.student_lname}</td>
                      <td className="border px-4 py-2 text-yellow-500">
                        {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
                      </td>
                      <td className="border px-4 py-2 italic text-gray-700">{fb.comment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : selectedTutorId ? (
            <p className="text-gray-500">No feedback available for this tutor.</p>
          ) : null}
        </div>
      )}
      </div>
    </div>
  </div>
);
} 

export default AdminReportPage;
