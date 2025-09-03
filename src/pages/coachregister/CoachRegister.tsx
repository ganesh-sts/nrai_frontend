import React, { useState } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { getShooterData, registerCoach } from "../../apis/api";

const CoachRegister: React.FC = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    shooterId: "",
    coachId: "",
    eventType: [] as string[],
    years: "",
    months: "",
    certificate: "",
    uploadedFile: null as File | null,
    nraiLicence: "",
    nraiValidUpto: "",
    issfLicence: "",
    issfValidUpto: "",
    fetchDetails: "yes",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      eventType: checked
        ? [...prev.eventType, value]
        : prev.eventType.filter((ev) => ev !== value),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData({ ...formData, uploadedFile: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.eventType.length === 0) {
      setFormError("Please select at least one Event Type");
      return;
    }
    if (!formData.years || !formData.months) {
      setFormError("Please select Experience");
      return;
    }
    if (!formData.certificate) {
      setFormError("Please enter Certificate Name");
      return;
    }
    if (!formData.uploadedFile) {
      setFormError("Please Upload Certificate");
      return;
    }
    if (!formData.nraiLicence || !formData.nraiValidUpto) {
      setFormError("Please enter NRAI Licence No and Date");
      return;
    }
    if (!formData.issfLicence || !formData.issfValidUpto) {
      setFormError("Please enter ISSF Licence No and Date");
      return;
    }
    if (!formData.fetchDetails) {
      setFormError("Please select if you want to fetch details");
      return;
    }

    try {
      let payload: any;

      if (formData.fetchDetails === "yes") {
        // fetch data by shooterId
        const data = await getShooterData(formData.shooterId);
        if (!data) {
          setFormError("Shooter ID not found");
          return;
        }
        payload = { ...data,...formData };
      } else {
        payload = { ...formData };
      }

      // call register API
      // await registerCoach(payload);
      console.log("Payload: ", payload);
      // Navigate to CoachDetails page with data
      navigate("/coach-details", { state: { formData: payload } });
    } catch (err) {
      setFormError("Something went wrong. Try again.");
    }
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

            {/* Hidden file input */}
            <input
              type="file"
              id="certificateUpload"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Store file separately, do not overwrite manual certificate name
                  setFormData({ ...formData, uploadedFile: file });

                }
              }}
            />

            {/* Upload Button triggers hidden input */}
            <button
              type="button"
              className="uploadBtn"
              onClick={() => document.getElementById("certificateUpload")?.click()}
            >
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