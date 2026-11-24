'use client';

import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = forwardRef(
  ({ label, error, leftIcon, type = 'text', className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === 'password';
    const computedType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-slate-700">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={computedType}
            className={`w-full h-[48px] rounded-xl border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-[#6D54FA]/20 focus:border-[#6D54FA] ${
              leftIcon ? 'pl-10' : ''
            } ${isPasswordType ? 'pr-10' : ''} ${
              error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-200'
            } ${className}`}
            {...props}
          />
          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
        {error && <span className="text-xs text-red-500 pl-0.5">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
