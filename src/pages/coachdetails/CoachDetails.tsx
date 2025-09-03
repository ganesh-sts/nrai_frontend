import React, { useEffect, useState } from "react";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { registerCoach } from "../../apis/api"; // make sure your API exists

const CoachDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as { formData?: any };

  const [formData, setFormData] = useState({
    profilePhoto: "",
    firstName: "",
    lastName: "",
    aadhaar: "",
    email: "",
    contact: "",
    dateOfBirth: "",
    gender: "",
    state: "",
    address: "",
    shooterId: state?.formData?.shooterId || "",
    nraiId: state?.formData?.nraiId || "",
    eventType: state?.formData?.eventType || [],
    coachingExperienceYear: state?.formData?.coachingExperienceYear || "",
    coachingExperienceMonth: state?.formData?.coachingExperienceMonth || "",
    certificate: state?.formData?.certificate || [],
    nraiLicence: state?.formData?.nraiLicence || "",
    nraiValidUpto: state?.formData?.nraiValidUpto || "",
    issfLicence: state?.formData?.issfLicence || "",
    issfValidUpto: state?.formData?.issfValidUpto || "",
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrefilled, setIsPrefilled] = useState(false);

  useEffect(() => {
    if (!state?.formData.data) return;
    const data = state.formData.data;
    setFormData(prev => ({
      ...prev,
      ...data,
      shooterId: data.shooterId || "",
      nraiId: data.nraiId || "",
    }));
    if (state.formData.fetchDetails === "yes") {
      setIsPrefilled(true);
    }
  }, [state?.formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      if (state?.formData?.fetchDetails === "yes") {
    navigate("/coach-login");
    return;
  }

    // Validation
    if (!formData.firstName) return setFormError("Please Enter First Name");
    if (!formData.lastName) return setFormError("Please Enter Last Name");
    if (!formData.aadhaar) return setFormError("Please Enter Aadhaar Card number");
    if (!formData.email) return setFormError("Please Enter Email ID");
    if (!formData.contact) return setFormError("Please Enter Contact Number");
    if (!formData.dateOfBirth) return setFormError("Please Enter Date of Birth");
    if (!formData.gender) return setFormError("Please Select Gender");
    if (!formData.state) return setFormError("Please Select State");
    if (!formData.address) return setFormError("Please Enter Address");

    setFormError(null);
    setIsSubmitting(true);

    try {
      // Call the registration API here
     
      await registerCoach(formData);

      alert("Coach Registered Successfully!");
      navigate("/coach-login");
    } catch (error) {
      console.error(error);
      setFormError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
              <label htmlFor="profilePhotoUpload" className="editIcon" >
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
              readOnly={isPrefilled}
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
              readOnly={isPrefilled}
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
              readOnly={isPrefilled}
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
              readOnly={isPrefilled}
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
              readOnly={isPrefilled}
            />

            {/* Date of Birth */}
            <label>
              Date of Birth<span className="required">*</span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              placeholder="Enter DOB"
              readOnly={isPrefilled}
            />

            {/* Gender dropdown */}
            <label>
              Gender<span className="required">*</span>
            </label>
            <select name="gender" value={formData.gender} onChange={handleChange} disabled={isPrefilled}>
              <option>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            {/* State dropdown */}
            <label>
              State<span className="required">*</span>
            </label>
            <select name="state" value={formData.state} onChange={handleChange} disabled={isPrefilled}>
              <option value="">Select State</option>
              <option value="Goa">Goa</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Maharashtra">Maharashtra</option>
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
              readOnly={isPrefilled}
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
