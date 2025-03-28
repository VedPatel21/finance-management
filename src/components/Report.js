import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../styles/reports.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "top",
      labels: {
        font: { size: 14, weight: "bold" },
      },
    },
    tooltip: {
      enabled: true,
      backgroundColor: "#333",
      titleFont: { size: 14 },
      bodyFont: { size: 12 },
      bodySpacing: 4,
      cornerRadius: 4,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 12, weight: "500" } },
    },
    y: {
      beginAtZero: true,
      grid: { color: "rgba(0,0,0,0.1)" },
      ticks: {
        font: { size: 12, weight: "500" },
        callback: (value) => `₹${value}`,
      },
    },
  },
};

const Report = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // Fallback sample data
  const sampleLabels = ["January", "February", "March", "April", "May", "June"];
  const sampleFees = [50000, 40000, 60000, 45000, 70000, 55000];
  const sampleExpenses = [30000, 35000, 40000, 32000, 45000, 38000];

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/students/fees/monthly").then((res) => {
        if (!res.ok) throw new Error("Fee API error");
        return res.json();
      }),
      fetch("http://localhost:5000/expenses/monthly").then((res) => {
        if (!res.ok) throw new Error("Expenses API error");
        return res.json();
      }),
    ])
      .then(([feeData, expenseData]) => {
        const feeMap = {};
        feeData.labels.forEach((label, index) => {
          feeMap[label] = feeData.data[index];
        });

        const expenseMap = {};
        expenseData.monthly_expenses.forEach((rec) => {
          const monthStr = rec.month.toString().padStart(2, "0");
          const key = `${rec.year}-${monthStr}`;
          expenseMap[key] = rec.total_expense;
        });

        const allKeysSet = new Set([...Object.keys(feeMap), ...Object.keys(expenseMap)]);
        const allKeys = Array.from(allKeysSet).sort();

        const feesArr = allKeys.map((key) => feeMap[key] || 0);
        const expensesArr = allKeys.map((key) => expenseMap[key] || 0);

        setChartData({
          labels: allKeys,
          datasets: [
            {
              label: "Fees Collected (₹)",
              data: feesArr,
              backgroundColor: "#4CAF50",
              borderColor: "#388E3C",
              borderWidth: 1,
              barThickness: 40,
              borderRadius: 8,
            },
            {
              label: "Expenses (₹)",
              data: expensesArr,
              backgroundColor: "#f44336",
              borderColor: "#d32f2f",
              borderWidth: 1,
              barThickness: 40,
              borderRadius: 8,
            },
          ],
        });
      })
      .catch((err) => {
        console.error("Error fetching data: ", err);
        setChartData({
          labels: sampleLabels,
          datasets: [
            {
              label: "Fees Collected (₹)",
              data: sampleFees,
              backgroundColor: "#4CAF50",
              borderColor: "#388E3C",
              borderWidth: 1,
              barThickness: 40,
              borderRadius: 8,
            },
            {
              label: "Expenses (₹)",
              data: sampleExpenses,
              backgroundColor: "#f44336",
              borderColor: "#d32f2f",
              borderWidth: 1,
              barThickness: 40,
              borderRadius: 8,
            },
          ],
        });
      });
  }, []);

  return (
    <div className="report-container">
      <h2 className="report-title">Monthly Fees and Expenses Report</h2>
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Report;
