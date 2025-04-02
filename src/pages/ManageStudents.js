import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import StudentForm from "../components/StudentForm";
import "../styles/manageStudents.css";

const ManageStudents = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]); // Auto-suggest results
  const [selectedStudent, setSelectedStudent] = useState(null); // For selected student details
  const [editingStudent, setEditingStudent] = useState(null); // For updating student (set when Update button is clicked)
  const [formData, setFormData] = useState({
    expected_fee: "",
    total_fee_paid: "",
    transaction_date: new Date().toISOString().split("T")[0],
    mode: "Cash",
  });
  const [updateError, setUpdateError] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.trim() === "") {
        setSuggestions([]);
        return;
      }
      try {
        const params = { search };
        const response = await api.get("/students/", { params });
        setSuggestions(response.data.students);
      } catch (error) {
        console.error("Error fetching student suggestions:", error);
      }
    };
    fetchSuggestions();
  }, [search]);

  // When a student is selected from suggestions
  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setEditingStudent(null);
    setSuggestions([]);
    setSearch(student.full_name);
    setUpdateMessage("");
    setUpdateError("");
  };

  // When user clicks "Update" on the card, open the update modal and initialize formData
  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      expected_fee: student.expected_fee,
      total_fee_paid: student.total_fee_paid,
      transaction_date: new Date().toISOString().split("T")[0],
      mode: "Cash",
    });
    setUpdateMessage("");
    setUpdateError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit update form using formData
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/students/${editingStudent.id}`, {
        expected_fee: parseFloat(formData.expected_fee),
        total_fee_paid: parseFloat(formData.total_fee_paid),
        mode: formData.mode,
        timestamp: formData.transaction_date,
      });
      setUpdateMessage("Student updated successfully.");
      setEditingStudent(null);
      // Refresh the selected student details
      const res = await api.get("/students/", { params: { search } });
      const updated = res.data.students.find((s) => s.id === editingStudent.id);
      setSelectedStudent(updated);
    } catch (err) {
      setUpdateError("Failed to update student. Please try again.");
      console.error(err);
    }
  };

  // Delete the selected student
  const handleDeleteStudent = async () => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await api.delete(`/students/${selectedStudent.id}`);
      setSelectedStudent(null);
      setSearch("");
      setUpdateMessage("");
      setUpdateError("");
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  // Fetch and display transaction history for the selected student
  const handleHistory = async (student) => {
    try {
      const response = await api.get(`/students/history/${student.id}`);
      setTransactionHistory(response.data.history);
      setHistoryModalOpen(true);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    }
  };

  // Delete a specific transaction from the history
  const handleDeleteTransaction = async (transactionId) => {
    try {
      await api.delete(`/students/transactions/${transactionId}`);
      setTransactionHistory((prev) =>
        prev.filter((transaction) => transaction.id !== transactionId)
      );
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <div className="manage-container">
      <main className="manage-students">
        <h2 className="page-title">Manage Students</h2>
        <h3 className="subtitle">Search to Update</h3>
        <div className="filter-controls">
          <input
            type="text"
            placeholder="Search for a student by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedStudent(null);
              setUpdateMessage("");
              setUpdateError("");
            }}
          />
        </div>
        {suggestions.length > 0 && !selectedStudent && (
          <div className="suggestions-list">
            {suggestions.map((student) => (
              <div
                key={student.id}
                onClick={() => handleSelectStudent(student)}
                className="suggestion-item"
              >
                <strong>{student.full_name}</strong> — Class: {student.class}
              </div>
            ))}
          </div>
        )}
        {selectedStudent && (
          <div className="student-card">
            <h4>{selectedStudent.full_name}</h4>
            <p>Expected Fee: ₹{selectedStudent.expected_fee}</p>
            <p>Total Paid: ₹{selectedStudent.total_fee_paid}</p>
            <p>
              Pending: ₹
              {parseFloat(selectedStudent.expected_fee) -
                parseFloat(selectedStudent.total_fee_paid)}
            </p>
            <div className="card-actions">
              <button
                className="edit-btn"
                onClick={() => handleEdit(selectedStudent)}
              >
                Update
              </button>
              <button
                className="history-btn"
                onClick={() => handleHistory(selectedStudent)}
              >
                History
              </button>
              <button
                className="delete-student-btn"
                onClick={handleDeleteStudent}
              >
                Delete
              </button>
            </div>
          </div>
        )}
        {updateError && <p className="feedback error">{updateError}</p>}
        {updateMessage && <p className="feedback success">{updateMessage}</p>}

        {/* Update Modal (matches AllStudents.js) */}
        {editingStudent && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edit Student: {editingStudent.full_name}</h3>
              <form onSubmit={handleUpdateSubmit}>
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
                <div className="form-group">
                  <label>Total Paid:</label>
                  <input
                    type="number"
                    name="total_fee_paid"
                    value={formData.total_fee_paid}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Transaction Date:</label>
                  <input
                    type="date"
                    name="transaction_date"
                    value={formData.transaction_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Mode:</label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    Save
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setEditingStudent(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {historyModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>
                Transaction History -{" "}
                {selectedStudent && selectedStudent.full_name}
              </h3>
              {transactionHistory.length > 0 ? (
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Mode</th>
                      <th>Fee Remaining</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionHistory.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{transaction.timestamp}</td>
                        <td>₹{transaction.amount}</td>
                        <td>{transaction.mode}</td>
                        <td>₹{transaction.fee_remaining}</td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDeleteTransaction(transaction.id)
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No transaction history available.</p>
              )}
              <button
                className="close-btn"
                onClick={() => setHistoryModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <StudentForm onStudentAdded={() => {}} />
      </main>
    </div>
  );
};

export default ManageStudents;
