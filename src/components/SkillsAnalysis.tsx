import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Search, 
  Filter, 
  Tag, 
  Quote, 
  Info,
  Check,
  AlertCircle
} from 'lucide-react';
import type { SkillItem, SkillStatus } from '../types/analyzer';

interface SkillsAnalysisProps {
  skills: SkillItem[];
}

export const SkillsAnalysis: React.FC<SkillsAnalysisProps> = ({ skills }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | SkillStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const stats = useMemo(() => {
    const matched = skills.filter((s) => s.status === 'matched').length;
    const missing = skills.filter((s) => s.status === 'missing').length;
    const unconfirmed = skills.filter((s) => s.status === 'unconfirmed').length;
    return { matched, missing, unconfirmed, total: skills.length };
  }, [skills]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    skills.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set);
  }, [skills]);

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesStatus = activeFilter === 'all' || skill.status === activeFilter;
      const matchesSearch =
        searchTerm.trim() === '' ||
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (skill.resumeEvidence && skill.resumeEvidence.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory =
        selectedCategory === 'all' || skill.category === selectedCategory;

      return matchesStatus && matchesSearch && matchesCategory;
    });
  }, [skills, activeFilter, searchTerm, selectedCategory]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Skills & Competency Analysis
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Strict verification of required and preferred skills with direct resume quotes
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('matched')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeFilter === 'matched'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Matched ({stats.matched})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('missing')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeFilter === 'missing'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            Missing ({stats.missing})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('unconfirmed')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeFilter === 'unconfirmed'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Unconfirmed ({stats.unconfirmed})
          </button>
        </div>
      </div>

      {/* Search and Category Bar */}
      <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search skill by name, description, or evidence..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {categories.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter skills by category"
              className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Skills Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredSkills.length === 0 ? (
          <div className="col-span-full py-8 text-center text-xs text-slate-500 dark:text-slate-400">
            No skills match the current filter or search criteria.
          </div>
        ) : (
          filteredSkills.map((skill, index) => {
            const isMatched = skill.status === 'matched';
            const isMissing = skill.status === 'missing';
            const isUnconfirmed = skill.status === 'unconfirmed';

            return (
              <div
                key={`${skill.name}-${index}`}
                className={`p-3.5 rounded-xl border transition-all ${
                  isMatched
                    ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : isMissing
                    ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
                    : 'border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                    {isMissing && <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />}
                    {isUnconfirmed && <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />}
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {skill.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {skill.importance === 'required' ? (
                      <span className="px-1.5 py-0.5 rounded text-2xs font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                        Required
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-2xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        Preferred
                      </span>
                    )}

                    <span className="px-1.5 py-0.5 rounded text-2xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 capitalize">
                      {skill.category}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                  {skill.explanation}
                </p>

                {/* Evidence Quote if matched */}
                {skill.resumeEvidence && (
                  <div className="mt-2.5 p-2 rounded-lg bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40 text-2xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                    <Quote className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="italic leading-normal select-text">
                      &ldquo;{skill.resumeEvidence}&rdquo;
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
