import React from 'react';

export default function LoadingScreen({ loading }) {
  return (
    <div className={`loading-screen ${!loading ? 'fade-out' : ''}`}>
      <div className="loading-blob-container">
        <div className="loading-blob" />
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
