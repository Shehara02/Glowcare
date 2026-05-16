import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-primary hover:bg-pink-400 text-white',
    secondary: 'bg-secondary hover:bg-yellow-200 text-dark',
    accent: 'bg-accent hover:bg-green-100 text-dark',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg'
  };

  const buttonClass = `${baseStyles} ${variants[variant]} ${sizes[size]} ${
    disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''
  } ${className}`;

  return (
    <button
      className={buttonClass}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="animate-spin">⟳</span>
      )}
      {children}
    </button>
  );
};

export default Button;
