import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`
        bg-white dark:bg-gray-900 rounded-lg shadow-md 
        hover:shadow-lg transition-shadow duration-200 
        p-4 ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
