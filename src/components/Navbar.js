import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="navbar-title">School Management System</h2>
      <div className="navbar-links">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/students" className="nav-link">Manage Students</Link>
        <Link to="/expenses/add" className="nav-link">Expense</Link>
        <Link to="/students/all" className="nav-link">All Students</Link>
        <Link to="/students/reports" className="nav-link">Reports</Link>
      </div>
    </nav>
  );
};

export default Navbar;
