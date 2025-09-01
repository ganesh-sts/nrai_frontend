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
      <div className="headerContainerCard">
        <div className="loginLogo">
        </div>
          <div className="loginName">
        <h1>LOGIN</h1>
        </div>
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
            />

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="admin"
                  checked={formData.admin}
                  onChange={handleChange}
                />
                Admin
              </label><br></br>
              <label>
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                Remember Me
              </label>
            </div>

            <button type="submit" className="nextBtn">
              Sign In
            </button>

            <button
              type="button"
              className="secondaryBtn"
              onClick={() => navigate("/coach-register")}
            >
              New Shooter Registration
            </button>

            {formError && <div className="formError">{formError}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
