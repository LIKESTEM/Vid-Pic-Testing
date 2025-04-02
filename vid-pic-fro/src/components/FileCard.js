import React from "react";
import axios from "axios";

function FileCard({ file, onUpdate }) {
  const handleLike = () => {
    axios
      .put(`http://localhost:8080/api/files/${file.id}/like`)
      .then(() => {
        onUpdate(file.id, { likes: file.likes + 1 }); // Update the likes count immediately
      });
  };

  const handleDislike = () => {
    axios
      .put(`http://localhost:8080/api/files/${file.id}/dislike`)
      .then(() => {
        onUpdate(file.id, { dislikes: file.dislikes + 1 }); // Update the dislikes count immediately
      });
  };

  const handleSubscribe = () => {
    axios
      .put(`http://localhost:8080/api/files/${file.id}/subscribe`)
      .then(() => {
        onUpdate(file.id, { subscriptions: file.subscriptions + 1 }); // Update the subscriptions count immediately
      });
  };

  return (
    <div className="col-md-6 col-lg-4">
      <div className="card h-100 shadow-sm">
        <div className="position-relative">
          <img
            className="img-fluid rounded w-100 h-100 object-fit-cover"
            src={`http://localhost:8080${file.imageUrl}`}
            alt={file.title}
            style={{ maxHeight: "200px" }}
          />
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark text-white"
            style={{ opacity: 0.7 }}
          >
            <h5 className="text-center px-3">{file.title}</h5>
          </div>
        </div>
        <div className="card-body d-flex flex-column">
          <div className="ratio ratio-16x9 mt-3">
            <video className="w-100" controls>
              <source
                src={`http://localhost:8080${file.videoUrl}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="mt-3 d-flex justify-content-center gap-3">
            <button
              className="btn btn-outline-success d-flex align-items-center"
              onClick={handleLike}
            >
              <i className="fas fa-thumbs-up me-2"></i> {file.likes}
            </button>
            <button
              className="btn btn-outline-danger d-flex align-items-center"
              onClick={handleDislike}
            >
              <i className="fas fa-thumbs-down me-2"></i> {file.dislikes}
            </button>
            <button
              className="btn btn-outline-primary d-flex align-items-center"
              onClick={handleSubscribe}
            >
              <i className="fas fa-bell me-2"></i> {file.subscriptions}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileCard;
