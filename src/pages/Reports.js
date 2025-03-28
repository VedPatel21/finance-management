import React, { useEffect, useState } from "react";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the datalabels plugin
import api from "../services/api";
import "../styles/reports.css";

// Register Chart.js components and the datalabels plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels
);

const ReportsPage = () => {
  // State for each report endpoint
  const [monthlyData, setMonthlyData] = useState(null);
  const [classPerformance, setClassPerformance] = useState([]);
  const [paymentModeData, setPaymentModeData] = useState(null);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [yearlyData, setYearlyData] = useState(null);
  // Filter state for monthly overview
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  // Dummy data for fallback
  const dummyMonthlyData = {
    labels: ["2025-01", "2025-02", "2025-03"],
    fees: [50000, 45000, 48000],
    expenses: [30000, 32000, 31000],
    net_income: [20000, 13000, 17000],
  };

  const dummyClassPerformance = [
    { class: "Nursery", total_expected: 100000, total_collected: 70000, pending: 30000 },
    { class: "KG", total_expected: 120000, total_collected: 90000, pending: 30000 },
    { class: "1st", total_expected: 150000, total_collected: 100000, pending: 50000 },
    { class: "2nd", total_expected: 180000, total_collected: 120000, pending: 60000 },
    { class: "3rd", total_expected: 200000, total_collected: 140000, pending: 60000 },
    { class: "4th", total_expected: 220000, total_collected: 160000, pending: 60000 },
    { class: "5th", total_expected: 250000, total_collected: 180000, pending: 70000 },
    { class: "6th", total_expected: 280000, total_collected: 200000, pending: 80000 },
    { class: "7th", total_expected: 300000, total_collected: 220000, pending: 80000 },
    { class: "8th", total_expected: 320000, total_collected: 240000, pending: 80000 }
  ];

  const dummyPaymentModeData = {
    fee_payment_modes: [
      { mode: "Cash", count: 10, total_amount: 40000 },
      { mode: "UPI", count: 15, total_amount: 60000 },
      { mode: "Card", count: 5, total_amount: 20000 },
    ],
    expense_payment_modes: [
      { mode: "Cash", count: 8, total_amount: 30000 },
      { mode: "UPI", count: 4, total_amount: 15000 },
      { mode: "Card", count: 2, total_amount: 5000 },
    ],
  };

  const dummyExpenseCategories = [
    { category: "Staff Salary", total_expense: 50000 },
    { category: "Land Rent", total_expense: 15000 },
    { category: "House Loan", total_expense: 10000 },
    { category: "School Maintenance", total_expense: 8000 },
  ];

  const dummyYearlyData = {
    years: ["2024", "2025"],
    fees: [200000, 240000],
    expenses: [100000, 120000],
    net_income: [100000, 120000],
  };

  // Fetch all report data on mount
  useEffect(() => {
    // Fetch Monthly Financial Overview
    api.get("/reports/monthly-financial")
      .then((res) => setMonthlyData(res.data))
      .catch((err) => {
        console.error("Error fetching monthly financial overview:", err);
        setMonthlyData(dummyMonthlyData);
      });

    // Fetch Class-wise Fee Performance
    api.get("/reports/class-performance")
      .then((res) => setClassPerformance(res.data.class_performance))
      .catch((err) => {
        console.error("Error fetching class performance:", err);
        setClassPerformance(dummyClassPerformance);
      });

    // Fetch Payment Mode Analysis
    api.get("/reports/payment-mode")
      .then((res) => setPaymentModeData(res.data))
      .catch((err) => {
        console.error("Error fetching payment mode data:", err);
        setPaymentModeData(dummyPaymentModeData);
      });

    // Fetch Expense Categorization
    api.get("/reports/expense-categories")
      .then((res) => setExpenseCategories(res.data.expense_categories))
      .catch((err) => {
        console.error("Error fetching expense categories:", err);
        setExpenseCategories(dummyExpenseCategories);
      });

    // Fetch Year-over-Year Comparison
    api.get("/reports/yearly")
      .then((res) => setYearlyData(res.data))
      .catch((err) => {
        console.error("Error fetching yearly data:", err);
        setYearlyData(dummyYearlyData);
      });
  }, []);

  // Helper to filter monthlyData based on filterFrom and filterTo
  const getFilteredMonthlyData = () => {
    if (!monthlyData) return dummyMonthlyData;
    if (!filterFrom && !filterTo) return monthlyData;

    const { labels, fees, expenses, net_income } = monthlyData;
    const filtered = {
      labels: [],
      fees: [],
      expenses: [],
      net_income: []
    };

    labels.forEach((month, index) => {
      if ((filterFrom === "" || month >= filterFrom) && (filterTo === "" || month <= filterTo)) {
        filtered.labels.push(month);
        filtered.fees.push(fees[index]);
        filtered.expenses.push(expenses[index]);
        filtered.net_income.push(net_income[index]);
      }
    });
    return filtered;
  };

  const filteredMonthly = getFilteredMonthlyData();

  return (
    <div className="reports-page">
      <div className="reports-container">
        <h1 className="reports-header">School Financial Reports</h1>

        {/* Overall Financial Health Summary */}
        <section className="report-section summary-section">
          <h2>Overall Financial Health Summary</h2>
          {monthlyData && monthlyData.labels && monthlyData.labels.length > 0 ? (
            <div className="summary-cards">
              <div className="summary-card">
                <h3>Total Fees Collected</h3>
                <p>₹{monthlyData.fees[monthlyData.fees.length - 1].toFixed(2)}</p>
              </div>
              <div className="summary-card">
                <h3>Total Expenses</h3>
                <p>₹{monthlyData.expenses[monthlyData.expenses.length - 1].toFixed(2)}</p>
              </div>
              <div className="summary-card">
                <h3>Net Income</h3>
                <p>₹{monthlyData.net_income[monthlyData.net_income.length - 1].toFixed(2)}</p>
              </div>
            </div>
          ) : (
            <p>No summary data available.</p>
          )}
        </section>

        {/* Monthly Financial Overview */}
        <section className="report-section monthly-overview">
          <h2>Monthly Financial Overview</h2>
          <div className="filter-controls">
            <label>
              From:
              <input
                type="month"
                value={filterFrom}
                onChange={(e) => setFilterFrom(e.target.value)}
              />
            </label>
            <label>
              To:
              <input
                type="month"
                value={filterTo}
                onChange={(e) => setFilterTo(e.target.value)}
              />
            </label>
          </div>
          {filteredMonthly && filteredMonthly.labels && filteredMonthly.labels.length > 0 ? (
            <div className="chart-container">
              <Bar
                data={{
                  labels: filteredMonthly.labels,
                  datasets: [
                    {
                      label: "Fees Collected (₹)",
                      data: filteredMonthly.fees,
                      backgroundColor: "#4CAF50",
                      borderColor: "#388E3C",
                      borderWidth: 1,
                      barThickness: 40,
                    },
                    {
                      label: "Expenses (₹)",
                      data: filteredMonthly.expenses,
                      backgroundColor: "#f44336",
                      borderColor: "#d32f2f",
                      borderWidth: 1,
                      barThickness: 40,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "top" }, tooltip: { mode: "index", intersect: false } },
                  layout: {
                    padding: {
                      left: 20, // Add padding to the left to avoid overlap with the sidebar
                      right: 20,
                      top: 20,
                      bottom: 20
                    }
                  }
                }}
              />
              <div className="chart-subsection">
                <Line
                  data={{
                    labels: filteredMonthly.labels,
                    datasets: [
                      {
                        label: "Net Income (₹)",
                        data: filteredMonthly.net_income,
                        borderColor: "#1976d2",
                        backgroundColor: "rgba(25, 118, 210, 0.3)",
                        fill: true,
                        tension: 0.1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: "top" } },
                    layout: {
                      padding: {
                        left: 20, // Add padding to the left to avoid overlap with the sidebar
                        right: 20,
                        top: 20,
                        bottom: 20
                      }
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <p>No data available for the selected period.</p>
          )}
        </section>

        {/* Class-wise Fee Performance */}
        <section className="report-section class-performance">
          <h2>Class-wise Fee Performance</h2>
          {classPerformance && classPerformance.length > 0 ? (
            <>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Total Expected (₹)</th>
                    <th>Total Collected (₹)</th>
                    <th>Pending (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {classPerformance.map((item, index) => (
                    <tr key={index}>
                      <td>{item.class}</td>
                      <td>{item.total_expected.toFixed(2)}</td>
                      <td>{item.total_collected.toFixed(2)}</td>
                      <td>{item.pending.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="chart-container">
                <Bar
                  data={{
                    labels: classPerformance.map((item) => item.class),
                    datasets: [
                      {
                        label: "Collected (₹)",
                        data: classPerformance.map((item) => item.total_collected),
                        backgroundColor: "#4CAF50",
                      },
                      {
                        label: "Pending (₹)",
                        data: classPerformance.map((item) => item.pending),
                        backgroundColor: "#f44336",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    scales: {
                      x: { stacked: true },
                      y: { stacked: true, beginAtZero: true },
                    },
                    plugins: { legend: { position: "top" } },
                  }}
                />
              </div>
            </>
          ) : (
            <p>No class performance data available.</p>
          )}
        </section>

        {/* Payment Mode Analysis */}
        <section className="report-section payment-mode">
          <h2>Payment Mode Analysis</h2>
          {paymentModeData ? (
            <div className="payment-mode-charts">
              <div className="chart-item">
                <h3>Fee Payment Modes</h3>
                <Doughnut
                  data={{
                    labels: paymentModeData.fee_payment_modes.map((pm) => pm.mode),
                    datasets: [{
                      data: paymentModeData.fee_payment_modes.map((pm) => pm.total_amount),
                      backgroundColor: ["#4CAF50", "#1976d2", "#FF9800"],
                    }]
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "bottom" },
                      datalabels: {
                        color: "#fff",
                        formatter: (value) => `₹${value}`,
                        font: { weight: "bold", size: 14 }
                      }
                    }
                  }}
                />
              </div>
              <div className="chart-item">
                <h3>Expense Payment Modes</h3>
                <Doughnut
                  data={{
                    labels: paymentModeData.expense_payment_modes.map((pm) => pm.mode),
                    datasets: [{
                      data: paymentModeData.expense_payment_modes.map((pm) => pm.total_amount),
                      backgroundColor: ["#f44336", "#d32f2f", "#FF9800"],
                    }]
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "bottom" },
                      datalabels: {
                        color: "#fff",
                        formatter: (value) => `₹${value}`,
                        font: { weight: "bold", size: 14 }
                      }
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <p>No payment mode data available.</p>
          )}
        </section>

        {/* Expense Categorization */}
        <section className="report-section expense-categories">
          <h2>Expense Categorization</h2>
          {expenseCategories && expenseCategories.length > 0 ? (
            <>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Total Expense (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseCategories.map((cat, index) => (
                    <tr key={index}>
                      <td>{cat.category}</td>
                      <td>{cat.total_expense.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="chart-container small-chart">
                <Pie
                  data={{
                    labels: expenseCategories.map((cat) => cat.category),
                    datasets: [{
                      data: expenseCategories.map((cat) => cat.total_expense),
                      backgroundColor: ["#f44336", "#e57373", "#FF9800", "#ffcc80", "#4CAF50", "#81C784"]
                    }]
                  }}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: "bottom" }, datalabels: {
                      color: "#fff",
                      formatter: (value) => `₹${value}`,
                      font: { weight: "bold", size: 14 }
                    } }
                  }}
                />
              </div>
            </>
          ) : (
            <p>No expense categorization data available.</p>
          )}
        </section>

        {/* Year-over-Year Comparison */}
        <section className="report-section yearly-comparison">
          <h2>Year-over-Year Comparison</h2>
          {yearlyData ? (
            <>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Fees Collected (₹)</th>
                    <th>Expenses (₹)</th>
                    <th>Net Income (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {yearlyData.years.map((year, index) => (
                    <tr key={year}>
                      <td>{year}</td>
                      <td>{yearlyData.fees[index].toFixed(2)}</td>
                      <td>{yearlyData.expenses[index].toFixed(2)}</td>
                      <td>{yearlyData.net_income[index].toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="chart-container">
                <Line
                  data={{
                    labels: yearlyData.years,
                    datasets: [
                      {
                        label: "Fees Collected (₹)",
                        data: yearlyData.fees,
                        borderColor: "#4CAF50",
                        backgroundColor: "rgba(76, 175, 80, 0.3)",
                        tension: 0.3,
                      },
                      {
                        label: "Expenses (₹)",
                        data: yearlyData.expenses,
                        borderColor: "#f44336",
                        backgroundColor: "rgba(244, 67, 54, 0.3)",
                        tension: 0.3,
                      },
                      {
                        label: "Net Income (₹)",
                        data: yearlyData.net_income,
                        borderColor: "#1976d2",
                        backgroundColor: "rgba(25, 118, 210, 0.3)",
                        tension: 0.3,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: "top" } },
                  }}
                />
              </div>
            </>
          ) : (
            <p>No yearly comparison data available.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ReportsPage;
