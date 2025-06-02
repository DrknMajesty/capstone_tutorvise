// src/pages/LandingPage.js
import React from 'react';
import ResponsiveNavbar from './Navbar';


const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ResponsiveNavbar />

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center text-center px-6">
        <div>
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            Einstein: Center for Modern Education
          </h2>
          <p className="text-gray-700 mb-6 max-w-xl mx-auto">
            Streamline your tutoring center’s operations with booking, scheduling, and student management in one place. 
          </p>
          <a href="/login" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
            Get Started
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 py-4 text-center text-sm text-gray-600">
        © 2025 Tutorvise. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
