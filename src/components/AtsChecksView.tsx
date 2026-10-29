import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, Shield, FileText } from 'lucide-react';
import type { AtsCheckItem } from '../types/analyzer';

interface AtsChecksViewProps {
  checks: AtsCheckItem[];
}

export const AtsChecksView: React.FC<AtsChecksViewProps> = ({ checks }) => {
  const passCount = checks.filter((c) => c.status === 'pass').length;
  const warningCount = checks.filter((c) => c.status === 'warning').length;
  const checkCount = checks.filter((c) => c.status === 'check').length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Basic ATS Readability Diagnostics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Checks for automated screening parser friendliness, format safety, and standard header detection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-medium">
            {passCount} Passed
          </span>
          {warningCount > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800 font-medium">
              {warningCount} Warnings
            </span>
          )}
          {checkCount > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-medium">
              {checkCount} Info
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {checks.map((check, idx) => {
          const isPass = check.status === 'pass';
          const isWarning = check.status === 'warning';

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                isPass
                  ? 'border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10'
                  : isWarning
                  ? 'border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isPass && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                {isWarning && <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                {!isPass && !isWarning && <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {check.item}
                  </h4>
                  <span
                    className={`text-2xs font-semibold px-1.5 py-0.2 rounded uppercase tracking-wider ${
                      isPass
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : isWarning
                        ? 'text-amber-700 dark:text-amber-400'
                        : 'text-blue-700 dark:text-blue-400'
                    }`}
                  >
                    {check.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {check.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
