'use client';

import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';

export const FileUploadDropzone = ({
  onFileSelect,
  accept = '.pdf,.png,.jpg,.jpeg',
  maxSizeMb = 10
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > maxSizeMb * 1024 * 1024) {
        alert(`File size exceeds ${maxSizeMb} MB limit.`);
        return;
      }
      onFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > maxSizeMb * 1024 * 1024) {
        alert(`File size exceeds ${maxSizeMb} MB limit.`);
        return;
      }
      onFileSelect(file);
    }
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="w-full border-2 border-dashed border-slate-200 hover:border-[#6D54FA] bg-[#FDFEFC] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-indigo-50 flex items-center justify-center text-slate-400 group-hover:text-[#6D54FA] transition-colors mb-2">
        <UploadCloud className="w-5 h-5" />
      </div>
      <p className="text-xs font-medium text-slate-700">
        Drag & drop OR <span className="text-[#6D54FA] underline">click to browse</span>
      </p>
      <p className="text-[11px] text-slate-400 mt-1">
        Supported formats: PDF, JPG, PNG &bull; Max size: {maxSizeMb} MB
      </p>
    </div>
  );
};
