import React, { useState } from 'react';
import { 
  Calculator, 
  HelpCircle, 
  Zap, 
  CheckCircle2, 
  TrendingUp, 
  GraduationCap, 
  FileCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { ScoreBreakdown as IScoreBreakdown } from '../types/analyzer';

interface ScoreBreakdownProps {
  breakdown: IScoreBreakdown;
  overallScore: number;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ breakdown, overallScore }) => {
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  const categories = [
    {
      key: 'skillsAlignment',
      title: 'Skills Alignment',
      weight: 35,
      icon: Zap,
      data: breakdown.skillsAlignment,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
      description: 'Presence of required & preferred technical stack, methodologies, and tools.',
    },
    {
      key: 'roleResponsibilityAlignment',
      title: 'Role & Responsibility',
      weight: 25,
      icon: TrendingUp,
      data: breakdown.roleResponsibilityAlignment,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
      description: 'Alignment of past scope, duties, and deliverables with target responsibilities.',
    },
    {
      key: 'experienceAlignment',
      title: 'Experience Alignment',
      weight: 20,
      icon: CheckCircle2,
      data: breakdown.experienceAlignment,
      color: 'bg-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400',
      badgeBg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
      description: 'Years of professional practice, seniority level, and industry domain context.',
    },
    {
      key: 'educationCertifications',
      title: 'Education & Certifications',
      weight: 10,
      icon: GraduationCap,
      data: breakdown.educationCertifications,
      color: 'bg-amber-500',
      textColor: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
      description: 'Formal degrees, specialized training, and required industry certifications.',
    },
    {
      key: 'resumeClarityAts',
      title: 'Clarity & ATS Readability',
      weight: 10,
      icon: FileCheck,
      data: breakdown.resumeClarityAts,
      color: 'bg-purple-500',
      textColor: 'text-purple-600 dark:text-purple-400',
      badgeBg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
      description: 'Quantified metrics, action verb density, clean section parsing & contact info.',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Documented Score Breakdown & Methodology
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Transparent 100-point weighted model assessing relevance against job requirements
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowFormulaDetails(!showFormulaDetails)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 px-3 py-1.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 self-start sm:self-auto transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          {showFormulaDetails ? 'Hide Calculation' : 'View Formula'}
          {showFormulaDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Formula Explanation */}
      {showFormulaDetails && (
        <div className="my-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs">
          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
            Standard Scoring Formula:
          </p>
          <div className="font-mono bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 overflow-x-auto text-2xs sm:text-xs">
            Overall Score = (Skills × 0.35) + (Role × 0.25) + (Experience × 0.20) + (Education × 0.10) + (ATS × 0.10)
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-2xs leading-relaxed">
            Each category is evaluated from 0 to 100 based on concrete text evidence. The weighted contribution shows the exact points contributed toward the overall {overallScore}/100 total.
          </p>
        </div>
      )}

      {/* Category Progress Bars & Explanations */}
      <div className="mt-5 space-y-4">
        {categories.map((cat) => {
          const catScore = cat.data?.score ?? 0;
          const weightedContribution = cat.data?.weightedContribution ?? Number(((catScore * cat.weight) / 100).toFixed(1));
          const Icon = cat.icon;

          return (
            <div
              key={cat.key}
              className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-800/20 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${cat.badgeBg} ${cat.textColor} border`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {cat.title}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">
                      (Weight: {cat.weight}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Category: <strong className="text-slate-700 dark:text-slate-300">{catScore}/100</strong>
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${cat.badgeBg} ${cat.textColor} border`}>
                    +{weightedContribution} pts
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700/60 overflow-hidden mb-2">
                <div
                  className={`h-full ${cat.color} rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${Math.min(100, Math.max(0, catScore))}%` }}
                />
              </div>

              {/* Category Assessment Explanation */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {cat.data?.explanation || cat.description}
              </p>

              {cat.data?.details && cat.data.details.length > 0 && (
                <ul className="mt-2 pl-4 list-disc text-2xs text-slate-500 dark:text-slate-400 space-y-0.5">
                  {cat.data.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
