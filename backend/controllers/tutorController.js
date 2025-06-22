const db = require('../db');


exports.getTutorReviews = async (req, res) => {
  try {
    // 1. Aggregate average rating and count of reviews per tutor
    const [tutors] = await db.query(`
      SELECT 
        t.id AS tutor_id,
        CONCAT(t.fname, ' ', t.lname) AS name,
        t.profile_image_url,
        ROUND(AVG(f.rating), 2) AS average_rating,
        COUNT(f.id) AS total_reviews
      FROM feedback f
      JOIN sessions s ON f.session_id = s.id
      JOIN schedules sch ON s.schedule_id = sch.id
      JOIN bookings b ON sch.booking_id = b.id
      JOIN applications a ON b.application_id = a.id
      JOIN users t ON a.tutor_id = t.id
      WHERE t.account_type = 'tutor'
      GROUP BY t.id
      ORDER BY average_rating DESC
      LIMIT 6;
    `);

    // 2. Fetch latest 2 comments per tutor with student names
    const [comments] = await db.query(`
SELECT 
  f.comment,
  f.rating,
  a.tutor_id,
  CONCAT(u.fname, ' ', u.lname) AS student_name
FROM feedback f
JOIN sessions s ON f.session_id = s.id
JOIN schedules sch ON s.schedule_id = sch.id
JOIN bookings b ON sch.booking_id = b.id
JOIN applications a ON b.application_id = a.id
JOIN users u ON a.student_id = u.id
WHERE f.comment IS NOT NULL
  AND f.rating BETWEEN 3 AND 5
ORDER BY f.submitted_at DESC;
    `);

    // 3. Attach top 2 comments to each tutor
    const tutorData = tutors.map(tutor => {
      const tutorComments = comments
        .filter(comment => comment.tutor_id === tutor.tutor_id)
        .slice(0, 2);

      return {
        ...tutor,
        comments: tutorComments
      };
    });

    res.status(200).json(tutorData);
  } catch (err) {
    console.error('Error fetching tutor reviews:', err);
    res.status(500).json({ message: 'Server error' });
  }
};