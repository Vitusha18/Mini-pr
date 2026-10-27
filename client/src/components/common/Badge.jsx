import React from 'react';

export const Badge = ({
  children,
  variant = 'success',
  size = 'md',
  className = '',
  icon: Icon,
  dot = false,
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-xs gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm gap-2',
  };

  const variantStyles = {
    success: 'bg-brand-lightgreen text-brand-darkgreen border border-green-200/60',
    warning: 'bg-amber-100 text-amber-800 border border-amber-200',
    danger: 'bg-red-100 text-red-700 border border-red-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    primary: 'bg-brand-palegreen text-brand-green border border-brand-green/20',
  };

  const dotColor = {
    success: 'bg-brand-green',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    neutral: 'bg-slate-400',
    primary: 'bg-brand-green',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.success} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor[variant] || dotColor.success}`} />}
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
