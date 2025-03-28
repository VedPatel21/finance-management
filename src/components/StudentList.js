import React from "react";
import "../styles/studentList.css";

const StudentList = ({ students }) => (
  <div className="student-list">
    <h3>Student List</h3>
    <table className="student-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Full Name</th>
          <th>Class</th>
          <th>Expected Fee</th>
          <th>Total Paid</th>
          <th>Fee Balance</th>
        </tr>
      </thead>
      <tbody>
        {students.map((s) => (
          <tr key={s.id}>
            <td>{s.id}</td>
            <td>{s.full_name}</td>
            <td>{s.class}</td>
            <td>₹{s.expected_fee}</td>
            <td>₹{s.total_fee_paid}</td>
            <td>₹{s.fee_balance}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default StudentList;
