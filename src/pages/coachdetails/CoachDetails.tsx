import React, { useEffect, useState } from "react";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { mockShooterData } from "../coachregister/TempData";

const CoachDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Data passed from previous page (CoachRegister)
  const state = location.state as { formData?: any };

  // Store all form field values in one state object
  const [formData, setFormData] = useState({
    profilePhoto: "",
    firstName: "",
    lastName: "",
    aadhaar: "",
    email: "",
    contact: "",
    dob: "",
    gender: "",
    state: "",
    address: "",
    shooterId: state?.formData?.shooterId || "",
    coachId: state?.formData?.coachId || "",
  });

  // Holds a single form-level error message
  const [formError, setFormError] = useState<string | null>(null);

  /**
   * Handle input/select/textarea changes
   * Updates state dynamically based on "name" attribute
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Prefill form data if Shooter ID is available
   * Simulates fetching data from mockShooterData (like API response)
   */
  useEffect(() => {
    if (state?.formData?.shooterId) {
      const shooterInfo = mockShooterData[state.formData.shooterId];
      if (shooterInfo) {
        setFormData((prev) => ({ ...prev, ...shooterInfo }));
      }
    }
  }, [state?.formData?.shooterId]);

  /**
   * Form submit handler
   * - Validates all required fields
   * - Shows error if any field is missing
   * - If valid, redirects to login page
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // === Validation checks ===
    if (!formData.firstName) return setFormError("Please Enter First Name");
    if (!formData.lastName) return setFormError("Please Enter Last Name");
    if (!formData.aadhaar) return setFormError("Please Enter Aadhaar Card number");
    if (!formData.email) return setFormError("Please Enter Email ID");
    if (!formData.contact) return setFormError("Please Enter Contact Number");
    if (!formData.dob) return setFormError("Please Enter Date of Birth");
    if (!formData.gender) return setFormError("Please Select Gender");
    if (!formData.state) return setFormError("Please Select State");
    if (!formData.address) return setFormError("Please Enter Address");

    // ✅ All validations passed
    setFormError(null);

    console.log("Coach Details Submitted:", formData);

    // Redirect to login (next step after registration)
    navigate("/coach-login");
  };

  return (
    <div className="coachDetailsPage">
      <div className="headerContainerCard">
        <h1>NEW COACH REGISTRATION</h1>
        <h2>Coach Registration Details</h2>

        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            {/* Profile Photo Upload */}
            <label>
              Profile Photo <span className="required">*</span>
            </label>
            <div className="inlineInputs">
              <button type="button" className="uploadBtn">
                View
              </button>
              <input
                type="file"
                id="profilePhotoUpload"
                name="profilePhoto"
                style={{ display: "none" }}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profilePhoto: e.target.files?.[0]?.name || "",
                  })
                }
              />
              {/* Edit icon triggers hidden file input */}
              <label htmlFor="profilePhotoUpload" className="editIcon">
                <FontAwesomeIcon icon={faPenToSquare} />
              </label>
            </div>

            {/* First Name */}
            <label>
              First Name<span className="required">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter First Name"
            />

            {/* Last Name */}
            <label>
              Last Name<span className="required">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter Last Name"
            />

            {/* Aadhaar */}
            <label>
              Aadhaar Card<span className="required">*</span>
            </label>
            <input
              type="text"
              name="aadhaar"
              value={formData.aadhaar}
              onChange={handleChange}
              placeholder="Enter Aadhaar Number"
            />

            {/* Email */}
            <label>
              Email ID<span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email ID"
            />

            {/* Contact */}
            <label>
              Contact No<span className="required">*</span>
            </label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter Contact No"
            />

            {/* Date of Birth */}
            <label>
              Date of Birth<span className="required">*</span>
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              placeholder="Enter DOB"
            />

            {/* Gender dropdown */}
            <label>
              Gender<span className="required">*</span>
            </label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            {/* State dropdown */}
            <label>
              State<span className="required">*</span>
            </label>
            <select name="state" value={formData.state} onChange={handleChange}>
              <option value="">Select State</option>
              <option value="goa">Goa</option>
              <option value="delhi">Delhi</option>
              <option value="maharashtra">Maharashtra</option>
            </select>

            {/* Address */}
            <label>
              Address<span className="required">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter Address"
            />

            {/* Submit Button */}
            <button type="submit" className="nextBtn">
              Submit & Pay
            </button>

            {/* Show validation error */}
            {formError && <div className="formError">{formError}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CoachDetails;
