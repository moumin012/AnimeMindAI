import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  glass = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl border border-slate-200/80 dark:border-slate-800/80 
        ${glass ? 'glass-panel' : 'bg-white dark:bg-slate-900'} 
        ${hover ? 'hover:border-brand-500/50 hover:shadow-lg dark:hover:shadow-slate-950/50 transition-all duration-200 cursor-pointer' : 'shadow-sm'} 
        p-5 md:p-6
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
