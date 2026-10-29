import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  FileText, 
  Copy, 
  Check, 
  RotateCcw,
  RefreshCw,
  Share2
} from 'lucide-react';
import type { AnalysisResult } from '../types/analyzer';

interface ReportExportProps {
  data: AnalysisResult;
  onAnalyzeAnother: () => void;
  onResetAll: () => void;
}

export const ReportExport: React.FC<ReportExportProps> = ({
  data,
  onAnalyzeAnother,
  onResetAll,
}) => {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Resume_Analysis_${data.jobOverview.jobTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    const md = `# AI Resume Analysis Report

**Target Job Title:** ${data.jobOverview.jobTitle}
**Company:** ${data.jobOverview.companyIfMentioned || 'N/A'}
**Seniority Level:** ${data.jobOverview.seniorityLevel || 'N/A'}
**Overall Match Score:** ${data.overallScore}/100
**Date Generated:** ${new Date(data.timestamp).toLocaleString()}

---

## Executive Summary
${data.matchSummary}

---

## Documented Weighted Score Breakdown
- **Skills Alignment (35%):** ${data.scoreBreakdown.skillsAlignment.score}/100 (+${data.scoreBreakdown.skillsAlignment.weightedContribution} pts)
  *Explanation:* ${data.scoreBreakdown.skillsAlignment.explanation}

- **Role & Responsibility Alignment (25%):** ${data.scoreBreakdown.roleResponsibilityAlignment.score}/100 (+${data.scoreBreakdown.roleResponsibilityAlignment.weightedContribution} pts)
  *Explanation:* ${data.scoreBreakdown.roleResponsibilityAlignment.explanation}

- **Experience Alignment (20%):** ${data.scoreBreakdown.experienceAlignment.score}/100 (+${data.scoreBreakdown.experienceAlignment.weightedContribution} pts)
  *Explanation:* ${data.scoreBreakdown.experienceAlignment.explanation}

- **Education & Certifications (10%):** ${data.scoreBreakdown.educationCertifications.score}/100 (+${data.scoreBreakdown.educationCertifications.weightedContribution} pts)
  *Explanation:* ${data.scoreBreakdown.educationCertifications.explanation}

- **Resume Clarity & ATS Readability (10%):** ${data.scoreBreakdown.resumeClarityAts.score}/100 (+${data.scoreBreakdown.resumeClarityAts.weightedContribution} pts)
  *Explanation:* ${data.scoreBreakdown.resumeClarityAts.explanation}

---

## Key Resume Strengths
${data.resumeStrengths.map((s) => `- ${s}`).join('\n')}

---

## Skills Breakdown
### Matched Skills:
${data.skills.filter((s) => s.status === 'matched').map((s) => `- **${s.name}** (${s.importance}, ${s.category}): ${s.explanation} \n  *Evidence:* "${s.resumeEvidence || 'Identified in resume'}"`).join('\n')}

### Missing Skills:
${data.skills.filter((s) => s.status === 'missing').map((s) => `- **${s.name}** (${s.importance}, ${s.category}): ${s.explanation}`).join('\n')}

### Unconfirmed Skills:
${data.skills.filter((s) => s.status === 'unconfirmed').map((s) => `- **${s.name}** (${s.importance}, ${s.category}): ${s.explanation}`).join('\n')}

---

## Prioritized Improvement Suggestions
${data.prioritizedRecommendations.map((r) => `### [${r.priority.toUpperCase()}] ${r.title}\n- **Why:** ${r.reason}\n- **Action:** ${r.actionItem}`).join('\n\n')}

---

## Recommended Bullet Point Rewrites
${data.bulletPointImprovements.map((b) => `### Original Context:\n> ${b.originalOrContext}\n\n**Rewritten Recommendation:**\n> ${b.suggestion}\n\n*Rationale:* ${b.rationale}`).join('\n\n')}

---
*Notice: This match score is an algorithmic estimate of resume relevance against this specific job description, not a hiring guarantee.*
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Resume_Analysis_Report_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySummary = () => {
    const summary = `Resume Analysis for ${data.jobOverview.jobTitle}
Overall Score: ${data.overallScore}/100
Summary: ${data.matchSummary}
Top Strengths: ${data.resumeStrengths.slice(0, 2).join('; ')}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs print:hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Report Export & Next Actions
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Download your comprehensive evaluation, print as PDF, or test against another position
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / PDF Report
          </button>

          <button
            type="button"
            onClick={handleDownloadMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            Markdown (.md)
          </button>

          <button
            type="button"
            onClick={handleDownloadJson}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            JSON Data
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                Copy Summary
              </>
            )}
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

          <button
            type="button"
            onClick={onAnalyzeAnother}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
            Analyze Another Job
          </button>

          <button
            type="button"
            onClick={onResetAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
};
