import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'w-full py-3.5 px-6 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-[#6D54FA] hover:bg-[#5b40f5] text-white shadow-md shadow-indigo-500/20 active:scale-[0.99]',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-[0.99]',
    outline:
      'border border-slate-200 hover:bg-slate-50 text-slate-700 active:scale-[0.99]',
    social:
      'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm active:scale-[0.99]'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};
