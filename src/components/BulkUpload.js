import React, { useState } from "react";
import api from "../services/api";

const BulkUpload = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setUploadResult(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/bulk-upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadResult(response.data);
      onUploadComplete();
    } catch (err) {
      setError("Bulk upload failed. Please check the file and try again.");
    }
  };

  return (
    <div>
      <h3>Bulk Upload Students (.xlsx only)</h3>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".xlsx" onChange={handleFileChange} required />
        <button type="submit">Upload</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {uploadResult && (
        <div>
          <p>{uploadResult.message}</p>
          {uploadResult.errors && uploadResult.errors.length > 0 && (
            <p>Errors: {uploadResult.errors.join(", ")}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkUpload;
