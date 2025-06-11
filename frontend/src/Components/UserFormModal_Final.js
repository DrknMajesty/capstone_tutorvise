// components/UserFormModal.js
import React, { useState, useEffect, useRef } from "react";
import FloatingField from "../Components/FloatingFields";

const UserFormModal = ({ formData, setFormData, onSubmit, onClose, isEdit = false }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const fileInputRef = useRef(null);
  const [isChangePassword, setIsChangePassword] = useState(false);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    if (type === 'file' && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear password error when typing
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Only validate passwords if creating new user or changing password
    if (!isEdit || (isEdit && (formData.password || formData.confirmPassword))) {
      if (formData.password !== formData.confirmPassword) {
        setPasswordError("Passwords do not match");
        return;
      }
      
      if (formData.password && formData.password.length < 8) {
        setPasswordError("Password must be at least 8 characters");
        return;
      }
    }

    onSubmit(e);
  };

  useEffect(() => {
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = null;

    // Determine preview image
    if (formData.profile_image && typeof formData.profile_image === 'string') {
      // For existing profile image from database
      setPreviewImage(`http://localhost:5000/uploads/${formData.profile_image}`);
    } else if (formData.profile_image instanceof File) {
      // For newly selected image file
      const objectUrl = URL.createObjectURL(formData.profile_image);
      setPreviewImage(objectUrl);

      // Cleanup URL on component unmount or change
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewImage(null);
    }
  }, [formData.profile_image]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
         <h3 className="text-lg font-semibold mb-4">
            {isEdit ? "Edit User Details" : "New User Details"}
          </h3>

          {isEdit && (
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID: {formData.id}
              </label>
              <div className="block items-center gap-4 mb-4">
                <button
                  onClick={() => setIsChangePassword((prev) => !prev)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >{isChangePassword ? "Cancel Change Password" : "Change Password"}</button>
              </div>
            </div>
          )}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
         

          {/* Profile Image */}
          <div className="flex items-center gap-4 mb-4">
            {previewImage && (
              <img
                src={previewImage}
                alt="Current Profile"
                className="w-24 h-24 object-cover border"
              />
            )}
            <input
              name="profile_image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            />
          </div>

          {/* General Fields */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <FloatingField
              name="username"
              type="text"
              label={
                <span>
                  Username <span className="text-red-500">*</span>
                </span>
              }
              value={formData.username ?? ""}
              onChange={handleChange}
              required
            />
            
            

            <FloatingField
              type="select"
              name="account_type"
              label={
                <span>
                  Account Type <span className="text-red-500">*</span>
                </span>
              }
              value={formData.account_type || ""}
              onChange={handleChange}
              required
              disabled={isEdit}
              options={[
                { value: "", label: "Select a Account Type"},
                { value: "student", label: "Student" },
                { value: "tutor", label: "Tutor" },
                { value: "admin staff", label: "Admin Staff" },
                { value: "admin", label: "Admin" },
              ]}
            />
            <FloatingField
              name="email"
              type="email"
              label="Email"
              value={formData.email || ""}
              onChange={handleChange}
            />
            <FloatingField
              name="contact_no"
              type="text"
              label="Contact No."
              value={formData.contact_no || ""}
              onChange={(e) => {
                const input = e.target.value;
                if (/^\d{0,11}$/.test(input)) handleChange(e);
              }}
            />
            <FloatingField
              name="birthdate"
              type="date"
              label={
                <span>
                  Birthdate <span className="text-red-500">*</span>
                </span>
              }
              value={formData.birthdate || ""}
              onChange={handleChange}
              required
            />
            <FloatingField
              name="fname"
              type="text"
              label={
                <span>
                  First Name <span className="text-red-500">*</span>
                </span>
              }
              value={formData.fname || ""}
              onChange={handleChange}
              required
            />
            <FloatingField
              name="mname"
              type="text"
              label={
                <span>
                  Middle Name <span className="text-red-500">*</span>
                </span>
              }
              value={formData.mname || ""}
              onChange={handleChange}
            />
            <FloatingField
              name="lname"
              type="text"
              label={
                <span>
                  Last Name <span className="text-red-500">*</span>
                </span>
              }
              value={formData.lname || ""}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Fields */}
          {(!isEdit || (isEdit && isChangePassword)) && (
            <div className="grid grid-cols-2 gap-2 mb-2">
            <h4 className="col-span-2 text-md font-semibold">
              {isEdit ? "Change Password" : "Enter Password"}
            </h4>
              <FloatingField
                name="password"
                type="password"
                label={
                  <span>
                    {isEdit ? "New Password" : "Password"} <span className="text-red-500">*</span>
                  </span>
                }
                value={formData.password ?? ""}
                onChange={handleChange}
                placeholder={isEdit ? "Leave blank to keep current password" : ""}
                required={!isEdit}
              />
              <FloatingField
                name="confirmPassword"
                type="password"
                label={
                  <span>
                    {isEdit ? "Confirm New Password" : "Confirm Password"} <span className="text-red-500">*</span>
                  </span>
                }
                value={formData.confirmPassword ?? ""}
                onChange={handleChange}
                placeholder={isEdit ? "Leave blank to keep current password" : ""}
                required={!isEdit}
              />
            </div>
          )}

          {passwordError && (
            <div className="col-span-2 text-red-600 text-sm">
              {passwordError}
            </div>
          )}

          {/* Student Fields */}
          {formData.account_type === "student" && (
            <div className="grid grid-cols-2 gap-2 mb-2">
              <h4 className="col-span-2 text-md font-semibold">
                Parent Information
              </h4>
              <FloatingField
                name="parent_fname"
                type="text"
                label={
                  <span>
                    First Name <span className="text-red-500">*</span>
                  </span>
                }
                value={formData.parent_fname || ""}
                onChange={handleChange}
                required
              />
              <FloatingField
                name="parent_mname"
                type="text"
                label={
                  <span>
                    Middle Name <span className="text-red-500">*</span>
                  </span>
                }
                value={formData.parent_mname || ""}
                onChange={handleChange}
                required
              />
              <FloatingField
                name="parent_lname"
                type="text"
                label={
                  <span>
                    Last Name <span className="text-red-500">*</span>
                  </span>
                }
                value={formData.parent_lname || ""}
                onChange={handleChange}
                required
              />
              <FloatingField
                name="parent_suffix"
                type="text"
                label="Suffix"
                value={formData.parent_suffix || ""}
                onChange={handleChange}
              />
              <FloatingField
                name="parent_email"
                type="email"
                label={
                  <span>
                    Email <span className="text-red-500">*</span>
                  </span>
                }
                value={formData.parent_email || ""}
                onChange={handleChange}
                required
              />
              <FloatingField
                name="parent_contact_no"
                type="text"
                label={
                  <span>
                    Parent Contact No. <span className="text-red-500">*</span>
                  </span>
                }
                value={formData.parent_contact_no || ""}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^\d{0,11}$/.test(input)) handleChange(e);
                }}
                required
              />
            </div>
          )}

          {/* Tutor Fields */}
          {formData.account_type === "tutor" && (
            <div className="grid grid-cols-2 gap-2 mb-2">
              <h4 className="col-span-2 text-md font-semibold">Tutor Profile</h4>

              <FloatingField
                name="certification"
                type="text"
                label={
                  <span>
                    Certification <span className="text-red-500">*</span>
                  </span>
                }
                value={formData.certification || ""}
                onChange={handleChange}
                required
              />
              <FloatingField
                name="teaching_lvl"
                type="text"
                label={
                  <span>
                    Teaching Level <span className="text-red-500">*</span>
                  </span>
                }
                value={formData.teaching_lvl || ""}
                onChange={handleChange}
                required
              />
              <FloatingField
                name="subject"
                type="text"
                label={
                  <span>
                    Subject <span className="text-red-500">*</span>
                  </span>
                }
                value={formData.subject || ""}
                onChange={handleChange}
                required
              />
              <FloatingField
                name="credentials"
                type="text"
                label={
                  <span>
                    Credentials <span className="text-red-500">*</span>
                  </span>
                }
                value={formData.credentials || ""}
                onChange={handleChange}
                required
              />
              <FloatingField
                name="graduate_at"
                type="text"
                label={
                  <span>
                    Graduate At <span className="text-red-500">*</span>
                  </span>
                }
                value={formData.graduate_at || ""}
                onChange={handleChange}
                required
              />
              <FloatingField
                name="major"
                type="text"
                label={
                  <span>
                    Major <span className="text-red-500">*</span>
                  </span>
                }
                value={formData.major || ""}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {isEdit ? "Update User" : "Save User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;