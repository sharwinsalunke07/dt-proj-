import React, { useState } from 'react';
import { 
  Lightbulb, 
  ArrowRight, 
  Copy, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';
import type { ImprovementRecommendation, BulletPointImprovement } from '../types/analyzer';

interface ImprovementSuggestionsProps {
  strengths: string[];
  recommendations: ImprovementRecommendation[];
  bulletImprovements: BulletPointImprovement[];
}

export const ImprovementSuggestions: React.FC<ImprovementSuggestionsProps> = ({
  strengths,
  recommendations,
  bulletImprovements,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/40',
          text: 'text-rose-700 dark:text-rose-300',
          border: 'border-rose-200 dark:border-rose-800',
          label: 'High Priority',
        };
      case 'medium':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40',
          text: 'text-amber-700 dark:text-amber-300',
          border: 'border-amber-200 dark:border-amber-800',
          label: 'Medium Priority',
        };
      case 'low':
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/40',
          text: 'text-blue-700 dark:text-blue-300',
          border: 'border-blue-200 dark:border-blue-800',
          label: 'Low Priority',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Resume Strengths Card */}
      {strengths && strengths.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Key Resume Strengths
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Identified competitive advantages in your profile matching this role
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {strengths.map((str, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{str}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Prioritized Improvement Recommendations */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Prioritized Action Items for Higher Relevance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Concrete steps to close detected gaps without falsely claiming qualifications
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {recommendations.map((rec, idx) => {
            const badge = getPriorityBadge(rec.priority);
            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {rec.title}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded-md text-2xs font-semibold ${badge.bg} ${badge.text} ${badge.border} border`}
                  >
                    {badge.label}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2.5">
                  <strong className="text-slate-700 dark:text-slate-200">Why it matters:</strong> {rec.reason}
                </p>

                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-indigo-950 dark:text-indigo-200 flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold text-indigo-700 dark:text-indigo-400">Action:</strong>{' '}
                    <span>{rec.actionItem}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Actionable Bullet Point Improvements (Before vs. After) */}
      {bulletImprovements && bulletImprovements.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Actionable Resume Bullet Rewrites
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                High-impact STAR format suggestions tailored to ATS keywords and recruiter scanning
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {bulletImprovements.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xs space-y-3"
              >
                {/* Context or original */}
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Original / Current Context
                  </span>
                  <div className="mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-mono">
                    {item.originalOrContext}
                  </div>
                </div>

                {/* Suggested replacement */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Recommended High-Impact Rewrite
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.suggestion, idx)}
                      className="inline-flex items-center gap-1 text-2xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy Rewrite
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-950 dark:text-emerald-100 font-medium leading-relaxed">
                    {item.suggestion}
                  </div>
                </div>

                {/* Rationale */}
                <p className="text-2xs text-slate-500 dark:text-slate-400 italic">
                  <strong>Why this works:</strong> {item.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
