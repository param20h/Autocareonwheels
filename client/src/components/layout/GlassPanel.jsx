import React from 'react';

const GlassPanel = ({ className = '', children }) => {
  return (
    <div className={`bg-white/70 backdrop-blur-md border border-white rounded-card shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export default GlassPanel;
