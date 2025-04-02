import React, { useState, useEffect } from "react";
import { getFiles } from "../services/filesService";
import FileCard from "./FileCard";

function FetchFiles() {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch files when the component mounts
  useEffect(() => {
    const fetchData = () => {
      getFiles()
        .then((result) => {
          setFiles(result.data);
        })
        .catch((err) => {
          console.error("Error fetching files:", err);
        });
    };

    // Fetch initial data
    fetchData();

    // Set up polling to refresh data every 10 seconds
    const intervalId = setInterval(fetchData, 10000); // Every 10 seconds

    // Clean up interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Update the file state when like, dislike, or subscribe is clicked
  const updateFile = (id, updates) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.map((file) =>
        file.id === id ? { ...file, ...updates } : file
      );
      return updatedFiles;
    });
  };

  // Filter the files based on search query
  useEffect(() => {
    const filtered = files.filter((file) =>
      file.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFiles(filtered);
  }, [files, searchQuery]); // Depend on both files and searchQuery

  // Search functionality for filtering files dynamically
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // The search input will trigger re-filtering
  };

  return (
    <div className="container mt-5 pt-3">
      <h2 className="text-center text-primary mb-4">Uploaded Files</h2>

      {/* Search Section */}
      <div className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search files by title..."
            value={searchQuery}
            onChange={handleSearchChange}  // Dynamically updates search
          />
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="alert alert-warning text-center">
          No files found.
        </div>
      ) : (
        <div className="row g-3">
          {filteredFiles.map((file) => (
            <FileCard key={file.id} file={file} onUpdate={updateFile} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FetchFiles;
