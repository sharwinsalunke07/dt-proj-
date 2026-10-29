import React from 'react';
import { Award, Briefcase, Sparkles, Building, Layers } from 'lucide-react';
import type { AnalysisResult } from '../types/analyzer';

interface MatchScoreProps {
  data: AnalysisResult;
}

export const MatchScore: React.FC<MatchScoreProps> = ({ data }) => {
  const { overallScore, matchSummary, jobOverview } = data;

  const getScoreColor = (score: number) => {
    if (score >= 85) {
      return {
        text: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        border: 'border-emerald-200 dark:border-emerald-800',
        stroke: '#10b981',
        label: 'Strong Match',
        description: 'High alignment with job requirements and core responsibilities.',
      };
    }
    if (score >= 70) {
      return {
        text: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-950/40',
        border: 'border-blue-200 dark:border-blue-800',
        stroke: '#3b82f6',
        label: 'Good Match',
        description: 'Solid profile foundation with a few addressable skill or experience gaps.',
      };
    }
    if (score >= 50) {
      return {
        text: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        border: 'border-amber-200 dark:border-amber-800',
        stroke: '#f59e0b',
        label: 'Moderate Match',
        description: 'Partial alignment; several key requirements or experiences require enhancement.',
      };
    }
    return {
      text: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-200 dark:border-rose-800',
      stroke: '#f43f5e',
      label: 'Low Match',
      description: 'Significant gaps between stated resume experience and position requirements.',
    };
  };

  const scoreMeta = getScoreColor(overallScore);

  // SVG Circular Gauge calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Circular Score Gauge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-200 dark:text-slate-700/60"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={scoreMeta.stroke}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-4xl font-extrabold tracking-tight ${scoreMeta.text}`}>
                {overallScore}
              </span>
              <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Score / 100
              </span>
            </div>
          </div>

          <div className="mt-3 text-center">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${scoreMeta.bg} ${scoreMeta.text} ${scoreMeta.border} border`}
            >
              <Award className="w-3.5 h-3.5" />
              {scoreMeta.label}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[220px]">
              {scoreMeta.description}
            </p>
          </div>
        </div>

        {/* Right: Job Context & Summary */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60">
                <Briefcase className="w-3.5 h-3.5" />
                {jobOverview.jobTitle || 'Target Position'}
              </span>
              {jobOverview.seniorityLevel && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <Layers className="w-3.5 h-3.5" />
                  {jobOverview.seniorityLevel}
                </span>
              )}
              {jobOverview.companyIfMentioned && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <Building className="w-3.5 h-3.5" />
                  {jobOverview.companyIfMentioned}
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              Analysis Summary & Strategic Assessment
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {matchSummary}
            </p>
          </div>

          {jobOverview.keyFocus && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Key Evaluation Focus
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {jobOverview.keyFocus}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
