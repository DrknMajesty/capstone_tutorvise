import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import apiService from '../utils/apiService';
import ResponsiveNavbar from '../Components/Navbar';

const StaffPackage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewingPackage, setViewingPackage] = useState(null);
  const [alert, setAlert] = useState({ message: '', severity: '', show: false });
  const [fadeOut, setFadeOut] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await apiService.get('/packages/all-packages');
      setPackages(response.data || []);
    } catch (err) {
      setError('Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

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

  const calculateTotalPrice = (price_package, total_sessions, price_sessions) => {
    const totalPrice = parseFloat(price_package || 0) + (parseInt(total_sessions || 0) * parseFloat(price_sessions || 0));
    return parseFloat(totalPrice.toFixed(2));
  };

  const formatCurrency = (amount) => `₱${amount.toFixed(2)}`;


  const totalPages = Math.ceil(packages.length / itemsPerPage);
  const paginatedPackages = packages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <ResponsiveNavbar />
      <div className="h-24" />
      <div className="items-center justify-center flex flex-col">
        <div className="p-4 flex flex-col">
           <h2 className="text-2xl font-bold mb-4">View Packages</h2>
          
        {loading ? (
          <p>Loading packages...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : packages.length === 0 ? (
          <p>No packages found.</p>
        ) : (
        <>

          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-300 max-w-4xl w-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2 w-64">Package</th>
                  <th className="border px-4 py-2">Total Price</th>
                  <th className="border px-4 py-2">Type</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPackages.map(pkg => (
                  <tr key={pkg.id}>
                    <td className="border px-4 py-2">{pkg.id}</td>
                    <td className="border px-4 py-2">{pkg.package_name}</td>
                    <td className="border px-4 py-2">
                      {formatCurrency(calculateTotalPrice(pkg.price_package, pkg.total_sessions, pkg.price_sessions))}
                    </td>
                    <td className="border px-4 py-2 capitalize">{pkg.tutorial_type}</td>
                    <td className="border px-4 py-2 capitalize">{pkg.status}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <div className="flex">
                      <button onClick={() => setViewingPackage(pkg)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">View</button>
                    </div>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center space-x-2">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50">Prev</button>
              <span className="px-3 py-1">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50">Next</button>
            </div>
          </>
        )}
      </div>
      </div>
      
      {/* View Package Details Modal */}
        {viewingPackage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={() => setViewingPackage(null)} // ← closes modal on outside click
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative"
              onClick={(e) => e.stopPropagation()} // ← prevents closing when clicking inside modal
            >
              <h2 className="text-2xl font-semibold mb-4">Package Details</h2>
              <div className="space-y-2">
                <p><strong>ID:</strong> {viewingPackage.id}</p>
                <p><strong>Package Name:</strong> {viewingPackage.package_name}</p>
                <p><strong>Package Price:</strong> {formatCurrency(parseFloat(viewingPackage.price_package))}</p>
                <p><strong>Sessions:</strong> {viewingPackage.total_sessions}</p>
                <p><strong>Price per Session:</strong> {formatCurrency(parseFloat(viewingPackage.price_sessions))}</p>
                <p><strong>Total Price:</strong> {formatCurrency(calculateTotalPrice(viewingPackage.price_package, viewingPackage.total_sessions, viewingPackage.price_sessions))}</p>
                <p className='capitalize'><strong>Tutorial Type:</strong> {viewingPackage.tutorial_type}</p>
                <p><strong>Status:</strong> {viewingPackage.status}</p>
                <p><strong>Description:</strong> {viewingPackage.description || 'N/A'}</p>
              </div>
              {/* <button
                onClick={() => setViewingPackage(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              >
                &times;
              </button> */}
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

export default StaffPackage;
