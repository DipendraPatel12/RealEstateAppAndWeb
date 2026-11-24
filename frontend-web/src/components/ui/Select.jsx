'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = ({
  label,
  placeholder = 'Select',
  options = [],
  value,
  onChange,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full flex flex-col gap-1.5" ref={containerRef}>
      {label && <label className="text-xs font-medium text-slate-700">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-[52px] rounded-xl border bg-white px-4 text-sm text-left flex items-center justify-between transition-all ${
            isOpen
              ? 'border-[#6D54FA] ring-2 ring-[#6D54FA]/20'
              : error
              ? 'border-red-400'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className={selectedOption ? 'text-slate-900' : 'text-slate-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#6D54FA]' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 py-1 overflow-hidden animate-in fade-in-50 zoom-in-95">
            {options.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${
                  value === option.value
                    ? 'bg-slate-100/80 font-medium text-slate-900'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <span className="text-xs text-red-500 pl-0.5">{error}</span>}
    </div>
  );
};
