import React from 'react';
import ResponsiveNavbar from './Navbar';
import TutorReviews from './TutorReviews';

const LandingPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <ResponsiveNavbar />

      {/* Hero Section */}
      <main className="min-h-[85vh] flex items-center justify-center text-center px-6 bg-white">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold text-blue-900 mb-6">
            Einstein: Center for Modern Education
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Streamline your tutoring center’s operations with booking, scheduling, and student management in one place.
          </p>
          <a
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </a>
        </div>
      </main>

      {/* Tutor Reviews Section */}
      <section className="bg-gray-100 py-16 border-t">
        <div className="max-w-6xl mx-auto px-4">
          <TutorReviews />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-200 py-4 text-center text-sm text-gray-600">
        © 2025 Tutorvise. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
