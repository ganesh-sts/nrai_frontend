import React, { useState } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";

const CoachRegister: React.FC = () => {
  const navigate = useNavigate();

  // For displaying form-level errors (like missing required fields)
  const [formError, setFormError] = useState<string | null>(null);

  // Store all form field values in one state object
  const [formData, setFormData] = useState({
    shooterId: "",
    coachId: "",
    eventType: [] as string[], // multiple selection
    years: "",
    months: "",
    certificate: "",
    nraiLicence: "",
    nraiValidUpto: "",
    issfLicence: "",
    issfValidUpto: "",
    fetchDetails: "yes", // default selected option
  });

  // Store field-specific errors for showing under inputs
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  /**
   * Handle input/select value changes
   * Updates formData state dynamically based on field name
   * Clears error message for that field on change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // clear error when user types/selects
  };

  /**
   * Handle checkbox group (eventType)
   * If checked => add to array, else remove
   */
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      eventType: checked
        ? [...prev.eventType, value]
        : prev.eventType.filter(ev => ev !== value),
    }));
    setErrors({ ...errors, eventType: "" });
  };

  /**
   * Form submission handler
   * - Validates all fields
   * - Shows error if something is missing
   * - On success, navigates to CoachDetails page
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // === Validation checks ===
    if (!formData.shooterId) return setFormError("Please enter NRAI Shooter ID");
    if (!formData.coachId) return setFormError("Please enter NRAI Coach ID");
    if (formData.eventType.length === 0)
      return setFormError("Please select at least one Event Type");
    if (!formData.years || !formData.months)
      return setFormError("Please select Experience");
    if (!formData.certificate) return setFormError("Please enter Certificate Name");
    if (!formData.nraiLicence || !formData.nraiValidUpto)
      return setFormError("Please enter NRAI No and date");
    if (!formData.issfLicence || !formData.issfValidUpto)
      return setFormError("Please enter ISSF No and date");
    if (!formData.fetchDetails)
      return setFormError("Please select if you want to fetch details");

    // ✅ All validations passed
    setFormError(null);

    // Navigate to details page
    navigate("/coach-details", {
      state:
        formData.fetchDetails === "yes"
          ? { shooterId: formData.shooterId, coachId: formData.coachId }
          : null,
    });
  };

  return (
    <div className="coachRegisterPage">
      <div className="headerContainerCard">
        <h1>NEW COACH REGISTRATION</h1>
        <h2>Coach Registration Details</h2>

        <div className="formContainer">
          <p className="note">
            Note: Only NRAI Shooter can register as NRAI Coach
          </p>

          {/* === Registration Form === */}
          <form onSubmit={handleSubmit}>
            {/* Shooter ID */}
            <label>
              NRAI Shooter ID
              <span className="subText">
                (If already registered as Shooter with NRAI offline/online)
              </span>
            </label>
            <input
              type="text"
              name="shooterId"
              placeholder="Enter Shooter Id"
              value={formData.shooterId}
              onChange={handleChange}
            />

            {/* Coach ID */}
            <label>
              NRAI Coach ID
              <span className="subText">
                (If already registered as Coach with NRAI offline)
              </span>
            </label>
            <input
              type="text"
              name="coachId"
              placeholder="Enter Coach Id"
              value={formData.coachId}
              onChange={handleChange}
            />

            {/* Event Type checkboxes */}
            <label>
              Event Type <span className="required">*</span>
            </label>
            <div className="checkboxGroup">
              {["Pistol", "Rifle", "Shotgun"].map(ev => (
                <label key={ev}>
                  <input
                    type="checkbox"
                    value={ev}
                    checked={formData.eventType.includes(ev)}
                    onChange={handleCheckboxChange}
                  />{" "}
                  {ev}
                </label>
              ))}
            </div>
            {errors.eventType && <p className="error">{errors.eventType}</p>}

            {/* Coaching Experience */}
            <label>
              Coaching Experience <span className="required">*</span>
            </label>
            <div className="inlineSelects">
              <select name="years" value={formData.years} onChange={handleChange}>
                <option value="">Select Years</option>
                {Array.from({ length: 30 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <select name="months" value={formData.months} onChange={handleChange}>
                <option value="">Select Months</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            {(errors.years || errors.months) && (
              <p className="error">{errors.years || errors.months}</p>
            )}

            {/* Certificate input */}
            <label>
              Coach Course Certificate <span className="required">*</span>
            </label>
            <input
              className="Certificateinput"
              type="text"
              name="certificate"
              placeholder="Enter Certificate Name"
              value={formData.certificate}
              onChange={handleChange}
            />
            {errors.certificate && <p className="error">{errors.certificate}</p>}
            <button type="button" className="uploadBtn">
              Upload
            </button>

            {/* NRAI Licence */}
            <br />
            <label>
              NRAI Licence <span className="required">*</span>
            </label>
            <div className="inlineInputs">
              <input
                type="text"
                name="nraiLicence"
                placeholder="Licence No"
                value={formData.nraiLicence}
                onChange={handleChange}
              />
              <input
                type="date"
                name="nraiValidUpto"
                value={formData.nraiValidUpto}
                onChange={handleChange}
              />
            </div>

            {/* ISSF Licence */}
            <label>
              ISSF Licence <span className="required">*</span>
            </label>
            <div className="inlineInputs">
              <input
                type="text"
                name="issfLicence"
                placeholder="Licence No"
                value={formData.issfLicence}
                onChange={handleChange}
              />
              <input
                type="date"
                name="issfValidUpto"
                placeholder="Valid Upto"
                value={formData.issfValidUpto}
                onChange={handleChange}
              />
            </div>

            {/* Fetch Details */}
            <label>
              Do you want to fetch your details from your Shooter ID?{" "}
              <span className="required">*</span>
            </label>
            <div className="radioGroup">
              {["yes", "no"].map(opt => (
                <label key={opt}>
                  <input
                    type="radio"
                    name="fetchDetails"
                    value={opt}
                    checked={formData.fetchDetails === opt}
                    onChange={handleChange}
                  />{" "}
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </label>
              ))}
            </div>

            {/* Display global form error */}
            {formError && <div className="formError">{formError}</div>}

            {/* Submit button */}
            <button type="submit" className="nextBtn">
              Next Page
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CoachRegister;
