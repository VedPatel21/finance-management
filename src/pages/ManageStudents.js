import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import StudentForm from "../components/StudentForm";
import "../styles/manageStudents.css";

const ManageStudents = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]); // Auto-suggest results
  const [selectedStudent, setSelectedStudent] = useState(null); // For selected student details
  const [editingStudent, setEditingStudent] = useState(null); // For inline update form
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

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setEditingStudent(null);
    setSuggestions([]);
    setSearch(student.full_name);
    setUpdateMessage("");
    setUpdateError("");
  };

  const handleUpdateChange = (e) => {
    setEditingStudent({
      ...editingStudent,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateSubmit = async (studentId) => {
    try {
      await api.put(`/students/${studentId}`, editingStudent);
      setUpdateMessage("Student updated successfully.");
      setEditingStudent(null);
      const res = await api.get("/students/", { params: { search } });
      const updated = res.data.students.find((s) => s.id === studentId);
      setSelectedStudent(updated);
    } catch (err) {
      setUpdateError("Failed to update student. Please try again.");
      console.error(err);
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
            {editingStudent && editingStudent.id === selectedStudent.id ? (
              <div className="edit-form">
                <h3>Update Student</h3>
                <input
                  type="text"
                  name="full_name"
                  value={editingStudent.full_name}
                  onChange={handleUpdateChange}
                  placeholder="Full Name"
                  required
                />
                <select
                  name="class"
                  value={editingStudent.class}
                  onChange={handleUpdateChange}
                  required
                >
                  <option value="" disabled>
                    Select Class
                  </option>
                  {[
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
                    "8th",
                  ].map((cls, idx) => (
                    <option key={idx} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="expected_fee"
                  value={editingStudent.expected_fee}
                  onChange={handleUpdateChange}
                  placeholder="Expected Fee"
                  required
                />
                <input
                  type="number"
                  name="total_fee_paid"
                  value={editingStudent.total_fee_paid}
                  onChange={handleUpdateChange}
                  placeholder="Total Fee Paid"
                  required
                />
                <div className="form-actions">
                  <button onClick={() => handleUpdateSubmit(selectedStudent.id)}>
                    Save
                  </button>
                  <button onClick={() => setEditingStudent(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="student-info">
                <h3>{selectedStudent.full_name}</h3>
                <p>Class: {selectedStudent.class}</p>
                <p>Expected Fee: {selectedStudent.expected_fee}</p>
                <p>Total Paid: {selectedStudent.total_fee_paid}</p>
                <p>Pending: {selectedStudent.fee_balance}</p>
                <div className="action-buttons">
                  <button onClick={() => setEditingStudent(selectedStudent)}>
                    Update
                  </button>
                  <button onClick={() => handleHistory(selectedStudent)}>
                    History
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {updateError && <p className="feedback error">{updateError}</p>}
        {updateMessage && <p className="feedback success">{updateMessage}</p>}
        <StudentForm onStudentAdded={() => {}} />
        {historyModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>
                Transaction History - {selectedStudent && selectedStudent.full_name}
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
                            onClick={() => handleDeleteTransaction(transaction.id)}
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
              <button className="close-btn" onClick={() => setHistoryModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageStudents;
