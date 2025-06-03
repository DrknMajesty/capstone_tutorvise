// components/UserViewModal.js
import React from "react";
import { format } from "date-fns";
import "../Styles/Profile.css"; // Assuming you have a CSS file for styling

const UserViewModal = ({ user, onClose }) => {
  if (!user) return null;

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MM-dd-yyyy");
    } catch {
      return dateString || "-";
    }
  };

  return (
    // Full screen fixed overlay centered with semi-transparent bg
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* Modal content box, stop propagation to prevent closing when clicking inside */}
      <div
        className="bg-white p-6 rounded shadow-lg border w-[500px] max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">User Details</h3>
        <div className="space-y-2">
          <>
            <div className="profile-info">
             {user.profile_image_url ? (
              <img 
                 src={
                  user.profile_image_url
                    ? `http://localhost:5000/uploads/${user.profile_image_url}`
                    : '/default-avatar.jpg'
                }
                alt="Profile" 
                className="profile-image"
              />
            ) : (
                <div className="no-image-placeholder">
                  No Image
                </div>
              )}
            </div>
          </>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p className="capitalize">
            <strong>Account Type:</strong> {user.account_type}
          </p>    
          <p>
            <strong>Full Name:</strong> {`${user.lname}, ${user.fname} ${user.mname || ""}`}
          </p>
          <p>
            <strong>Birthdate:</strong> {user.birthdate ? formatDate(user.birthdate) : "-"}
          </p>
          <p>
            <strong>Email:</strong> {user.email ? user.email : "-"}
          </p>
          <p>
            <strong>Contact No.:</strong> {user.contact_no ? user.contact_no : "-"}
          </p>

          {user.account_type === "student" && user.extendedProfile && (
            <div className="pt-4 border-t mt-4">
              <h4 className="text-md font-semibold mb-2">Parent Information</h4>
              <p>
                <strong>Name:</strong>{" "}
                {user.extendedProfile?.parent_lname || user.extendedProfile?.parent_fname || user.extendedProfile?.parent_mname ? (
                  <>
                    {user.extendedProfile?.parent_lname || ""},{" "}
                    {user.extendedProfile?.parent_fname || ""}{" "}
                    {user.extendedProfile?.parent_mname || ""}
                  </>
                ) : (
                  "-"
                )}

              </p>
              <p>
                <strong>Email:</strong> {user.extendedProfile.parent_email ? user.extendedProfile.parent_email : "-"}
              </p>
              <p>
                <strong>Contact No.:</strong> {user.extendedProfile.parent_contact_no ? user.extendedProfile.parent_contact_no : "-"}
              </p>
            </div>
          )}

          {user.account_type === "tutor" && user.extendedProfile && (
            <div className="pt-4 border-t mt-4">
              <h4 className="text-md font-semibold mb-2">Tutor Profile</h4>
              <p>
                <strong>Certification:</strong> {user.extendedProfile.certification ? user.extendedProfile.certification : "-"}
              </p>
              <p>
                <strong>Teaching Level:</strong> {user.extendedProfile.teaching_lvl ? user.extendedProfile.teaching_lvl : "-"}
              </p>
              <p>
                <strong>Subject Expertise:</strong> {user.extendedProfile.subject ? user.extendedProfile.subject : "-"}
              </p>
              <p>
                <strong>Credentials:</strong> {user.extendedProfile.credentials ? user.extendedProfile.credentials : "-"}
              </p>
              <p>
                <strong>Graduate At:</strong> {user.extendedProfile.graduate_at ? formatDate(user.extendedProfile.graduate_at) : "-"}
              </p>
              <p>
                <strong>Major:</strong> {user.extendedProfile.major ? user.extendedProfile.major : "-"}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserViewModal;
