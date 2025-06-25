import React, { useEffect, useState } from 'react';
import TutorReviews from './TutorReviews';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  
  return (
    <div className="bg-[#f9f8f6] min-h-screen flex flex-col p-24">
      {/* <ResponsiveNavbar /> */}

      <main className="min-h-[85vh] flex-col gap-10 bg-[#f6f5f3] rounded-xl shadow-2xl">
        
        <div className="flex flex-col">
          {/* Hero Section */}
          <div className={`sticky top-0 z-50 bg-[#f6f5f3] flex flex-row justify-between items-center px-8 py-4 transition-shadow duration-300 ${
              scrolled ? 'shadow' : ''
            }`}
            >
            <div className="navbar-brand py-6 ">
              <h1 className="navbar-title text-[#6c3f15]">TutorVise</h1>
            </div>
            <div className="navbar-brand flex p-6 content-around gap-6">
              <button className="text-[#6c3f15] text-xl font-helvetica font-bold bg-transparent border-none"
                onClick={() => window.scrollTo({top: 0, behavior: 'smooth' })}>
              Home
              </button>
              <button className="text-[#6c3f15] text-xl font-helvetica font-bold bg-transparent border-none"
                onClick={() => document.getElementById('tutor_reviews').scrollIntoView({ behavior: 'smooth' })}>
              Tutor Reviews
              </button>
              <button className="text-[#6c3f15] text-xl font-helvetica font-bold bg-transparent border-none"
                onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>
              Contact Us
              </button>
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
          {/* Home Section */}
          <div id='home' className="flex flex-row px-24 py-18 content-around gap-8 items-center justify-between">
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
        {/* Tutor Reviews Section */}
        <section id='tutor_reviews' className=" py-14 border-t">
          <div className="max-w-6xl mx-auto px-4">
            <TutorReviews />
          </div>
        </section>

        {/* About */}
        <div id='about' className="bg-gray-200 py-8 text-center text-sm text-gray-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Contact Us</h2>
            <p className="text-lg mb-10">
              We’d love to hear from you! Whether you have questions, inquiries, or need support—feel free to reach out.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">📍 Address</h3>
                <p>123 Learning Lane,<br />Tutor City, PH 56789</p>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">📞 Phone</h3>
                <p>(+63) 912 345 6789</p>
                <p>(+63) 999 765 4321</p>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">✉️ Email</h3>
                <p>support@tutorvise.com</p>
                <p>info@tutorvise.com</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
