import React, { useState, useRef } from 'react';
import { 
  FileUp, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Eye, 
  EyeOff, 
  Loader2, 
  UploadCloud,
  FileCheck2,
  Edit3
} from 'lucide-react';
import type { ExtractResponse } from '../types/analyzer';

interface ResumeUploadProps {
  resumeText: string;
  resumeFileName: string;
  onTextExtracted: (text: string, fileName: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({
  resumeText,
  resumeFileName,
  onTextExtracted,
  onClear,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [showExtractedPreview, setShowExtractedPreview] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const [editedText, setEditedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = resumeText ? resumeText.split(/\s+/).filter(Boolean).length : 0;
  const charCount = resumeText ? resumeText.length : 0;

  const handleFileProcess = async (file: File) => {
    setErrorMessage(null);
    setWarningMessage(null);

    // Validate file extension
    const validExtensions = ['.pdf', '.docx', '.txt'];
    const fileNameLower = file.name.toLowerCase();
    const hasValidExt = validExtensions.some(ext => fileNameLower.endsWith(ext));

    if (!hasValidExt) {
      setErrorMessage(
        'Unsupported file format. Please upload a PDF (.pdf), Microsoft Word (.docx), or plain text (.txt) file.'
      );
      return;
    }

    // Validate file size (15MB limit)
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('The file size exceeds the 15MB limit. Please upload a smaller file.');
      return;
    }

    setIsExtracting(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/extract-resume', {
        method: 'POST',
        body: formData,
      });

      const data: ExtractResponse = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(
          data.error || 'Failed to extract text from the uploaded document. Please check the file format.'
        );
        return;
      }

      if (!data.text || data.text.trim().length === 0) {
        setErrorMessage(
          'No readable text could be found in this file. If this is a scanned PDF image, please provide a document with selectable text.'
        );
        return;
      }

      if (data.warning) {
        setWarningMessage(data.warning);
      }

      onTextExtracted(data.text, file.name);
      setEditedText(data.text);
    } catch (err: any) {
      console.error('Extraction error:', err);
      setErrorMessage(
        'Network or extraction error occurred while communicating with the server. Please try again.'
      );
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleSaveEditedText = () => {
    if (editedText.trim().length < 20) {
      setErrorMessage('Resume text cannot be blank (minimum 20 characters required).');
      return;
    }
    onTextExtracted(editedText, resumeFileName || 'Custom_Resume.txt');
    setIsEditingText(false);
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
      {/* Card Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-semibold text-sm">
            1
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Candidate Resume
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload PDF or DOCX file
            </p>
          </div>
        </div>

        {resumeText && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Extracted ({wordCount} words)
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        {/* Upload State or Loaded State */}
        {!resumeText && !isExtracting ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 min-h-[220px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 scale-[0.99]'
                : 'border-slate-300 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500 bg-slate-50/40 dark:bg-slate-900/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              className="hidden"
              onChange={handleFileChange}
              disabled={disabled}
            />

            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>

            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">
              Click to browse or drop your resume here
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Supports <span className="font-semibold text-slate-700 dark:text-slate-300">PDF</span> (.pdf) and{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-300">Word</span> (.docx) up to 15MB
            </p>

            <div className="inline-flex items-center gap-2 text-xs font-medium text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs hover:bg-orange-50/50 transition-colors">
              <FileUp className="w-3.5 h-3.5" />
              Select File
            </div>
          </div>
        ) : isExtracting ? (
          <div className="flex-1 min-h-[220px] rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 text-center bg-slate-50/50 dark:bg-slate-900/50">
            <Loader2 className="w-8 h-8 text-orange-600 dark:text-orange-400 animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Parsing Document & Extracting Text...
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
              Validating document structure, reading text layers, and sanitizing formatting.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Loaded File Card */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                    {resumeFileName || 'Candidate_Resume'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {charCount.toLocaleString()} characters • {wordCount.toLocaleString()} words
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowExtractedPreview(!showExtractedPreview)}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs flex items-center gap-1"
                  title="Toggle extracted text preview"
                >
                  {showExtractedPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={onClear}
                  disabled={disabled}
                  className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs"
                  title="Remove uploaded resume"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Extracted Text Drawer / Viewer */}
            {showExtractedPreview && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-white dark:bg-slate-950 text-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Extracted Text Preview
                  </span>
                  {!isEditingText ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditedText(resumeText);
                        setIsEditingText(true);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 hover:underline"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit text
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSaveEditedText}
                        className="px-2 py-0.5 rounded bg-orange-600 text-white text-xs hover:bg-orange-700"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingText(false)}
                        className="text-slate-500 hover:text-slate-700 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {isEditingText ? (
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    rows={8}
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-900 font-mono text-xs focus:ring-1 focus:ring-indigo-500 outline-hidden"
                  />
                ) : (
                  <div className="max-h-48 overflow-y-auto font-mono text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed select-text p-1">
                    {resumeText}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Error or Warning Display */}
        {errorMessage && (
          <div className="mt-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {warningMessage && (
          <div className="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">{warningMessage}</div>
            <button
              type="button"
              onClick={() => setWarningMessage(null)}
              className="text-amber-500 hover:text-amber-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
