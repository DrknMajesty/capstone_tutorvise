// components/UserFormModal_Final.js
import React, { useState, useEffect, useRef } from "react";
import FloatingField from "../Components/FloatingFields";

const UserFormModal = ({ formData, setFormData, onSubmit, onClose, isEdit = false }) => {
  const currentUser = sessionStorage.getItem("account_type");
  const [previewImage, setPreviewImage] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  // const [skipPasswordUpdate, setSkipPasswordUpdate] = useState(false); // eslint-disable-next-line
  const fileInputRef = useRef(null);

  // Account type options based on user role
  const accountTypeOptions = [
    { value: "", label: "Select Account Type" },
    { value: "student", label: "Student" },
    { value: "tutor", label: "Tutor" },
    ...(currentUser === "admin" ? [
      { value: "admin staff", label: "Admin Staff" },
      { value: "admin", label: "Admin" }
    ] : [])
  ];

  const genderOptions = [
  { value: "", label: "Select Gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

  const [isChangePassword, setIsChangePassword] = useState(false);

const handleChange = (e) => {
  const { name, type, value, files } = e.target;

  if (type === 'file' && files && files[0]) {
    const file = files[0];
    setFormData((prev) => ({ ...prev, [name]: file }));
  } else {
    let newValue = value;

    // ✅ Instantly block anything except letters and spaces
    if (['fname', 'mname', 'lname', 'parent_fname', 'parent_mname', 'parent_lname'].includes(name)) {
      // Prevent typing if last character is invalid
      if (!/^[A-Za-z\s]*$/.test(newValue)) {
        return; // ❌ Ignore this input change
      }
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  }

  // Clear password error when typing
  if (name === 'password' || name === 'confirmPassword') {
    setPasswordError("");
  }
};


  const handleSubmit = (e) => {
    e.preventDefault();

    let dataToSubmit = { ...formData };

    // In edit mode, only include password fields if changing password
    if (isEdit && !isChangePassword) {
      delete dataToSubmit.password;
      delete dataToSubmit.confirmPassword;
    }

    // Validate passwords if present
    if ((!isEdit || isChangePassword) && (dataToSubmit.password || dataToSubmit.confirmPassword)) {
      if (dataToSubmit.password !== dataToSubmit.confirmPassword) {
        setPasswordError("Passwords do not match.");
        return;
      }
    }

    setPasswordError("");
    setFormData(dataToSubmit);
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
            {isEdit ? "Edit User Details" : "Create New User Account"}
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
            {/* UserName Field */}
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
            {/* Account Type */}
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
              options={accountTypeOptions}
            />
            {/* Gender */}
            <FloatingField
              type="select"
              name="gender"
              label={
                <span>
                  Gender <span className="text-red-500">*</span>
                </span>
              }
              value={formData.gender || ""}
              onChange={handleChange}
              required
              disabled={isEdit}
              options={genderOptions}
            />
            {/* Email */}
            <FloatingField
              name="email"
              type="email"
              label={
                <span>
                  Email <span className="text-red-500">*</span>
                </span>
              }
              value={formData.email || ""}
              onChange={handleChange}
              required
            />
            {/* Contact Number */}
            <FloatingField
              name="contact_no"
              type="text"
              label={
                <span>
                  Contact Number <span className="text-red-500">*</span>
                </span>
              }
              value={formData.contact_no || ""}
              onChange={(e) => {
                const input = e.target.value;
                if (/^\d{0,11}$/.test(input)) handleChange(e);
              }}
              required
            />
            {/* BirthDate */}
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
            {/* First Name */}
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
      label={isEdit ? "New Password" : "Password"}
      value={formData.password ?? ""}
      onChange={handleChange}
      placeholder={isEdit ? "Leave blank to keep current password" : ""}
      required={!isEdit}
    />
    <FloatingField
      name="confirmPassword"
      type="password"
      label={isEdit ? "Confirm New Password" : "Confirm Password"}
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

          {/* Student Account Fields */}
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
                name="experiences"
                type="text"
                label={
                  <span>
                    Experiences <span className="text-red-500">*</span>
                  </span>
                }
                value={formData.experiences || ""}
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
              {isEdit ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;