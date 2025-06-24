import React from 'react';
import TutorReviews from './TutorReviews';

const LandingPage = () => {
  return (
    <div className="bg-[#f9f8f6] min-h-screen flex flex-col p-24">
      {/* <ResponsiveNavbar /> */}

      {/* Hero Section */}
      <main className="min-h-[85vh] flex-col gap-10 px-24 bg-[#f6f5f3] rounded-xl shadow-xl">
        <div className="flex flex-col gap-20">
          <div className='flex flex-row justify-between items-center px-8 py-4'>
            <div className="navbar-brand py-6 ">
              <h1 className="navbar-title text-[#6c3f15]">TutorVise</h1>
            </div>
            <div className="navbar-brand flex p-6 content-around">
              <button className="text-[#6c3f15] text-xl font-helvetica font-bold">
              Home
              </button>
              <h2 className="text-[#6c3f15] text-xl font-helvetica font-bold">
              Ratings
              </h2>
              <h2 className="text-[#6c3f15] text-xl font-helvetica font-bold">
              About
              </h2>
            </div>
            <div className="navbar-brand flex p-6 content-around">
              <a
                href="/login"
                className="bg-[#6c3f15] text-white px-6 py-3 rounded-lg hover:bg-[#542404] transition font-helvetica text-center"
              >
                Login
              </a>
            </div>
          </div>
          <div className="flex flex-row py-8 content-around gap-8 items-center justify-between">
            <div className="flex flex-col content-around justify-center p-8 gap-4">
              <h1 className="text-6xl font-helvetica font-bold text-[#6c3f15] mb-6">
                Einstein: Center for Modern Education
              </h1>
              <p className="text-lg font-helvetica text-[#6c3f15] mb-8">
                Streamline your tutoring center’s operations with booking, scheduling, and student management in one place.
              </p>
              <a
                href="/login"
                className="bg-[#6c3f15] text-white px-6 py-3 rounded-lg hover:bg-[#542404] transition font-helvetica text-center"
              >
                Get Started
              </a>
            </div>
            <div>
              <img alt="logo" src="/einstien-.png" />
            </div>
          </div>
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
