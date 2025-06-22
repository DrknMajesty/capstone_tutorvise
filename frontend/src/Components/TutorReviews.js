import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import apiService from '../utils/apiService'; // Make sure this is correctly configured

const TutorReviews = () => {
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    const fetchTutorReviews = async () => {
      try {
        const response = await apiService.get('/tutors/reviews');
        setTutors(response.data);
        console.log("Data:", response.data);
      } catch (error) {
        console.error('Error fetching tutor reviews:', error);
      }
    };

    fetchTutorReviews();
  }, []);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={18}
          className={i < fullStars ? 'text-yellow-500' : 'text-gray-300'}
          fill={i < fullStars ? 'currentColor' : 'none'}
          strokeWidth={1.5}
        />
      );
    }
    return stars;
  };

  return (
    <section className="py-8 px-4 bg-white max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">What Students Say About Our Tutors</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutors.map((tutor) => (
          <div
            key={tutor.tutor_id}
            className="p-4 border rounded-xl shadow-sm hover:shadow-md transition bg-gray-50"
          >
            <div className="flex items-center gap-4 mb-2">
              <img
                src={`http://localhost:5000/uploads/${tutor.profile_image_url}`}
                alt={tutor.name}
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div>
                <p className="font-semibold">{tutor.name}</p>
                <div className="flex items-center gap-1">
                  {renderStars(tutor.average_rating)}
                  <span className="text-sm text-gray-500 ml-1">
                    ({tutor.average_rating} out of {tutor.total_reviews})
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {tutor.comments.slice(0, 2).map((comment, idx) => (
                <div key={idx} className="bg-white border rounded p-2 shadow-sm">
                  <p className="text-sm italic text-gray-700">"{comment.comment}"</p>
                  <p className="text-xs text-gray-500 text-right">– {comment.student_name}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TutorReviews;
