'use client';

import React from 'react';

export const RoleTabs = ({ selectedRole, onSelectRole }) => {
  const tabs = [
    { id: 'BUYER', label: 'Buyer' },
    { id: 'AGENT', label: 'Agent' },
    { id: 'DEVELOPER', label: 'Developers' }
  ];

  return (
    <div className="w-full flex items-center justify-between border-b border-slate-100 mb-6">
      {tabs.map((tab) => {
        const isActive = selectedRole === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectRole(tab.id)}
            className={`flex-1 py-3 text-xs sm:text-sm font-medium transition-all relative text-center cursor-pointer ${
              isActive
                ? 'text-[#6D54FA] font-semibold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6D54FA] rounded-full shadow-xs shadow-[#6D54FA]" />
            )}
          </button>
        );
      })}
    </div>
  );
};
