import React, { useState } from "react";
import { createFiles } from "../services/filesService";
import { useNavigate } from "react-router-dom";
// import UnauthErrorPage from "../errors/unauth-access";

function UploadFiles() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);
    formData.append("video", video);

    // try {
    //   const response = await axios.post(
    //     "http://localhost:8080/api/files/upload",
    //     formData,
    //     {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     }
    //   );
    //   alert(response.data);
    // } catch (error) {
    //   console.error("Error uploading file:", error);
    //   alert("Failed to upload file");
    // }

    createFiles(formData)
      .then((result) => {
        alert(result.data)
      })
      .catch(err => {
        alert("Failed to upload file");
        navigate("/unauth-redirect-url", {state: {error: err.message}});
        // <UnauthErrorPage msg={err} />
      });

  };

  return (
    <div className="container mt-5 pt-3">
      <h2 className="text-center mb-4">File Upload</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title:
          </label>
          <input
            type="text"
            id="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Image:
          </label>
          <input
            type="file"
            id="image"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="video" className="form-label">
            Video:
          </label>
          <input
            type="file"
            id="video"
            className="form-control"
            accept="video/*"
            onChange={handleVideoChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Upload
        </button>
      </form>
    </div>
  );
}

export default UploadFiles;
