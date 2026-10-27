import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  padding = 'md',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverStyles = hoverEffect
    ? 'transition-all duration-200 hover:shadow-card hover:-translate-y-0.5'
    : '';

  return (
    <div
      className={`bg-white rounded-xl border border-brand-border/70 shadow-soft ${paddingStyles[padding] || paddingStyles.md} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
