import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";

interface FormData {
  email: string;
  password: string;
  admin: boolean;
  remember: boolean;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    admin: false,
    remember: false,
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Single error validation
    if (!formData.email) {
      setFormError("Please enter Email");
      return;
    }
    if (!formData.password) {
      setFormError("Please enter Password");
      return;
    }

    // Success
    setFormError(null);
    console.log("Login successful:", formData);
    navigate("/dashboard"); // redirect to dashboard
  };

return (
  <div className="loginPage">
      <div className="loginContainer">
        {/* Top Row */}
        <div className="topRow">

          <div className="logoSection">
      <div className="loginLogo"></div>
            <h1>LOGIN</h1>
          </div>
        </div>

     {/* Bottom Content */}
<div className="bottomContent">
  {/* Input Fields */}
  <div className="inputFields">
    <input
      type="text"
      name="username"
      placeholder="Username"
      onChange={handleChange}
    />
    <input
      type="password"
      name="password"
      placeholder="Password"
      onChange={handleChange}
    />
  </div>

  {/* Options Row */}
  <div className="optionsRow">
    <label>
      <input
        type="checkbox"
        name="admin"
        checked={formData.admin}
        onChange={handleChange}
      />
      Admin
    </label>
    <label>
      <input
        type="checkbox"
        name="remember"
        checked={formData.remember}
        onChange={handleChange}
      />
      Remember Me
    </label>

    <a href="/forgot-password" className="forgotLink">
      Forgot Password?
    </a>
  </div>

  {/* Buttons */}
  <div className="buttonRow">
    <button type="submit" className="nextBtn" onClick={handleSubmit}>
      Sign In
    </button>
  </div>
  <div className="buttonRow">
    <button
      type="button"
      className="secondaryBtn"
      onClick={() => navigate("/")}
    >
      New Shooter ID Register
    </button>
  </div>


  <p className="tagline">NRAL Shooters | Register Shooting Range</p>
  {formError && <div className="formError">{formError}</div>}
</div>

      </div>
    </div>
  );
};

export default LoginPage;