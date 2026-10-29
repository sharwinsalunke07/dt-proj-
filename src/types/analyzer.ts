export type SkillStatus = 'matched' | 'missing' | 'unconfirmed';
export type SkillImportance = 'required' | 'preferred';
export type SkillCategory = 'technical' | 'soft' | 'domain' | 'tools';

export interface SkillItem {
  name: string;
  category: SkillCategory;
  status: SkillStatus;
  importance: SkillImportance;
  resumeEvidence?: string;
  explanation: string;
}

export interface ScoreCategory {
  score: number; // 0-100
  weight: number; // percentage
  weightedContribution: number;
  explanation: string;
  details?: string[];
}

export interface ScoreBreakdown {
  skillsAlignment: ScoreCategory;
  roleResponsibilityAlignment: ScoreCategory;
  experienceAlignment: ScoreCategory;
  educationCertifications: ScoreCategory;
  resumeClarityAts: ScoreCategory;
}

export interface AtsCheckItem {
  item: string;
  status: 'pass' | 'warning' | 'check';
  detail: string;
  category?: string;
}

export interface BulletPointImprovement {
  originalOrContext: string;
  suggestion: string;
  rationale: string;
}

export interface ImprovementRecommendation {
  priority: 'high' | 'medium' | 'low';
  title: string;
  reason: string;
  actionItem: string;
}

export interface JobOverview {
  jobTitle: string;
  companyIfMentioned?: string;
  seniorityLevel?: string;
  keyFocus?: string;
}

export interface AnalysisResult {
  jobOverview: JobOverview;
  overallScore: number;
  scoreBreakdown: ScoreBreakdown;
  matchSummary: string;
  skills: SkillItem[];
  resumeStrengths: string[];
  prioritizedRecommendations: ImprovementRecommendation[];
  bulletPointImprovements: BulletPointImprovement[];
  atsChecks: AtsCheckItem[];
  timestamp: string;
  resumeFileName?: string;
  wordCount: {
    resume: number;
    jobDescription: number;
  };
}

export interface ExtractResponse {
  success: boolean;
  text?: string;
  wordCount?: number;
  charCount?: number;
  fileName?: string;
  fileType?: string;
  error?: string;
  warning?: string;
}

export interface AnalyzeRequest {
  resumeText: string;
  jobDescription: string;
  resumeFileName?: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}
