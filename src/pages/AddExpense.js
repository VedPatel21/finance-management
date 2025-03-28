import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/addExpense.css";

const expenseModes = ["UPI", "Cash"];
const predefinedCategories = [
  "Staff Salary",
  "Land Rent",
  "House Loan",
  "Car Loan",
  "School Maintenance",
  "House Expense"
];

function AddExpense() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: "",
    mode: expenseModes[0],
    date: "",
    description: "",
    subject: predefinedCategories[0],
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const payload = {
        amount: parseFloat(formData.amount),
        mode: formData.mode,
        date: formData.date, // Expected format: YYYY-MM-DD
        description: formData.description,
        subject: formData.subject,
      };
      await api.post("/expenses/", payload);
      setMessage("Expense recorded successfully.");
      setFormData({
        amount: "",
        mode: expenseModes[0],
        date: "",
        description: "",
        subject: predefinedCategories[0],
      });
    } catch (err) {
      setError("Failed to record expense. Please check your fields and try again.");
      console.error(err);
    }
  };

  return (
    <div className="add-expense-container">
      <main className="add-expense">
        <h2 className="page-title">Add Expense</h2>
        {error && <p className="feedback error">{error}</p>}
        {message && <p className="feedback success">{message}</p>}
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Amount:</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Mode:</label>
            <select name="mode" value={formData.mode} onChange={handleChange} required>
              {expenseModes.map((mode, idx) => (
                <option key={idx} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Date (YYYY-MM-DD):</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-group">
            <label>Subject (Expense Category):</label>
            <select name="subject" value={formData.subject} onChange={handleChange} required>
              {predefinedCategories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit">Record Expense</button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AddExpense;
