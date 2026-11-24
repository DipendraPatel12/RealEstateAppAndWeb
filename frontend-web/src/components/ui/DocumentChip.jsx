import React from 'react';
import { X, FileText } from 'lucide-react';

export const DocumentChip = ({
  fileName,
  fileSizeMb = 4.54,
  status,
  rejectionReason,
  onDelete
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="w-full border border-slate-200 rounded-xl p-3.5 flex items-center justify-between bg-white shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-[#6D54FA]">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-[280px]">
              {fileName}
            </span>
            <span className="text-[11px] text-slate-400">
              Size: {fileSizeMb} mb
            </span>
          </div>
        </div>

        {/* Right side: Either Status Pill or Delete X */}
        {status ? (
          <div className="flex items-center gap-1.5 pr-1">
            {status === 'APPROVED' && (
              <>
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-emerald-600">Approved</span>
              </>
            )}
            {status === 'PENDING' && (
              <>
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-xs font-medium text-amber-500">Pending</span>
              </>
            )}
            {status === 'REJECTED' && (
              <>
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs font-medium text-red-500">Reject</span>
              </>
            )}
          </div>
        ) : (
          onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="w-7 h-7 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )
        )}
      </div>

      {rejectionReason && (
        <span className="text-xs text-red-500 pl-1">
          Reject reason: {rejectionReason}
        </span>
      )}
    </div>
  );
};
