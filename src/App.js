import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ManageStudents from "./pages/ManageStudents";
import AddExpense from "./pages/AddExpense";
import Navbar from "./components/Navbar";
import ViewExpenses from "./pages/ViewExpenses";
import AllStudents from "./pages/AllStudents";
import BulkUpload from "./components/BulkUpload";
import ReportsPage from "./pages/Reports";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<ManageStudents />} />
          <Route path="/expenses/add" element={<AddExpense />} />
          <Route path="/expenses/view" element={<ViewExpenses />} />
          <Route path="/students/all" element={<AllStudents />} />
          <Route path="/students/bulk-upload" element={<BulkUpload />} />
          <Route path="/students/reports" element={<ReportsPage />} />
          {/* Redirect to home if route not found */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
