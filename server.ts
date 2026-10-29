import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GoogleGenAI, Type } from '@google/genai';
import type { AnalysisResult } from './src/types/analyzer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'ai-resume-analyzer-auth-secret-key-2026';

// Body parsers
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Multer memory storage for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
});

// -----------------------------------------------------------------------------
// Authentication Persistent Store & Utilities
// -----------------------------------------------------------------------------
const DATA_DIR = path.resolve(__dirname, 'data');
const USERS_FILE = path.resolve(DATA_DIR, 'users.json');

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  lastLoginAt?: string;
}

function getStoredUsers(): StoredUser[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      const defaultUser: StoredUser = {
        id: 'usr_' + Date.now(),
        name: 'Alex Chen',
        email: 'demo@resumepro.ai',
        passwordHash: bcrypt.hashSync('DemoPass123!', 10),
        createdAt: new Date().toISOString(),
      };
      fs.writeFileSync(USERS_FILE, JSON.stringify([defaultUser], null, 2), 'utf-8');
      return [defaultUser];
    }
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read users database:', err);
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

// Ensure database file is initialized on server boot
getStoredUsers();

// -----------------------------------------------------------------------------
// Authentication Routes
// -----------------------------------------------------------------------------

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please enter your full name (at least 2 characters).',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.',
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match. Please re-enter your password.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();

    const existingUser = users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists. Please log in instead.',
      });
    }

    // Hash password with salt rounds (never store plain-text passwords)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser: StoredUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveStoredUsers(users);

    // Issue JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error during /api/auth/register:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error during account registration. Please try again.',
    });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please enter both your email address and password.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();

    const user = users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please verify your credentials and try again.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please verify your credentials and try again.',
      });
    }

    user.lastLoginAt = new Date().toISOString();
    saveStoredUsers(users);

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error during /api/auth/login:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error during login. Please try again.',
    });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Missing or malformed Authorization header.',
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr) {
      return res.status(401).json({
        success: false,
        error: 'Session token has expired or is invalid. Please log in again.',
      });
    }

    const users = getStoredUsers();
    const user = users.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User account not found.',
      });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/auth/me:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to verify session.',
    });
  }
});

async function extractPdfText(fileBuffer: Buffer): Promise<string> {
  const mod = await import('pdf-parse');
  if ((mod as any).PDFParse) {
    const ParserClass = (mod as any).PDFParse;
    const instance = new ParserClass({ data: fileBuffer });
    try {
      const res = await instance.getText();
      const extracted = typeof res === 'string' ? res : (res?.text || '');
      return extracted;
    } finally {
      if (typeof instance.destroy === 'function') {
        await instance.destroy().catch(() => {});
      }
    }
  } else if (typeof (mod as any).default === 'function') {
    const data = await (mod as any).default(fileBuffer);
    return data.text || '';
  } else if (typeof mod === 'function') {
    const data = await (mod as any)(fileBuffer);
    return data.text || '';
  }
  throw new Error('Unsupported PDF parser export shape.');
}

async function extractDocxText(fileBuffer: Buffer): Promise<string> {
  const mod = await import('mammoth');
  const mammoth = (mod as any).default || mod;
  const result = await mammoth.extractRawText({ buffer: fileBuffer });
  return result.value || '';
}

