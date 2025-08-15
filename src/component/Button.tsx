import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'success' | 'danger';
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  size = 'md',
  className = '' 
}) => {
const baseClasses = 'font-medium rounded-md transition-colors shadow-sm';
  
const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-black',
    success: 'bg-green-500 hover:bg-green-600 text-black',
    danger: 'bg-red-500 hover:bg-red-600 text-black'
};
  
const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-md',
    lg: 'px-6 py-3 text-lg'
};
  
const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;  
  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {disabled ? 'Loading...' : children}
    </button>
  );
};

export default Button;