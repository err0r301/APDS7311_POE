import React, { useState } from "react";

const UserInfoForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
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
    if (!formData.fullName) newErrors.fullName = "Full name is required.";
    if (!formData.idNumber) newErrors.idNumber = "ID number is required.";
    if (!formData.accountNumber)
      newErrors.accountNumber = "Account number is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      // Handle form submission (e.g., send data to server)
      console.log("Form submitted successfully:", formData);
      // Reset form
      setFormData({
        fullName: "",
        idNumber: "",
        accountNumber: "",
        password: "",
      });
    }
  };

  return (
    <div>
      <h2>User Information Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Full Name:
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </label>
          {errors.fullName && <p style={{ color: "red" }}>{errors.fullName}</p>}
        </div>
        <div>
          <label>
            ID Number:
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
            />
          </label>
          {errors.idNumber && <p style={{ color: "red" }}>{errors.idNumber}</p>}
        </div>
        <div>
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
        <div>
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UserInfoForm;
