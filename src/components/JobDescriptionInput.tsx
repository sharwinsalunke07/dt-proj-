import React from 'react';
import { Briefcase, Eraser, FileText } from 'lucide-react';

interface JobDescriptionInputProps {
  jobDescription: string;
  onChange: (value: string) => void;
  onClear: () => void;
  error?: string | null;
  disabled?: boolean;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  jobDescription,
  onChange,
  onClear,
  error,
  disabled = false,
}) => {
  const charCount = jobDescription.length;
  const wordCount = jobDescription ? jobDescription.split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
      {/* Card Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-semibold text-sm">
            2
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Target Job Description
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste or type requirements, responsibilities & qualifications
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {jobDescription && (
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {wordCount} words • {charCount} chars
            </span>
          )}
          {jobDescription && !disabled && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Clear job description"
            >
              <Eraser className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {/* Controlled textarea as required by Section 5 */}
        <div className="relative flex-1 flex flex-col">
          <textarea
            id="jobDescription"
            name="jobDescription"
            value={jobDescription}
            onChange={(event) => onChange(event.target.value)}
            disabled={disabled}
            placeholder="Paste or type the complete job description here (e.g., responsibilities, requirements, preferred qualifications, tech stack)..."
            rows={10}
            className={`w-full flex-1 p-3.5 rounded-xl border text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-white dark:bg-slate-950 font-sans focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors resize-y min-h-[220px] leading-relaxed ${
              error
                ? 'border-rose-400 dark:border-rose-800 bg-rose-50/20 dark:bg-rose-950/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          />
        </div>

        {error && (
          <p className="mt-2 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
            <span>•</span> {error}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between text-2xs text-slate-400 dark:text-slate-500">
          <span>Accepts Ctrl+V, right-click paste & manual typing. Line breaks preserved.</span>
          <span>Target: 50+ words recommended</span>
        </div>
      </div>
    </div>
  );
};
