import React, { useState } from "react";
import api from "../services/api";
import "../styles/studentForm.css";

const classes = [
  "Select Class",
  "Nursery",
  "KG",
  "PP3",
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th"
];

const StudentForm = ({ onStudentAdded }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    class: classes[0],
    expected_fee: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.class === "Select Class") {
      setError("Please select a valid class.");
      return;
    }
    try {
      await api.post("/students/", {
        full_name: formData.full_name,
        class: formData.class,
        expected_fee: parseFloat(formData.expected_fee)
      });
      setFormData({ full_name: "", class: classes[0], expected_fee: "" });
      onStudentAdded();
    } catch (err) {
      setError("Failed to add student. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="student-form">
      <h3>Add New Student</h3>
      {error && <p className="feedback error">{error}</p>}
      <div className="form-group">
        <label>Full Name:</label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Class:</label>
        <select
          name="class"
          value={formData.class}
          onChange={handleChange}
          required
        >
          {classes.map((cls, idx) => (
            <option key={idx} value={cls} disabled={cls === "Select Class"}>
              {cls}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Expected Fee:</label>
        <input
          type="number"
          name="expected_fee"
          value={formData.expected_fee}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit">Add Student</button>
      </div>
    </form>
  );
};

export default StudentForm;
