import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/viewExpenses.css";

function ViewExpenses() {
  const [groupedExpenses, setGroupedExpenses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get("/expenses/");
        const expenses = res.data.expenses;
        // Group expenses by year-month
        const groups = expenses.reduce((acc, expense) => {
          const date = new Date(expense.date);
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
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

    fetchExpenses();
  }, []);

  // Format key like "2025-03" to "March 2025"
  const formatMonth = (yearMonth) => {
    const [year, month] = yearMonth.split("-");
    const date = new Date(year, parseInt(month) - 1);
    return `${date.toLocaleString("default", { month: "long" })} ${year}`;
  };

  return (
    <div className="view-expenses-container">
      <header className="admin-header">
        <h1 className="logo">School Admin</h1>
        <nav className="nav-links">
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/expenses/add")}>Add Expense</button>
        </nav>
      </header>
      <main className="view-expenses">
        <h2 className="page-title">View Expenses</h2>
        {loading ? (
          <p>Loading expenses...</p>
        ) : error ? (
          <p className="feedback error">{error}</p>
        ) : Object.keys(groupedExpenses).length === 0 ? (
          <p>No expense data available.</p>
        ) : (
          Object.keys(groupedExpenses)
            .sort()
            .map((key) => (
              <div key={key} className="expense-group">
                <h3>
                  {formatMonth(key)} (Total: ₹{groupedExpenses[key].total.toFixed(2)})
                </h3>
                <table className="expenses-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Mode</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedExpenses[key].expenses.map((exp) => (
                      <tr key={exp.id}>
                        <td>{exp.description || "N/A"}</td>
                        <td>{exp.mode}</td>
                        <td>{exp.date}</td>
                        <td>₹{parseFloat(exp.amount).toFixed(2)}</td>
                        <td>{exp.subject}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
        )}
      </main>
    </div>
  );
}

export default ViewExpenses;