// -----------------------------------------------------------------------------
// POST /api/extract-resume
// Handles PDF, DOCX, and TXT parsing with detailed diagnostic checks
// -----------------------------------------------------------------------------
app.post('/api/extract-resume', upload.single('file'), async (req, res) => {
  try {
    let fileBuffer: Buffer | null = null;
    let fileName = '';
    let mimeType = '';

    if (req.file) {
      fileBuffer = req.file.buffer;
      fileName = req.file.originalname || 'uploaded_resume';
      mimeType = req.file.mimetype || '';
    } else if (req.body?.fileData) {
      // Base64 fallback if client sends JSON
      const base64Str = req.body.fileData.replace(/^data:.*?;base64,/, '');
      fileBuffer = Buffer.from(base64Str, 'base64');
      fileName = req.body.fileName || 'uploaded_resume';
      mimeType = req.body.mimeType || '';
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No file was provided or the uploaded file is empty.',
      });
    }

    const lowerName = fileName.toLowerCase();
    let extractedText = '';
    let fileTypeDetected = 'unknown';

    if (lowerName.endsWith('.pdf') || mimeType === 'application/pdf') {
      fileTypeDetected = 'PDF';
      try {
        extractedText = await extractPdfText(fileBuffer);
      } catch (err: any) {
        console.error('Error parsing PDF:', err);
        return res.status(422).json({
          success: false,
          error: `Failed to parse PDF document: ${err?.message || 'The PDF structure is corrupted or password-protected.'}`,
        });
      }
    } else if (
      lowerName.endsWith('.docx') ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      fileTypeDetected = 'DOCX';
      try {
        extractedText = await extractDocxText(fileBuffer);
      } catch (err: any) {
        console.error('Error parsing DOCX:', err);
        return res.status(422).json({
          success: false,
          error: `Failed to parse DOCX document: ${err?.message || 'The Word file may be corrupted.'}`,
        });
      }
    } else if (lowerName.endsWith('.txt') || mimeType.startsWith('text/')) {
      fileTypeDetected = 'TXT';
      extractedText = fileBuffer.toString('utf-8').trim();
    } else {
      return res.status(400).json({
        success: false,
        error: 'Unsupported file format. Please upload a PDF (.pdf) or Microsoft Word (.docx) document.',
      });
    }

    // Clean up excessive whitespace while preserving line-break structure
    extractedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[ \t]{3,}/g, '  ')
      .replace(/\n{4,}/g, '\n\n\n');

    const charCount = extractedText.length;
    const words = extractedText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Detect empty or unreadable extracted text (e.g., scanned image PDF without OCR text layer)
    if (charCount < 30 || wordCount < 10) {
      return res.status(422).json({
        success: false,
        error:
          `The uploaded ${fileTypeDetected} contains little to no readable text (${charCount} characters detected). ` +
          'If this is a scanned PDF or an image-based resume without an embedded text layer, please convert it to selectable text or upload a DOCX/PDF with selectable text.',
        charCount,
        wordCount,
        fileType: fileTypeDetected,
      });
    }

    let warning: string | undefined;
    if (wordCount < 60) {
      warning = 'The resume text is unusually brief. For best matching accuracy, ensure all work history and skills sections are included.';
    }

    return res.json({
      success: true,
      text: extractedText,
      wordCount,
      charCount,
      fileName,
      fileType: fileTypeDetected,
      warning,
    });
  } catch (error: any) {
    console.error('Unexpected error in /api/extract-resume:', error);
    return res.status(500).json({
      success: false,
      error: `Server extraction failure: ${error?.message || 'Internal server error'}`,
    });
  }
});

