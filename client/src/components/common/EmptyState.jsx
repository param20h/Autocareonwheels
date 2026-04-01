import React from 'react';

const EmptyState = ({ title = 'Nothing here yet', description, action }) => {
  return (
    <div className="rounded-card border border-gray-200 bg-white p-8 text-center">
      <h3 className="text-xl font-bold text-primary">{title}</h3>
      {description ? <p className="mt-2 text-gray-500">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
};

export default EmptyState;
