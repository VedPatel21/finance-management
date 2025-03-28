import React, { useEffect, useState, lazy, Suspense } from "react"; 
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/dashboard.css";

const Report = lazy(() => import("../components/Report")); // Lazy load Report

function Dashboard() {
  const [summary, setSummary] = useState({
    total_fees_collected: 0,
    total_fees_pending: 0,
    total_students: 0,
  });
  const [classSummary, setClassSummary] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await api.get("/students/");
        const students = res.data.students;

        let totalCollected = 0;
        let totalExpected = 0;
        const summaryByClass = {};
        students.forEach((student) => {
          totalCollected += parseFloat(student.total_fee_paid);
          totalExpected += parseFloat(student.expected_fee);
          const cls = student.class;
          if (!summaryByClass[cls]) summaryByClass[cls] = 0;
          summaryByClass[cls] += parseFloat(student.fee_balance);
        });

        setSummary({
          total_fees_collected: totalCollected,
          total_fees_pending: totalExpected - totalCollected,
          total_students: students.length,
        });

        setClassSummary(
          Object.keys(summaryByClass).map((cls) => ({
            class: cls,
            total_fee_pending: summaryByClass[cls],
          }))
        );
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, []);

  const totalPendingFees = summary.total_fees_pending;

  return (
    <div className="dashboard-container">
      <main className="dashboard">
        <h2 className="dashboard-title">Dashboard Overview</h2>
        <div className="dashboard-cards">
          <div className="card">
            <h3>Total Fees Collected</h3>
            <p>₹{summary.total_fees_collected.toFixed(2)}</p>
          </div>
          <div className="card">
            <h3>Total Fees Pending</h3>
            <p>₹{totalPendingFees.toFixed(2)}</p>
          </div>
          <div className="card">
            <h3>Total Students</h3>
            <p>{summary.total_students}</p>
          </div>
        </div>
        <Suspense fallback={<div>Loading Report...</div>}>
          <Report />
        </Suspense>
        <h3 className="section-title">Total Fees Pending by Class</h3>
        {classSummary.length ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Total Fee Pending</th>
              </tr>
            </thead>
            <tbody>
              {classSummary.map((item, index) => (
                <tr key={index}>
                  <td>{item.class}</td>
                  <td>₹{item.total_fee_pending.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="total-row">
                <td><strong>Total</strong></td>
                <td><strong>₹{totalPendingFees.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>No student data available.</p>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