// -----------------------------------------------------------------------------
// POST /api/analyze
// Full structured analysis using Gemini 3.8 Flash with server-side API Key
// -----------------------------------------------------------------------------
app.post('/api/analyze', async (req, res) => {
  try {
    const { resumeText, jobDescription, resumeFileName } = req.body;

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 15) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid job description (at least 15 characters required).',
      });
    }

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 30) {
      return res.status(400).json({
        success: false,
        error: 'Please provide valid resume text or upload a readable PDF/DOCX resume (at least 30 characters required).',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'GEMINI_API_KEY is not configured on the server. Please check environment configuration.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `You are a world-class Senior ATS and Talent Acquisition Intelligence Engine.
Your task is to analyze an uploaded resume against a provided job description with strict, evidence-based scrutiny.

CRITICAL INTEGRITY RULES:
1. Ground every finding solely in the provided resume and job description. Do NOT hallucinate skills, qualifications, degrees, or achievements.
2. For "matched" skills: You MUST supply verbatim or near-verbatim quote evidence from the resume in "resumeEvidence".
3. For "missing" skills: Skills explicitly or implicitly requested in the job description that have zero evidence in the resume.
4. For "unconfirmed" skills: Skills where the resume contains vague or superficial mentions without sufficient evidence of hands-on application or depth.
5. Never advise the candidate to lie or falsely claim a skill.
6. Provide accurate, transparent scores for the 5 categories (0-100 each):
   - Skills Alignment (Weight: 35%): Direct alignment of required and preferred technical, soft, and tool skills.
   - Role and Responsibility Alignment (Weight: 25%): How well past work deliverables and duties match what this job expects.
   - Experience Alignment (Weight: 20%): Seniority, scope, scale, and years of experience versus requirements.
   - Education and Certifications (Weight: 10%): Degrees, specializations, or industry certifications specified in the job description.
   - Resume Clarity and Basic ATS Checks (Weight: 10%): Readability, quantifiable impact (numbers, %, $), section organization, and action verbs.
7. Return strictly valid JSON adhering to the specified schema.`;

    const prompt = `Please analyze the following resume and job description:

=== JOB DESCRIPTION ===
${jobDescription.trim()}

=== CANDIDATE RESUME ===
${resumeText.trim()}

Perform a thorough, rigorous evaluation. Return the structured JSON matching the requested response schema.`;

    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let response: any = null;
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.2,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                jobOverview: {
                  type: Type.OBJECT,
                  properties: {
                    jobTitle: { type: Type.STRING },
                    companyIfMentioned: { type: Type.STRING },
                    seniorityLevel: { type: Type.STRING },
                    keyFocus: { type: Type.STRING },
                  },
                  required: ['jobTitle', 'seniorityLevel', 'keyFocus'],
                },
                scoreBreakdown: {
                  type: Type.OBJECT,
                  properties: {
                    skillsAlignment: {
                      type: Type.OBJECT,
                      properties: {
                        score: { type: Type.INTEGER, description: 'Score 0 to 100' },
                        weight: { type: Type.INTEGER, description: 'Must be 35' },
                        explanation: { type: Type.STRING },
                        details: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ['score', 'weight', 'explanation'],
                    },
                    roleResponsibilityAlignment: {
                      type: Type.OBJECT,
                      properties: {
                        score: { type: Type.INTEGER, description: 'Score 0 to 100' },
                        weight: { type: Type.INTEGER, description: 'Must be 25' },
                        explanation: { type: Type.STRING },
                        details: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ['score', 'weight', 'explanation'],
                    },
                    experienceAlignment: {
                      type: Type.OBJECT,
                      properties: {
                        score: { type: Type.INTEGER, description: 'Score 0 to 100' },
                        weight: { type: Type.INTEGER, description: 'Must be 20' },
                        explanation: { type: Type.STRING },
                        details: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ['score', 'weight', 'explanation'],
                    },
                    educationCertifications: {
                      type: Type.OBJECT,
                      properties: {
                        score: { type: Type.INTEGER, description: 'Score 0 to 100' },
                        weight: { type: Type.INTEGER, description: 'Must be 10' },
                        explanation: { type: Type.STRING },
                        details: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ['score', 'weight', 'explanation'],
                    },
                    resumeClarityAts: {
                      type: Type.OBJECT,
                      properties: {
                        score: { type: Type.INTEGER, description: 'Score 0 to 100' },
                        weight: { type: Type.INTEGER, description: 'Must be 10' },
                        explanation: { type: Type.STRING },
                        details: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ['score', 'weight', 'explanation'],
                    },
                  },
                  required: [
                    'skillsAlignment',
                    'roleResponsibilityAlignment',
                    'experienceAlignment',
                    'educationCertifications',
                    'resumeClarityAts',
                  ],
                },
                overallScore: {
                  type: Type.INTEGER,
                  description: 'Weighted match score from 0 to 100',
                },
                matchSummary: {
                  type: Type.STRING,
                  description: 'Concise executive assessment of candidate fit and major takeaways',
                },
                skills: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      category: {
                        type: Type.STRING,
                        description: 'technical | soft | domain | tools',
                      },
                      status: {
                        type: Type.STRING,
                        description: 'matched | missing | unconfirmed',
                      },
                      importance: {
                        type: Type.STRING,
                        description: 'required | preferred',
                      },
                      resumeEvidence: {
                        type: Type.STRING,
                        description: 'Verbatim excerpt from resume supporting this match',
                      },
                      explanation: {
                        type: Type.STRING,
                        description: 'Context on why this was marked matched, missing, or unconfirmed',
                      },
                    },
                    required: ['name', 'category', 'status', 'importance', 'explanation'],
                  },
                },
                resumeStrengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3 to 5 key strengths found in the resume matching the job',
                },
                prioritizedRecommendations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      priority: { type: Type.STRING, description: 'high | medium | low' },
                      title: { type: Type.STRING },
                      reason: { type: Type.STRING },
                      actionItem: { type: Type.STRING },
                    },
                    required: ['priority', 'title', 'reason', 'actionItem'],
                  },
                },
                bulletPointImprovements: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      originalOrContext: { type: Type.STRING, description: 'Weak or existing bullet / context' },
                      suggestion: { type: Type.STRING, description: 'Rewritten bullet point using action verbs & metrics' },
                      rationale: { type: Type.STRING, description: 'Why this rewritten version is more compelling for ATS and recruiters' },
                    },
                    required: ['originalOrContext', 'suggestion', 'rationale'],
                  },
                },
                atsChecks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      item: { type: Type.STRING, description: 'Check name, e.g. Contact Details, Section Headers, Metric Quantification' },
                      status: { type: Type.STRING, description: 'pass | warning | check' },
                      detail: { type: Type.STRING },
                      category: { type: Type.STRING },
                    },
                    required: ['item', 'status', 'detail'],
                  },
                },
              },
              required: [
                'jobOverview',
                'scoreBreakdown',
                'matchSummary',
                'skills',
                'resumeStrengths',
                'prioritizedRecommendations',
                'bulletPointImprovements',
                'atsChecks',
              ],
            },
          },
        });

        if (response?.text) {
          break;
        }
      } catch (err: any) {
        console.warn(`Gemini generation with ${modelName} failed:`, err?.message);
        lastError = err;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (!response?.text) {
      throw lastError || new Error('Failed to generate analysis with Gemini.');
    }

    const rawText = response.text;
    if (!rawText) {
      throw new Error('Gemini model returned an empty response.');
    }

    let parsedData: any;
    try {
      parsedData = JSON.parse(rawText.trim());
    } catch (parseErr) {
      console.error('Failed to parse Gemini output:', rawText);
      throw new Error('Could not parse structured analysis from AI output.');
    }

    // Mathematical verification and weighting enforcement
    // Category 1: Skills (35%)
    // Category 2: Role & Responsibility (25%)
    // Category 3: Experience (20%)
    // Category 4: Education & Certifications (10%)
    // Category 5: Resume Clarity & Basic ATS (10%)
    const s1 = Math.min(100, Math.max(0, Number(parsedData.scoreBreakdown?.skillsAlignment?.score) || 0));
    const s2 = Math.min(100, Math.max(0, Number(parsedData.scoreBreakdown?.roleResponsibilityAlignment?.score) || 0));
    const s3 = Math.min(100, Math.max(0, Number(parsedData.scoreBreakdown?.experienceAlignment?.score) || 0));
    const s4 = Math.min(100, Math.max(0, Number(parsedData.scoreBreakdown?.educationCertifications?.score) || 0));
    const s5 = Math.min(100, Math.max(0, Number(parsedData.scoreBreakdown?.resumeClarityAts?.score) || 0));

    const w1 = 35;
    const w2 = 25;
    const w3 = 20;
    const w4 = 10;
    const w5 = 10;

    const c1 = (s1 * w1) / 100;
    const c2 = (s2 * w2) / 100;
    const c3 = (s3 * w3) / 100;
    const c4 = (s4 * w4) / 100;
    const c5 = (s5 * w5) / 100;

    const computedOverallScore = Math.round(c1 + c2 + c3 + c4 + c5);

    parsedData.scoreBreakdown.skillsAlignment.weight = w1;
    parsedData.scoreBreakdown.skillsAlignment.weightedContribution = Number(c1.toFixed(1));
    parsedData.scoreBreakdown.skillsAlignment.score = s1;

    parsedData.scoreBreakdown.roleResponsibilityAlignment.weight = w2;
    parsedData.scoreBreakdown.roleResponsibilityAlignment.weightedContribution = Number(c2.toFixed(1));
    parsedData.scoreBreakdown.roleResponsibilityAlignment.score = s2;

    parsedData.scoreBreakdown.experienceAlignment.weight = w3;
    parsedData.scoreBreakdown.experienceAlignment.weightedContribution = Number(c3.toFixed(1));
    parsedData.scoreBreakdown.experienceAlignment.score = s3;

    parsedData.scoreBreakdown.educationCertifications.weight = w4;
    parsedData.scoreBreakdown.educationCertifications.weightedContribution = Number(c4.toFixed(1));
    parsedData.scoreBreakdown.educationCertifications.score = s4;

    parsedData.scoreBreakdown.resumeClarityAts.weight = w5;
    parsedData.scoreBreakdown.resumeClarityAts.weightedContribution = Number(c5.toFixed(1));
    parsedData.scoreBreakdown.resumeClarityAts.score = s5;

    parsedData.overallScore = computedOverallScore;
    parsedData.resumeFileName = resumeFileName || 'Resume';
    parsedData.timestamp = new Date().toISOString();
    parsedData.wordCount = {
      resume: resumeText.split(/\s+/).filter(Boolean).length,
      jobDescription: jobDescription.split(/\s+/).filter(Boolean).length,
    };

    return res.json({
      success: true,
      data: parsedData as AnalysisResult,
    });
  } catch (error: any) {
    console.error('Error during /api/analyze:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'An error occurred during resume analysis. Please try again.',
    });
  }
});

// -----------------------------------------------------------------------------
// Vite Dev Server / Static File Serving
// -----------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
