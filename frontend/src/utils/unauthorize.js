import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5); // Initial countdown in seconds

  useEffect(() => {
    // Clear user session on unauthorized access
    sessionStorage.clear();

    // Countdown timer
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redirect to login after 5 seconds
    const timeout = setTimeout(() => {
      navigate('/login');
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
        <div className="min-h-screen flex flex-col justify-center items-center p-8 text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
          <p className="text-lg text-gray-700 mb-2">You do not have permission to view this page.</p>
          <p className="text-md text-gray-600">
            Logging you out and redirecting to login in {countdown} second{countdown !== 1 ? 's' : ''}...
          </p>
        </div>
  );
};

export default Unauthorized;
