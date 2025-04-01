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
  const [message, setMessage] = useState(""); // State to display error or no-data messages

  useEffect(() => {
    fetch("http://localhost:5000/api/reports/monthly-financial")
      .then((res) => {
        if (!res.ok)
          throw new Error(`Monthly Financial API error: ${res.statusText}`);
        return res.json();
      })
      .then((monthlyData) => {
        // Check for error or no-data messages in API response
        if (monthlyData.error) {
          setMessage(monthlyData.error);
          setChartData({
            labels: ["No Data"],
            datasets: [
              {
                label: "Fees Collected (₹)",
                data: [0],
                backgroundColor: "#ccc",
                borderColor: "#aaa",
                borderWidth: 1,
                barThickness: 40,
                borderRadius: 8,
              },
              {
                label: "Expenses (₹)",
                data: [0],
                backgroundColor: "#ddd",
                borderColor: "#bbb",
                borderWidth: 1,
                barThickness: 40,
                borderRadius: 8,
              },
            ],
          });
        } else if (monthlyData.message) {
          setMessage(monthlyData.message);
          setChartData({
            labels: monthlyData.labels && monthlyData.labels.length ? monthlyData.labels : ["No Data"],
            datasets: [
              {
                label: "Fees Collected (₹)",
                data: monthlyData.fees && monthlyData.fees.length ? monthlyData.fees : [0],
                backgroundColor: "#ccc",
                borderColor: "#aaa",
                borderWidth: 1,
                barThickness: 40,
                borderRadius: 8,
              },
              {
                label: "Expenses (₹)",
                data: monthlyData.expenses && monthlyData.expenses.length ? monthlyData.expenses : [0],
                backgroundColor: "#ddd",
                borderColor: "#bbb",
                borderWidth: 1,
                barThickness: 40,
                borderRadius: 8,
              },
            ],
          });
        } else {
          setChartData({
            labels: monthlyData.labels && monthlyData.labels.length ? monthlyData.labels : ["No Data"],
            datasets: [
              {
                label: "Fees Collected (₹)",
                data: monthlyData.fees && monthlyData.fees.length ? monthlyData.fees : [0],
                backgroundColor: "#4CAF50",
                borderColor: "#388E3C",
                borderWidth: 1,
                barThickness: 40,
                borderRadius: 8,
              },
              {
                label: "Expenses (₹)",
                data: monthlyData.expenses && monthlyData.expenses.length ? monthlyData.expenses : [0],
                backgroundColor: "#f44336",
                borderColor: "#d32f2f",
                borderWidth: 1,
                barThickness: 40,
                borderRadius: 8,
              },
            ],
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching data: ", err);
        setMessage("Error loading report. Please try again later.");
        setChartData({
          labels: ["No Data"],
          datasets: [
            {
              label: "Fees Collected (₹)",
              data: [0],
              backgroundColor: "#ccc",
              borderColor: "#aaa",
              borderWidth: 1,
              barThickness: 40,
              borderRadius: 8,
            },
            {
              label: "Expenses (₹)",
              data: [0],
              backgroundColor: "#ddd",
              borderColor: "#bbb",
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
      {message && <p className="no-data-message">{message}</p>}
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Report;
