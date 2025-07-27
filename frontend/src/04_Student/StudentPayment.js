import React, { useEffect, useState } from 'react';
import ResponsiveNavbar from '../Components/Navbar';
import apiService from '../utils/apiService';

const StudentPayment = () => {
  const username = sessionStorage.getItem('username') || '';
  const user_id = parseInt(sessionStorage.getItem('user_id'), 10);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [view, setView] = useState('applications');

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await apiService.get(`/applications/${user_id}/my-applications`);
        const sorted = response.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setApplications(sorted);
        if (sorted.length > 0 && (!selectedAppId || !sorted.some(app => app.application_id === selectedAppId))) {
          setSelectedAppId(sorted[0].application_id);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError('Failed to fetch applications.');
      }

      setLoading(false);
    };

    fetchApplications();
  }, [user_id, selectedAppId]);

  const selectedApplication = applications.find(app => app.application_id === selectedAppId);

  const calculateTotalPrice = (price_package, total_sessions, price_sessions) => {
    const totalPrice = parseFloat(price_package || 0) + (parseInt(total_sessions || 0) * parseFloat(price_sessions || 0));
    return parseFloat(totalPrice.toFixed(2));
  };

  const formatCurrency = (amount) => {
    const num = Number(amount);
    if (isNaN(num)) return '';
    return `₱${num.toFixed(2)}`;
  };

  const viewPaymentProof = (filename) => {
    window.open(`http://localhost:5000/uploads/payment_proofs/${filename}`, '_blank');
  };

  const totalRemaining = applications.reduce((sum, app) => {
    const total = calculateTotalPrice(app.price_package, app.total_sessions, app.price_sessions);
    const paid = (app.payments || []).reduce((s, p) => s + parseFloat(p.amount_paid || 0), 0);
    return sum + (total - paid);
  }, 0);
  
  return (
    <div>
      <ResponsiveNavbar username={username} />
      <div className="h-24" />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {view === 'applications' ? 'Student Applications' : 'Student Ledger'}
          </h1>
          <div className="space-x-2">
            <button
              onClick={() => setView('applications')}
              className={`px-4 py-2 rounded ${
                view === 'applications' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setView('ledger')}
              className={`px-4 py-2 rounded ${
                view === 'ledger' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              Ledger
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading applications...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <>
            {view === 'applications' && (
              <>
                <div className="mb-6">
                  <label className="block text-lg font-medium mb-2">Select an Application:</label>
                  <select
                    value={selectedAppId || ''}
                    onChange={(e) => setSelectedAppId(Number(e.target.value))}
                    className="w-full md:w-1/2 p-2 border border-gray-300 rounded"
                  >
                    {applications.map((app) => (
                      <option key={app.application_id} value={app.application_id}>
                        ID #{app.application_id} - {new Date(app.created_at).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedApplication && (
                  <div className="bg-white shadow rounded-lg p-6 border">
                    <h2 className="text-xl font-bold mb-4">Application Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="mb-2"><strong>Application ID:</strong> #{selectedApplication.application_id}</p>
                        <p className="mb-2"><strong>Package:</strong> {selectedApplication.package_name}</p>
                        <p className="mb-2"><strong>Total Sessions:</strong> {selectedApplication.total_sessions}</p>
                        <p className="mb-2"><strong>Price per Session:</strong> {formatCurrency(selectedApplication.price_sessions)}</p>
                      </div>
                      <div>
                        <p className="mb-2"><strong>Package Price:</strong> {formatCurrency(selectedApplication.price_package)}</p>
                        <p className="mb-2"><strong>Total Price:</strong> {formatCurrency(calculateTotalPrice(
                          selectedApplication.price_package,
                          selectedApplication.total_sessions,
                          selectedApplication.price_sessions
                        ))}</p>
                        <p className="mb-2">
                          <strong>Applied At:</strong>{' '}
                          {new Date(selectedApplication.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {(selectedApplication?.payments || []).map((payment, index) => (
                  <div
                    key={payment.payment_id}
                    className="flex flex-wrap items-center justify-between border p-4 rounded bg-gray-50 shadow-sm gap-4"
                  >
                    <div className="flex flex-col text-sm">
                      <span className="font-medium">
                        {selectedApplication.payments.length === 1
                          ? 'Full Payment'
                          : index === 0
                          ? 'Initial Payment'
                          : 'Final Payment'}
                      </span>
                      <span className="text-gray-700">
                        Date Paid:{' '}
                        {new Date(payment.payment_date).toLocaleString([], {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="text-gray-700">
                        Amount: ₱{Number(payment.amount_paid).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => viewPaymentProof(payment.payment_proof)}
                        className="text-blue-600 underline text-sm hover:text-blue-800"
                      >
                        View Proof
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}

{view === 'ledger' && (
              <div className="bg-white shadow rounded-lg p-6 border">
                <h2 className="text-xl font-bold mb-4">Payment Ledger</h2>
                <table className="w-full border text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Reference</th>
                      <th className="px-4 py-2">Description</th>
                      <th className="px-4 py-2">Debit (₱)</th>
                      <th className="px-4 py-2">Credit (₱)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications
                      .flatMap((app) => {
                        const totalAmount = calculateTotalPrice(app.price_package, app.total_sessions, app.price_sessions);
                        const totalFormatted = formatCurrency(totalAmount);
                        const entries = [];

                        entries.push({
                          id: `debit-${app.application_id}`,
                          date: app.created_at,
                          reference: `APP#${app.application_id}`,
                          description: `Fee for ${app.package_name}`,
                          debit: totalFormatted,
                          credit: ''
                        });

                        if (app.payments && app.payments.length > 0) {
                          app.payments.forEach((payment, index) => {
                            entries.push({
                              id: `credit-${payment.payment_id}`,
                              date: payment.payment_date,
                              reference: `PAY#${payment.payment_id}`,
                              description: `${payment.is_partial ? (index === 0 ? 'Initial' : 'Final') : 'Full'} payment for ${app.package_name}`,
                              debit: '',
                              credit: formatCurrency(payment.amount_paid)
                            });
                          });
                        }
                        return entries;
                      })
                      .sort((a, b) => new Date(a.date || '2100-01-01') - new Date(b.date || '2100-01-01'))
                      .map((entry) => (
                        <tr key={entry.id} className="border-t">
                          <td className="px-4 py-2">{entry.date ? new Date(entry.date).toLocaleDateString() : ''}</td>
                          <td className="px-4 py-2">{entry.reference}</td>
                          <td className="px-4 py-2 font-medium">{entry.description}</td>
                          <td className="px-4 py-2 text-red-600">{entry.debit}</td>
                          <td className="px-4 py-2 text-green-600">{entry.credit}</td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t bg-gray-50 font-semibold">
                      <td colSpan="4" className="px-4 py-2 text-right">Remaining Balance</td>
                      <td className="px-4 py-2 text-right">
                        <span className={totalRemaining <= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                          {formatCurrency(totalRemaining <= 0 ? 0 : totalRemaining)}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentPayment;
