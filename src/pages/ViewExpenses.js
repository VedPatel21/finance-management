import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/viewExpenses.css";

function ViewExpenses() {
  const [groupedExpenses, setGroupedExpenses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateExpenseData, setUpdateExpenseData] = useState(null);
  const navigate = useNavigate();

  // Fetch expenses and group them by year-month
  const fetchExpenses = async () => {
    try {
      const res = await api.get("/expenses/");
      const expenses = res.data.expenses;
      const groups = expenses.reduce((acc, expense) => {
        const dateObj = new Date(expense.date);
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
        const key = `${year}-${month}`;
        if (!acc[key]) {
          acc[key] = { total: 0, expenses: [] };
        }
        acc[key].expenses.push(expense);
        acc[key].total += parseFloat(expense.amount);
        return acc;
      }, {});
      setGroupedExpenses(groups);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Failed to fetch expenses. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Format key like "2025-03" to "March 2025"
  const formatMonth = (yearMonth) => {
    const [year, month] = yearMonth.split("-");
    const date = new Date(year, parseInt(month) - 1);
    return `${date.toLocaleString("default", { month: "long" })} ${year}`;
  };

  // Open modal for updating expense
  const openUpdateModal = (expense) => {
    setUpdateExpenseData(expense);
    setShowUpdateModal(true);
  };

  // Handle form field changes in the modal
  const handleUpdateChange = (e) => {
    setUpdateExpenseData({
      ...updateExpenseData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit update form: PUT request to update expense
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/expenses/${updateExpenseData.id}`, updateExpenseData);
      setShowUpdateModal(false);
      fetchExpenses();
    } catch (err) {
      console.error("Error updating expense:", err);
      setError("Failed to update expense. Please try again later.");
    }
  };

  // Delete expense and refresh the list
  const handleDelete = async (expenseId) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await api.delete(`/expenses/${expenseId}`);
      fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError("Failed to delete expense. Please try again later.");
    }
  };

  return (
    <div className="view-expenses-container">
      <main className="view-expenses">
        <h2 className="page-title">Expense Overview</h2>
        {loading ? (
          <p className="info-message">Loading expenses...</p>
        ) : error ? (
          <p className="feedback error">{error}</p>
        ) : Object.keys(groupedExpenses).length === 0 ? (
          <p className="info-message">No expense data available.</p>
        ) : (
          Object.keys(groupedExpenses)
            .sort((a, b) => (a > b ? -1 : 1))
            .map((key) => (
              <div key={key} className="expense-group">
                <div className="group-header">
                  <h3>{formatMonth(key)}</h3>
                  <p className="group-total">
                    Total: ₹{groupedExpenses[key].total.toFixed(2)}
                  </p>
                </div>
                <table className="expenses-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Mode</th>
                      <th>Date</th>
                      <th>Amount (₹)</th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedExpenses[key].expenses.map((exp) => (
                      <tr key={exp.id}>
                        <td>{exp.description || "N/A"}</td>
                        <td>{exp.mode}</td>
                        <td>{exp.date}</td>
                        <td>{parseFloat(exp.amount).toFixed(2)}</td>
                        <td>{exp.subject}</td>
                        <td>
                          <button
                            className="action-btn update"
                            onClick={() => openUpdateModal(exp)}
                          >
                            Update
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDelete(exp.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
        )}

        {/* Modal for updating expense */}
        {showUpdateModal && updateExpenseData && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Update Expense</h3>
              <form onSubmit={handleUpdateSubmit} className="update-form">
                <div className="form-group">
                  <label>Amount:</label>
                  <input
                    type="number"
                    name="amount"
                    value={updateExpenseData.amount}
                    onChange={handleUpdateChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Mode:</label>
                  <select
                    name="mode"
                    value={updateExpenseData.mode}
                    onChange={handleUpdateChange}
                    required
                  >
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date (YYYY-MM-DD):</label>
                  <input
                    type="date"
                    name="date"
                    value={updateExpenseData.date}
                    onChange={handleUpdateChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    name="description"
                    value={updateExpenseData.description}
                    onChange={handleUpdateChange}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Category:</label>
                  <input
                    type="text"
                    name="subject"
                    value={updateExpenseData.subject}
                    onChange={handleUpdateChange}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="action-btn update">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="action-btn delete"
                    onClick={() => setShowUpdateModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ViewExpenses;
