import React from 'react';

interface LoadingIndicatorProps {
  show: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  overlay?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  show,
  message = 'Loading...',
  size = 'md',
  overlay = false
}) => {
  if (!show) return null;

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const spinnerSize = sizeClasses[size];

  const content = (
    <div className="flex items-center justify-center space-x-2">
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${spinnerSize}`}></div>
      {message && <span className="text-gray-600 text-sm">{message}</span>}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      {content}
    </div>
  );
};

export default LoadingIndicator;