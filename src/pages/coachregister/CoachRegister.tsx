import React, { useState } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { getShooterData } from "../../apis/api";

type Certificate = {
  name: string;
  file: File | null; // file can be null or File object
};

const CoachRegister: React.FC = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    shooterId: "",
    nraiId: "",
    eventType: [] as string[],
    coachingExperienceYear: "",
    coachingExperienceMonth: "",
    certificate: [{ name: "", file: null }] as Certificate[],
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

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation before going to next page
    if (!formData.shooterId) {
      setFormError("Shooter ID is required");
      return;
    }
    if (formData.eventType.length === 0) {
      setFormError("Please select at least one Event Type");
      return;
    }
    if (!formData.coachingExperienceYear || !formData.coachingExperienceMonth) {
      setFormError("Please select your coaching experience");
      return;
    }
    if (
      formData.certificate.length === 0 ||
      formData.certificate.some((cert) => !cert.name)
    ) {
      setFormError("Please enter Certificate Name for all entries");
      return;
    }
    if (formData.certificate.some((cert) => !cert.file)) {
      setFormError("Please upload file for all certificates");
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

    setFormError(null);

    // If fetchDetails = yes, fetch data from API
    let payload = { ...formData };
    if (formData.fetchDetails === "yes") {
      try {
        const data = await getShooterData(formData.shooterId);
        if (!data) {
          setFormError("Shooter ID not found");
          return;
        }
        payload = { ...payload, ...data };
      } catch {
        setFormError("Error fetching Shooter Data");
        return;
      }
    }
    console.log(payload)
    // Navigate to second page with formData
    navigate("/coach-details", { state: { formData: payload } });
  };

  return (
    <div className="coachRegisterPage">
      <div className="headerContainerCard">
        <h1>NEW COACH REGISTRATION</h1>
        <h2>Coach Registration Details</h2>
        <div className="formContainer">
          <p className="note">Note: Only NRAI Shooter can register as NRAI Coach</p>
          <form onSubmit={handleNext}>
            {/* Shooter ID */}
            <div className="formGroup">
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
            </div>

            {/* Coach ID */}
            <div className="formGroup">
              <label>
                NRAI Coach ID
                <span className="subText">
                  (If already registered as Coach with NRAI offline)
                </span>
              </label>
              <input
                type="text"
                name="nraiId"
                placeholder="Enter Coach Id"
                value={formData.nraiId}
                onChange={handleChange}
              />
            </div>

            {/* Event Type */}
            <div className="formGroup">
              <label>
                Event Type <span className="required">*</span>
              </label>
              <div className="checkboxGroup">
                {["Pistol", "Rifle", "Shotgun"].map((ev) => (
                  <label key={ev}>
                    <input
                      type="checkbox"
                      value={ev}
                      checked={formData.eventType.includes(ev)}
                      onChange={handleCheckboxChange}
                    />
                    {ev}
                  </label>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="formGroup">
              <label>
                Coaching Experience <span className="required">*</span>
              </label>
              <div className="inlineSelects">
                <select name="coachingExperienceYear" value={formData.coachingExperienceYear} onChange={handleChange}>
                  <option value="">Select Years</option>
                  {Array.from({ length: 30 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <select name="coachingExperienceMonth" value={formData.coachingExperienceMonth} onChange={handleChange}>
                  <option value="">Select Months</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Certificates */}
            <div className="formGroup">
              <label>
                Coach Course Certificate <span className="required">*</span>
              </label>
              {formData.certificate.map((cert, index) => (
                <div key={index} className="inlineInputs" style={{ marginBottom: "8px" }}>
                  <input
                    type="text"
                    placeholder="Enter Certificate Name"
                    value={cert.name}
                    onChange={(e) => {
                      const updated = [...formData.certificate];
                      updated[index].name = e.target.value;
                      setFormData({ ...formData, certificate: updated });
                    }}
                  />
                  <button
                    type="button"
                    className="uploadBtn"
                    onClick={() =>
                      document.getElementById(`certificateUpload-${index}`)?.click()
                    }
                  >
                    Upload
                  </button>
                  <input
                    type="file"
                    id={`certificateUpload-${index}`}
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const updated = [...formData.certificate];
                        updated[index].file = file;
                        setFormData({ ...formData, certificate: updated });
                      }
                    }}
                  />
                  {index === formData.certificate.length - 1 && (
                    <button
                      type="button"
                      className="addCertBtn"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          certificate: [...formData.certificate, { name: "", file: null }],
                        })
                      }
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* NRAI Licence */}
            <div className="formGroup">
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
            </div>

            {/* ISSF Licence */}
            <div className="formGroup">
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
                  value={formData.issfValidUpto}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Fetch Details */}
            <div className="formGroup">
              <label>
                Do you want to fetch your details from your Shooter ID?{" "}
                <span className="required">*</span>
              </label>
              <div className="radioGroup">
                {["yes", "no"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="radio"
                      name="fetchDetails"
                      value={opt}
                      checked={formData.fetchDetails === opt}
                      onChange={handleChange}
                    />
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            {formError && <div className="formError">{formError}</div>}
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
