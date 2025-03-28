import React from "react";
import BulkUpload from "../components/BulkUpload";
import { useNavigate } from "react-router-dom";
import "../styles/bulkUpload.css";

const BulkUploadPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bulk-upload-container">
      <header className="admin-header">
        <h1 className="logo">School Admin</h1>
        <nav className="nav-links">
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/students/all")}>All Students</button>
        </nav>
      </header>
      <main className="bulk-upload">
        <h2 className="page-title">Bulk Upload Students</h2>
        <BulkUpload />
      </main>
    </div>
  );
};

export default BulkUploadPage;
