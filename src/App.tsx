/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  FileSearch, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  Play, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  Check, 
  FileCheck2,
  Lock,
  Info,
  Layers,
  FileCode,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { AuthPage } from './components/AuthPage';
import { ResumeUpload } from './components/ResumeUpload';
import { JobDescriptionInput } from './components/JobDescriptionInput';
import { MatchScore } from './components/MatchScore';
import { ScoreBreakdown } from './components/ScoreBreakdown';
import { SkillsAnalysis } from './components/SkillsAnalysis';
import { ImprovementSuggestions } from './components/ImprovementSuggestions';
import { AtsChecksView } from './components/AtsChecksView';
import { ReportExport } from './components/ReportExport';
import { SAMPLE_PAIRS } from './data/samples';
import type { AnalysisResult, AnalyzeResponse } from './types/analyzer';
import type { User } from './types/auth';

export default function App() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Resume & Job Description state
  const [resumeText, setResumeText] = useState<string>('');
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  
  // Analysis execution state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  // On mount, verify stored authentication session
  useEffect(() => {
    const verifySavedSession = async () => {
      const storedToken = localStorage.getItem('resume_analyzer_token');
      if (!storedToken) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setCurrentUser(data.user);
            setAuthToken(storedToken);
          } else {
            localStorage.removeItem('resume_analyzer_token');
          }
        } else {
          localStorage.removeItem('resume_analyzer_token');
        }
      } catch (err) {
        console.error('Session verification error:', err);
        localStorage.removeItem('resume_analyzer_token');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    verifySavedSession();
  }, []);

  const handleAuthSuccess = (user: User, token: string) => {
    setCurrentUser(user);
    setAuthToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('resume_analyzer_token');
    setCurrentUser(null);
    setAuthToken(null);
    setAnalysisResult(null);
    setValidationError(null);
    setApiError(null);
  };

  const handleTextExtracted = (text: string, fileName: string) => {
    setResumeText(text);
    setResumeFileName(fileName);
    setValidationError(null);
  };

  const handleClearResume = () => {
    setResumeText('');
    setResumeFileName('');
  };

  const handleClearJobDescription = () => {
    setJobDescription('');
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_PAIRS.find((s) => s.id === sampleId);
    if (!sample) return;

    setResumeText(sample.resumeText);
    setResumeFileName(sample.resumeFileName);
    setJobDescription(sample.jobDescription);
    setValidationError(null);
    setApiError(null);
  };

  const handleAnalyze = async () => {
    setValidationError(null);
    setApiError(null);

    // Validate inputs
    if (!resumeText || resumeText.trim().length < 30) {
      setValidationError('Please upload a resume (PDF/DOCX) or provide valid resume text before analyzing.');
      return;
    }

    if (!jobDescription || jobDescription.trim().length < 20) {
      setValidationError('Please paste or type a complete job description into the textarea before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep('Reading resume & extracting core competencies...');

    const stepTimer1 = setTimeout(() => {
      setAnalysisStep('Evaluating skill evidence against job requirements...');
    }, 1500);

    const stepTimer2 = setTimeout(() => {
      setAnalysisStep('Calculating weighted category scores & ATS diagnostics...');
    }, 3500);

    const stepTimer3 = setTimeout(() => {
      setAnalysisStep('Generating evidence-based bullet rewrites & recommendations...');
    }, 5500);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          resumeFileName: resumeFileName || 'Candidate_Resume',
        }),
      });

      const result: AnalyzeResponse = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.error || 'Failed to analyze resume. Please try again.');
      }

      setAnalysisResult(result.data);

      // Scroll smoothly to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setApiError(err?.message || 'A network error occurred while connecting to the analysis engine.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const handleAnalyzeAnother = () => {
    // Keep resume, clear job description and results to test another job description
    setJobDescription('');
    setAnalysisResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetAll = () => {
    setResumeText('');
    setResumeFileName('');
    setJobDescription('');
    setAnalysisResult(null);
    setValidationError(null);
    setApiError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading indicator during initial session verification
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25 mb-4 animate-bounce">
          <FileSearch className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
          Loading AI Resume Analyzer...
        </p>
      </div>
    );
  }

  // If user is not authenticated, render Login / Sign Up Page
  if (!currentUser) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  // Authenticated Dashboard
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  AI Resume Analyzer
                </h1>
                <span className="px-2 py-0.5 rounded-full text-2xs font-semibold bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400 border border-orange-200/60 dark:border-orange-800">
                  Dashboard
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Evidence-based ATS scoring, skill verification & actionable recommendations
              </p>
            </div>
          </div>

          {/* Right Controls: Samples & User Account Logout */}
          <div className="flex items-center flex-wrap gap-2.5 self-start sm:self-auto">
            {/* Quick Sample Presets */}
            <div className="hidden lg:flex items-center gap-1.5 mr-2">
              <span className="text-2xs font-medium text-slate-500 dark:text-slate-400">
                Sample:
              </span>
              {SAMPLE_PAIRS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleLoadSample(sample.id)}
                  disabled={isAnalyzing}
                  className="px-2 py-1 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
                  title={sample.description}
                >
                  <FileCode className="w-3 h-3 text-orange-500" />
                  <span>{sample.role.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* User Profile Badge */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-orange-50/80 dark:bg-orange-950/30 border border-orange-200/70 dark:border-orange-900/40 text-xs">
              <div className="w-6 h-6 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                  {currentUser.name}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/60 transition-all cursor-pointer"
              title="Log out of your account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Intro / Privacy Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50/60 via-amber-50/40 to-slate-50 dark:from-orange-950/20 dark:via-amber-950/20 dark:to-slate-900/30 border border-orange-100/80 dark:border-orange-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-slate-700 dark:text-slate-300">
              <strong className="font-semibold text-slate-900 dark:text-slate-100">Private & Secure Session:</strong>{' '}
              Welcome back, <span className="font-semibold text-orange-600 dark:text-orange-400">{currentUser.name}</span>. Resumes and job descriptions are evaluated securely and never permanently stored.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-slate-500 dark:text-slate-400 text-2xs">
            <Lock className="w-3.5 h-3.5 text-orange-500" />
            <span>Authenticated with JWT Session</span>
          </div>
        </div>

        {/* Validation or API Errors */}
        {validationError && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <div className="flex-1 font-medium">{validationError}</div>
            <button
              type="button"
              onClick={() => setValidationError(null)}
              className="text-rose-500 hover:text-rose-700"
            >
              ✕
            </button>
          </div>
        )}

        {apiError && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Analysis Failed</p>
              <p className="mt-0.5">{apiError}</p>
            </div>
            <button
              type="button"
              onClick={handleAnalyze}
              className="px-2.5 py-1 rounded bg-orange-600 text-white font-medium hover:bg-orange-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Input Section: 2 Columns */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:hidden">
          {/* Column 1: Resume Upload */}
          <ResumeUpload
            resumeText={resumeText}
            resumeFileName={resumeFileName}
            onTextExtracted={handleTextExtracted}
            onClear={handleClearResume}
            disabled={isAnalyzing}
          />

          {/* Column 2: Job Description Input */}
          <JobDescriptionInput
            jobDescription={jobDescription}
            onChange={(val) => {
              setJobDescription(val);
              if (validationError) setValidationError(null);
            }}
            onClear={handleClearJobDescription}
            disabled={isAnalyzing}
          />
        </section>

        {/* Action Button & Loading Bar */}
        <section className="flex flex-col items-center justify-center pt-2 pb-4 print:hidden">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`relative px-8 py-4 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center gap-2.5 ${
              isAnalyzing
                ? 'bg-orange-400 dark:bg-orange-600/60 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.99] shadow-orange-500/25 hover:shadow-orange-500/35 cursor-pointer'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Running Thorough Analysis...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Analyze Resume & Match Job Description</span>
              </>
            )}
          </button>

          {/* Loading status steps */}
          {isAnalyzing && (
            <div className="mt-4 flex flex-col items-center text-center animate-fade-in">
              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                {analysisStep}
              </p>
              <p className="text-2xs text-slate-400 dark:text-slate-500 mt-1">
                Evaluating skills, responsibilities, years of experience, and ATS markers
              </p>
            </div>
          )}
        </section>

        {/* Results Dashboard */}
        {analysisResult && (
          <section ref={resultsRef} className="space-y-6 pt-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Comprehensive Resume Analysis Results
                </h2>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Generated {new Date(analysisResult.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* 1. Overall Match Score & Executive Summary */}
            <MatchScore data={analysisResult} />

            {/* 2. Documented Score Breakdown */}
            <ScoreBreakdown
              breakdown={analysisResult.scoreBreakdown}
              overallScore={analysisResult.overallScore}
            />

            {/* 3. Skills Matrix (Matched, Missing, Unconfirmed) */}
            <SkillsAnalysis skills={analysisResult.skills} />

            {/* 4. Strengths, Prioritized Recommendations & Bullet Rewrites */}
            <ImprovementSuggestions
              strengths={analysisResult.resumeStrengths}
              recommendations={analysisResult.prioritizedRecommendations}
              bulletImprovements={analysisResult.bulletPointImprovements}
            />

            {/* 5. ATS Readability & Screening Diagnostics */}
            <AtsChecksView checks={analysisResult.atsChecks} />

            {/* 6. Export Options, Reset & Analyze Another */}
            <ReportExport
              data={analysisResult}
              onAnalyzeAnother={handleAnalyzeAnother}
              onResetAll={handleResetAll}
            />
          </section>
        )}

        {/* Footer / Privacy & Limitation Disclosure */}
        <footer className="pt-8 pb-12 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2 print:hidden">
          <p className="max-w-3xl mx-auto leading-relaxed">
            <strong>Scoring & Limitations Disclaimer:</strong> This match score is an algorithmic estimate of textual relevance against the provided job description. It is not an employment guarantee or automated hiring decision. Review recommendations thoughtfully and only incorporate truthful qualifications and achievements.
          </p>
          <p className="text-2xs text-slate-400 dark:text-slate-500">
            Powered by Google AI Studio • Gemini 3.8 Flash Engine • React & TypeScript • Protected Account Session
          </p>
        </footer>
      </main>
    </div>
  );
}
