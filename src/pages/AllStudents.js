import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/allStudents.css";

function AllStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    expected_fee: "",
    total_fee_paid: "",
    transaction_date: new Date().toISOString().split("T")[0],
    mode: "Cash",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, [search]);

  const fetchStudents = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      const response = await api.get("/students/", { params });
      setStudents(response.data.students);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleHistory = async (student) => {
    try {
      const response = await api.get(`/students/history/${student.id}`);
      setTransactionHistory(response.data.history);
      setSelectedStudent(student);
      setHistoryModalOpen(true);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    }
  };

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

  const handleDeleteStudent = async (studentId) => {
    try {
      await api.delete(`/students/${studentId}`);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      expected_fee: student.expected_fee,
      total_fee_paid: student.total_fee_paid,
      transaction_date: new Date().toISOString().split("T")[0],
      mode: "Cash",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/students/${editingStudent.id}`, {
        expected_fee: parseFloat(formData.expected_fee),
        total_fee_paid: parseFloat(formData.total_fee_paid),
        mode: formData.mode,
        timestamp: formData.transaction_date,
      });
      fetchStudents();
      setEditingStudent(null);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const groupByClass = (studentsList) => {
    if (!studentsList || !Array.isArray(studentsList)) return {};
    return studentsList.reduce((groups, student) => {
      const className = student.class;
      if (!groups[className]) groups[className] = [];
      groups[className].push(student);
      return groups;
    }, {});
  };

  const groupedStudents = groupByClass(students);

  return (
    <div className="all-students-container">
      <main className="all-students">
        <h2 className="page-title">All Students</h2>
        <div className="filter-controls">
          <input
            type="text"
            placeholder="Search by student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {Object.keys(groupedStudents).length === 0 ? (
          <p>No students found.</p>
        ) : (
          Object.keys(groupedStudents).map((className) => (
            <div key={className} className="student-group">
              <h3>{className}</h3>
              <div className="card-container">
                {groupedStudents[className].map((student) => (
                  <div className="student-card" key={student.id}>
                    <h4>{student.full_name}</h4>
                    <p>Expected Fee: ₹{student.expected_fee}</p>
                    <p>Total Paid: ₹{student.total_fee_paid}</p>
                    <p>Pending: ₹{student.expected_fee - student.total_fee_paid}</p>
                    <div className="card-actions">
                      <button className="edit-btn" onClick={() => handleEdit(student)}>
                        Edit
                      </button>
                      <button className="history-btn" onClick={() => handleHistory(student)}>
                        History
                      </button>
                      <button className="delete-student-btn" onClick={() => handleDeleteStudent(student.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
        {editingStudent && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edit Student: {editingStudent.full_name}</h3>
              <form onSubmit={handleSubmit}>
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
                  <button type="button" className="cancel-btn" onClick={() => setEditingStudent(null)}>
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
              <h3>Transaction History - {selectedStudent.full_name}</h3>
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
}

export default AllStudents;
