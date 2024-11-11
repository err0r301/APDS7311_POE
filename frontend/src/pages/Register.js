import React, { useState } from "react";

const UserInfoForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    surname: "",
    IDNumber: "",
    accountNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.surname) newErrors.surname = "Surname is required.";
    if (!formData.IDNumber) newErrors.IDNumber = "ID number is required.";
    if (!formData.accountNumber)
      newErrors.accountNumber = "Account number is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});

      try {
        // Send form data to the backend
        const response = await fetch(
          "https://localhost:4000/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          let errorMessage = "Registration failed";

          // Attempt to parse the response as JSON
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (err) {
            // If response is not JSON, fall back to plain text
            errorMessage = (await response.text()) || errorMessage;
          }

          setErrors({ form: errorMessage });
          return;
        }

        console.log("Form submitted successfully:", formData);
        setFormData({
          username: "",
          name: "",
          surname: "",
          IDNumber: "",
          accountNumber: "",
          password: "",
        });
      } catch (error) {
        setErrors({ form: error.message || "An unexpected error occurred" });
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
      }}
    >
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="input_field">
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </label>
          {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}
        </div>
        <div className="input_field">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        </div>
        <div className="input_field">
          <label>
            Surname:
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
            />
          </label>
          {errors.surname && <p style={{ color: "red" }}>{errors.surname}</p>}
        </div>
        <div className="input_field">
          <label>
            ID Number:
            <input
              type="text"
              name="IDNumber"
              value={formData.IDNumber}
              onChange={handleChange}
            />
          </label>
          {errors.IDNumber && <p style={{ color: "red" }}>{errors.IDNumber}</p>}
        </div>
        <div className="input_field">
          <label>
            Account Number:
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
            />
          </label>
          {errors.accountNumber && (
            <p style={{ color: "red" }}>{errors.accountNumber}</p>
          )}
        </div>
        <div className="input_field">
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Have an account?{" "}
        <a href="/" className="link">
          Sign In
        </a>
      </p>
      {errors.form && <p style={{ color: "red" }}>{errors.form}</p>}{" "}
      {/* Display form-wide error */}
    </div>
  );
};

export default UserInfoForm;
