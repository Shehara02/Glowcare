import React from 'react';

const Spinner = ({ size = 'md', color = 'primary' }) => {
  const sizes = { sm: 'w-5 h-5 border-2', md: 'w-8 h-8 border-3', lg: 'w-12 h-12 border-4' };
  const colors = {
    primary: 'border-primary-200 border-t-primary-500',
    white:   'border-white/30 border-t-white',
    gray:    'border-gray-200 border-t-gray-500',
  };
  return (
    <div className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`} />
  );
};

export default Spinner;
