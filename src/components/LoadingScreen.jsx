import React from 'react';

export default function LoadingScreen({ loading }) {
  return (
    <div className={`loading-screen ${!loading ? 'fade-out' : ''}`}>
      <div className="loading-blob-container">
        <img src="/loading-blob.png" alt="Cell Spell Logo" className="loading-blob-image" />
        <span className="sparkle" />
        <span className="sparkle" />
        <span className="sparkle" />
        <span className="sparkle" />
        <span className="sparkle" />
        <span className="sparkle" />
      </div>
      <p className="loading-text">
        Preparing <span>Cell Spell 2.0</span>...
      </p>
    </div>
  );
}
