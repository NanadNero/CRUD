import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
  show: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = "Memproses data...", 
  show 
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="mb-4 bg-blue-100 border border-blue-300 text-blue-700 px-4 py-3 rounded">
      {message}
    </div>
  );
};

export default LoadingIndicator;