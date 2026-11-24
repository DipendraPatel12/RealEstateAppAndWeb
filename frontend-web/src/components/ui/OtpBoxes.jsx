'use client';

import React, { useRef, useEffect } from 'react';

export const OtpBoxes = ({
  value = '',
  onChange,
  length = 6,
  error
}) => {
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (!val) return;

    const newArr = value.split('');
    newArr[index] = val.slice(-1);
    const nextVal = newArr.join('');
    onChange(nextVal);

    if (index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newArr = value.split('');
      if (newArr[index]) {
        newArr[index] = '';
        onChange(newArr.join(''));
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        newArr[index - 1] = '';
        onChange(newArr.join(''));
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length);
    if (pasted) {
      onChange(pasted);
      const nextFocus = Math.min(pasted.length, length - 1);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2.5 sm:gap-3 justify-center w-full">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className={`w-12 h-13 sm:w-14 sm:h-14 text-center text-xl font-semibold rounded-xl border bg-white text-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-[#6D54FA]/20 focus:border-[#6D54FA] ${
              error ? 'border-red-400' : 'border-slate-200'
            }`}
          />
        ))}
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};
