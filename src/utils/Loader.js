import React from 'react';
import './loader.css'; // We'll put CSS here

const Loader = () => (
  <div className="spinner" role="status" aria-label="Loading">
    <div className="spinnerin"></div>
  </div>
);

export default Loader;