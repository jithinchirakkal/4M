

import React, { useState, useEffect, useMemo, useCallback } from 'react';

// ============ TYPE DEFINITIONS ============
interface ValidationRow {
  id?: number;
  spec: string;
  standard: string;
  unit: string;
  before_change_1: string;
  before_change_2: string;
  before_change_3: string;
  before_judgment: 'OK' | 'NG' | '';
  after_change_1: string;
  after_change_2: string;
  after_change_3: string;
  after_judgment: 'OK' | 'NG' | '';
  end_change_1: string;
  end_change_2: string;
  end_change_3: string;
  end_judgment: 'OK' | 'NG' | '';
  remarks: string;
}

interface FormData {
  id?: number;
  record_id?: string;
  product: string;
  process: string;
  line: string;
  customer: string;
  shift: string;
  date: string;
  unexpected_change: string;
  change_point: string;
  result_confirmation_status: 'pass' | 'fail' | 'pending';
  prepared_by: string;
  approved_by: string;
  rows: ValidationRow[];
}

interface FourMRecord {
  id: number;
  record_id: string;
  four_m: string;
  category_details?: { category_type: string };
  shopfloor_name: string;
  line_name: string;
  date: string;
  shift: string;
}

// ============ CONSTANTS ============
const API_BASE = 'http://localhost:8000/api/';
const VALIDATION_API = `${API_BASE}change-validations/`;
const FOURM_API = `${API_BASE}4m-changes/`;

const CHANGE_TYPE_OPTIONS = [
  { value: 'Man', label: 'Man', icon: '👤', description: 'Personnel changes' },
  { value: 'Machine', label: 'Machine', icon: '⚙️', description: 'Equipment changes' },
  { value: 'Material', label: 'Material', icon: '📦', description: 'Material changes' },
  { value: 'Method', label: 'Method', icon: '📋', description: 'Process changes' },
  { value: 'Others', label: 'Others', icon: '📌', description: 'Other changes' },
];

const SHIFT_OPTIONS = [
  { value: 'A', label: 'Shift A', time: '06:00 - 14:00' },
  { value: 'B', label: 'Shift B', time: '14:00 - 22:00' },
  { value: 'C', label: 'Shift C', time: '22:00 - 06:00' },
];

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];
const FAIL_KEYWORDS = ['fail', 'ng', 'reject', 'not ok', 'nok', 'bad', 'defect', 'error'];

// ============ UTILITY FUNCTIONS ============
const createEmptyRow = (): ValidationRow => ({
  spec: '',
  standard: '',
  unit: '',
  before_change_1: '',
  before_change_2: '',
  before_change_3: '',
  before_judgment: '',
  after_change_1: '',
  after_change_2: '',
  after_change_3: '',
  after_judgment: '',
  end_change_1: '',
  end_change_2: '',
  end_change_3: '',
  end_judgment: '',
  remarks: '',
});

const initialForm: FormData = {
  product: '',
  process: '',
  line: '',
  customer: '',
  shift: '',
  date: new Date().toISOString().split('T')[0],
  unexpected_change: '',
  change_point: '',
  result_confirmation_status: 'pending',
  prepared_by: '',
  approved_by: '',
  rows: [createEmptyRow()],
};

const calculateStatus = (rows: ValidationRow[]): 'pass' | 'fail' | 'pending' => {
  const filledRows = rows.filter(row => row.spec.trim() !== '');
  if (filledRows.length === 0) return 'pending';
  
  let hasAllRequiredData = true;
  let hasAnyFailure = false;
  
  for (const row of filledRows) {
    const hasBeforeData = Boolean(row.before_change_1 || row.before_change_2 || row.before_change_3);
    const hasAfterData = Boolean(row.after_change_1 || row.after_change_2 || row.after_change_3);
    const hasEndData = Boolean(row.end_change_1 || row.end_change_2 || row.end_change_3);
    
    if (!hasBeforeData || !hasAfterData || !hasEndData) hasAllRequiredData = false;
    if (row.before_judgment === 'NG' || row.after_judgment === 'NG' || row.end_judgment === 'NG') hasAnyFailure = true;
    
    const remarkLower = row.remarks.toLowerCase();
    if (FAIL_KEYWORDS.some(keyword => remarkLower.includes(keyword))) hasAnyFailure = true;
  }
  
  if (hasAnyFailure) return 'fail';
  if (!hasAllRequiredData) return 'pending';
  return 'pass';
};

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatDateRelative = (dateString: string): string => {
  if (!dateString) return '';
  const diffDays = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
};

// ============ ICONS ============
const Icons = {
  Plus: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Trash: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Check: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  X: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Clock: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ChevronDown: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  ChevronLeft: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  ChevronRight: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Save: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
  ),
  Spinner: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
  Link: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  Edit: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Search: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Document: ({ className = "w-16 h-16" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  AlertCircle: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  CheckCircle: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Calendar: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Factory: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  User: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Clipboard: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  Copy: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  Expand: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  ),
  Collapse: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
    </svg>
  ),
  Refresh: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  Grid: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Table: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  Eye: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  Info: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ArrowRight: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
};

// ============ COMPONENTS ============

const StatusBadge: React.FC<{ status: string; size?: 'xs' | 'sm' | 'md' | 'lg' }> = ({ status, size = 'md' }) => {
  const config = {
    pass: { bg: 'bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'PASS' },
    fail: { bg: 'bg-rose-100', border: 'border-rose-300', text: 'text-rose-700', dot: 'bg-rose-500', label: 'FAIL' },
    pending: { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-700', dot: 'bg-amber-500', label: 'PENDING' },
  }[status] || { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-700', dot: 'bg-gray-500', label: 'UNKNOWN' };

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] gap-1',
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2'
  }[size];

  return (
    <span className={`inline-flex items-center ${sizeClasses} font-bold rounded-full border ${config.bg} ${config.border} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === 'pending' ? 'animate-pulse' : ''}`} />
      {config.label}
    </span>
  );
};

const ProgressRing: React.FC<{ progress: number; size?: number }> = ({ progress, size = 36 }) => {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  const getColor = () => progress === 100 ? '#10b981' : progress >= 60 ? '#f59e0b' : '#d1d5db';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle className="text-gray-200" strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
        <circle strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" stroke={getColor()} fill="transparent" r={radius} cx={size / 2} cy={size / 2} className="transition-all duration-300" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold text-gray-600">{progress}%</span>
      </div>
    </div>
  );
};

const InputField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
  placeholder?: string;
  hint?: string;
}> = ({ label, name, value, onChange, type = 'text', error, required, icon, placeholder, hint }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-rose-500">*</span>}
      {hint && <span className="text-gray-400 font-normal ml-1">({hint})</span>}
    </label>
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 border ${error ? 'border-rose-300 bg-rose-50' : 'border-gray-300 hover:border-gray-400 focus:border-indigo-500'} rounded-lg focus:ring-2 focus:ring-indigo-200 transition-all text-gray-800`}
      />
    </div>
    {error && <p className="text-rose-500 text-xs mt-1 flex items-center gap-1"><Icons.AlertCircle className="w-3 h-3" />{error}</p>}
  </div>
);

const SelectField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string; time?: string }[];
  placeholder?: string;
}> = ({ label, name, value, onChange, options, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pl-4 pr-10 py-2.5 border border-gray-300 hover:border-gray-400 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-200 transition-all text-gray-800 bg-white appearance-none cursor-pointer"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label} {opt.time && `(${opt.time})`}
          </option>
        ))}
      </select>
      <Icons.ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

const ChangeTypeSelector: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Change Type</label>
    <div className="grid grid-cols-5 gap-2">
      {CHANGE_TYPE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`relative p-3 rounded-xl border-2 transition-all text-center group ${value === opt.value ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'}`}
        >
          <span className="text-2xl block">{opt.icon}</span>
          <p className={`text-xs font-medium mt-1 ${value === opt.value ? 'text-indigo-700' : 'text-gray-600'}`}>{opt.label}</p>
          {value === opt.value && (
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center shadow">
              <Icons.Check className="w-3 h-3 text-white" />
            </div>
          )}
        </button>
      ))}
    </div>
  </div>
);

const JudgmentToggle: React.FC<{ value: 'OK' | 'NG' | ''; onChange: (value: 'OK' | 'NG' | '') => void }> = ({ value, onChange }) => (
  <div className="inline-flex rounded-lg border-2 border-gray-200 overflow-hidden">
    <button
      type="button"
      onClick={() => onChange(value === 'OK' ? '' : 'OK')}
      className={`px-4 py-2 text-sm font-bold transition-all ${value === 'OK' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-400 hover:bg-emerald-50 hover:text-emerald-600'}`}
    >
      OK
    </button>
    <button
      type="button"
      onClick={() => onChange(value === 'NG' ? '' : 'NG')}
      className={`px-4 py-2 text-sm font-bold transition-all border-l-2 border-gray-200 ${value === 'NG' ? 'bg-rose-500 text-white' : 'bg-white text-gray-400 hover:bg-rose-50 hover:text-rose-600'}`}
    >
      NG
    </button>
  </div>
);

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}> = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange, onItemsPerPageChange }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-gray-200">
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>
          Showing <span className="font-semibold text-gray-900">{startItem}</span> to{' '}
          <span className="font-semibold text-gray-900">{endItem}</span> of{' '}
          <span className="font-semibold text-gray-900">{totalItems}</span> results
        </span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
        >
          {ITEMS_PER_PAGE_OPTIONS.map(n => (
            <option key={n} value={n}>{n} / page</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Icons.ChevronLeft className="w-4 h-4" />
        </button>
        {getPageNumbers().map((page, idx) => (
          typeof page === 'number' ? (
            <button
              key={idx}
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] h-9 rounded-lg font-medium transition-all ${currentPage === page ? 'bg-indigo-600 text-white shadow-md' : 'border border-gray-300 hover:bg-gray-50 text-gray-700'}`}
            >
              {page}
            </button>
          ) : (
            <span key={idx} className="px-2 text-gray-400">...</span>
          )
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Icons.ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const StatusGuide: React.FC<{ status: string }> = ({ status }) => {
  const config = {
    pending: { bgClass: 'bg-amber-50', borderClass: 'border-amber-200', iconClass: 'text-amber-600', titleClass: 'text-amber-800', descClass: 'text-amber-600', icon: <Icons.Clock className="w-4 h-4" />, title: 'Pending', desc: 'Fill all readings (Before, After, End) to complete validation' },
    pass: { bgClass: 'bg-emerald-50', borderClass: 'border-emerald-200', iconClass: 'text-emerald-600', titleClass: 'text-emerald-800', descClass: 'text-emerald-600', icon: <Icons.CheckCircle className="w-4 h-4" />, title: 'Passed', desc: 'All validation points complete with no failures' },
    fail: { bgClass: 'bg-rose-50', borderClass: 'border-rose-200', iconClass: 'text-rose-600', titleClass: 'text-rose-800', descClass: 'text-rose-600', icon: <Icons.AlertCircle className="w-4 h-4" />, title: 'Failed', desc: 'NG judgment or failure keywords detected in remarks' },
  }[status] || { bgClass: 'bg-gray-50', borderClass: 'border-gray-200', iconClass: 'text-gray-600', titleClass: 'text-gray-800', descClass: 'text-gray-600', icon: <Icons.Info className="w-4 h-4" />, title: 'Unknown', desc: '' };

  return (
    <div className={`${config.bgClass} border ${config.borderClass} rounded-lg p-3 flex items-start gap-3`}>
      <div className={`${config.iconClass} mt-0.5`}>{config.icon}</div>
      <div>
        <p className={`text-sm font-semibold ${config.titleClass}`}>{config.title}</p>
        <p className={`text-xs ${config.descClass} mt-0.5`}>{config.desc}</p>
      </div>
    </div>
  );
};

const LinkedRecordInfo: React.FC<{ record: FourMRecord }> = ({ record }) => (
  <div className="rounded-xl border-2 p-4 bg-indigo-50 border-indigo-200 mt-3">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-indigo-100">
          <Icons.Link className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <p className="font-semibold text-gray-900">{record.record_id}</p>
          <p className="text-sm text-gray-600">{record.four_m} • {record.line_name} • {record.date}</p>
        </div>
      </div>
      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">Auto-filled</span>
    </div>
  </div>
);

// ============ MAIN COMPONENT ============
export default function ChangeValidationForm() {
  const [selectedReport, setSelectedReport] = useState<FormData | null>(null);
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [reports, setReports] = useState<FormData[]>([]);
  const [fourMRecords, setFourMRecords] = useState<FourMRecord[]>([]);
  const [selectedFourMId, setSelectedFourMId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'before' | 'after' | 'end'>('before');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedPanel, setExpandedPanel] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeFormStep, setActiveFormStep] = useState(1);

  useEffect(() => {
    const newStatus = calculateStatus(formData.rows);
    if (newStatus !== formData.result_confirmation_status) {
      setFormData(prev => ({ ...prev, result_confirmation_status: newStatus }));
    }
  }, [formData.rows, formData.result_confirmation_status]);

  const formatReportData = useCallback((r: any): FormData => ({
    id: r.id,
    record_id: r.record_id,
    product: r.product || '',
    process: r.process || '',
    line: r.line || '',
    customer: r.customer || '',
    shift: r.shift || '',
    date: r.date || '',
    unexpected_change: r.unexpected_change || '',
    change_point: r.change_point || '',
    result_confirmation_status: r.result_confirmation_status || 'pending',
    prepared_by: r.prepared_by || '',
    approved_by: r.approved_by || '',
    rows: (r.rows || []).map((row: any) => ({
      id: row.id,
      spec: row.spec || '',
      standard: row.standard || '',
      unit: row.unit || '',
      before_change_1: row.before_change_1 || '',
      before_change_2: row.before_change_2 || '',
      before_change_3: row.before_change_3 || '',
      before_judgment: row.before_judgment || '',
      after_change_1: row.after_change_1 || '',
      after_change_2: row.after_change_2 || '',
      after_change_3: row.after_change_3 || '',
      after_judgment: row.after_judgment || '',
      end_change_1: row.end_change_1 || '',
      end_change_2: row.end_change_2 || '',
      end_change_3: row.end_change_3 || '',
      end_judgment: row.end_judgment || '',
      remarks: row.remarks || '',
    })),
  }), []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [valRes, fourRes] = await Promise.all([fetch(VALIDATION_API), fetch(FOURM_API)]);
      if (!valRes.ok) throw new Error('Failed to load validation reports');
      if (!fourRes.ok) throw new Error('Failed to load 4M records');
      const [valData, fourData] = await Promise.all([valRes.json(), fourRes.json()]);
      setReports(valData.map(formatReportData));
      setFourMRecords(fourData.filter((r: FourMRecord) => r.category_details?.category_type === 'Unplanned'));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [formatReportData]);

  useEffect(() => { loadData(); }, [loadData]);

  const availableFourMRecords = useMemo(() => {
    const linkedRecordIds = new Set(reports.map(r => r.record_id).filter(Boolean));
    return fourMRecords.filter(r => !linkedRecordIds.has(r.record_id));
  }, [fourMRecords, reports]);

  const linkedRecordsCount = useMemo(() => fourMRecords.length - availableFourMRecords.length, [fourMRecords.length, availableFourMRecords.length]);

  useEffect(() => {
    if (!selectedFourMId) return;
    const selected = fourMRecords.find((r) => r.record_id === selectedFourMId);
    if (!selected) return;
    setFormData((prev) => ({
      ...prev,
      record_id: selected.record_id,
      product: selected.shopfloor_name || prev.product,
      process: 'Spot Welding',
      line: selected.line_name || '',
      shift: selected.shift || '',
      date: selected.date || prev.date,
      unexpected_change: selected.four_m || '',
      change_point: 'Unplanned change from 4M record',
    }));
  }, [selectedFourMId, fourMRecords]);

  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = r.product.toLowerCase().includes(query) || r.process.toLowerCase().includes(query) || r.line.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || r.result_confirmation_status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reports, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReports.slice(start, start + itemsPerPage);
  }, [filteredReports, currentPage, itemsPerPage]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter, itemsPerPage]);

  const stats = useMemo(() => ({
    total: reports.length,
    pass: reports.filter(r => r.result_confirmation_status === 'pass').length,
    fail: reports.filter(r => r.result_confirmation_status === 'fail').length,
    pending: reports.filter(r => r.result_confirmation_status === 'pending').length,
  }), [reports]);

  const addRow = useCallback(() => setFormData(prev => ({ ...prev, rows: [...prev.rows, createEmptyRow()] })), []);
  
  const removeRow = useCallback((index: number) => {
    if (formData.rows.length <= 1) return;
    setFormData(prev => ({ ...prev, rows: prev.rows.filter((_, i) => i !== index) }));
  }, [formData.rows.length]);
  
  const duplicateRow = useCallback((index: number) => {
    const rowToCopy = { ...formData.rows[index], id: undefined };
    setFormData(prev => ({ ...prev, rows: [...prev.rows.slice(0, index + 1), rowToCopy, ...prev.rows.slice(index + 1)] }));
  }, [formData.rows]);

  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.product.trim()) errors.product = 'Product is required';
    if (!formData.process.trim()) errors.process = 'Process is required';
    if (!formData.line.trim()) errors.line = 'Line is required';
    if (!formData.date) errors.date = 'Date is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, rowIndex?: number, field?: keyof ValidationRow) => {
    const { name, value } = e.target;
    if (validationErrors[name]) {
      setValidationErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    }
    if (typeof rowIndex === 'number' && field) {
      setFormData(prev => {
        const newRows = [...prev.rows];
        newRows[rowIndex] = { ...newRows[rowIndex], [field]: value };
        return { ...prev, rows: newRows };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, [validationErrors]);

  const handleJudgmentChange = useCallback((rowIndex: number, field: 'before_judgment' | 'after_judgment' | 'end_judgment', value: 'OK' | 'NG' | '') => {
    setFormData(prev => {
      const newRows = [...prev.rows];
      newRows[rowIndex] = { ...newRows[rowIndex], [field]: value };
      return { ...prev, rows: newRows };
    });
  }, []);

  const handleSave = async () => {
    if (!validateForm()) {
      setError('Please fill all required fields');
      setActiveFormStep(1);
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);

    const filteredRows = formData.rows.filter(r => r.spec.trim() !== '').map(r => ({
      ...r,
      id: r.id || undefined,
      before_judgment: r.before_judgment || '',
      after_judgment: r.after_judgment || '',
      end_judgment: r.end_judgment || '',
    }));

    const payload = {
      ...formData,
      product: formData.product.trim(),
      process: formData.process.trim(),
      line: formData.line.trim(),
      customer: formData.customer?.trim() || '',
      shift: formData.shift?.trim() || '',
      change_point: formData.change_point?.trim() || '',
      prepared_by: formData.prepared_by?.trim() || '',
      approved_by: formData.approved_by?.trim() || '',
      rows: filteredRows,
    };

    try {
      const method = isEditing && formData.id ? 'PUT' : 'POST';
      const url = isEditing && formData.id ? `${VALIDATION_API}${formData.id}/` : VALIDATION_API;
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(typeof errData === 'string' ? errData : errData.detail || Object.entries(errData).map(([k, v]) => `${k}: ${v}`).join('; '));
      }

      setSuccess('Saved successfully!');
      await loadData();
      setTimeout(() => { closePanel(); setSuccess(null); }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const startNew = () => {
    setFormData(initialForm);
    setIsEditing(false);
    setIsCreating(true);
    setSelectedReport(null);
    setSelectedFourMId('');
    setValidationErrors({});
    setError(null);
    setActiveFormStep(2);
  };

  const openReport = (report: FormData) => {
    const rows = report.rows.length > 0 ? report.rows : [createEmptyRow()];
    setFormData({ ...report, rows });
    setSelectedReport(report);
    setIsEditing(false);
    setIsCreating(false);
  };

  const startEdit = () => {
    setIsEditing(true);
    setIsCreating(false);
    setActiveFormStep(1);
  };

  const closePanel = () => {
    setSelectedReport(null);
    setIsEditing(false);
    setIsCreating(false);
    setFormData(initialForm);
    setSelectedFourMId('');
    setActiveFormStep(1);
  };

  const getRowCompletion = (row: ValidationRow): number => {
    const fields = [row.before_change_1, row.before_change_2, row.before_change_3, row.after_change_1, row.after_change_2, row.after_change_3, row.end_change_1, row.end_change_2, row.end_change_3];
    return Math.round((fields.filter(f => f.trim() !== '').length / 9) * 100);
  };

  const showPanel = selectedReport || isCreating;
  const isFormMode = isEditing || isCreating;

  const tabConfig = {
    before: { label: 'Before Change', color: 'indigo', prefix: 'before_change' as const, judgment: 'before_judgment' as const },
    after: { label: 'After Change', color: 'emerald', prefix: 'after_change' as const, judgment: 'after_judgment' as const },
    end: { label: 'End of Change', color: 'amber', prefix: 'end_change' as const, judgment: 'end_judgment' as const },
  };

  const formSteps = [
    { id: 1, label: 'Basic Info', icon: <Icons.Factory className="w-4 h-4" /> },
    { id: 2, label: 'Validation', icon: <Icons.Clipboard className="w-4 h-4" /> },
    { id: 3, label: 'Approval', icon: <Icons.User className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0 shadow-sm">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Icons.Clipboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Change Validation</h1>
              <p className="text-sm text-gray-500">Track and validate process changes</p>
            </div>
          </div>
          <button onClick={startNew} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:-translate-y-0.5">
            <Icons.Plus className="w-5 h-5" />
            New Report
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${showPanel && !expandedPanel ? 'w-[420px]' : expandedPanel ? 'hidden' : 'flex-1'}`}>
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-gray-600">{stats.total}</p>
                <p className="text-xs text-gray-600 font-medium">Total</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-emerald-600">{stats.pass}</p>
                <p className="text-xs text-emerald-600 font-medium">Pass</p>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-rose-600">{stats.fail}</p>
                <p className="text-xs text-rose-600 font-medium">Fail</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                <p className="text-xs text-amber-600 font-medium">Pending</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-gray-200 space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search by product, process, line..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500" />
              </div>
              <button onClick={loadData} disabled={loading} className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                <Icons.Refresh className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {['all', 'pending', 'pass', 'fail'].map((status) => (
                  <button key={status} onClick={() => setStatusFilter(status)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === status ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button onClick={() => setViewMode('card')} className={`p-2 transition-all ${viewMode === 'card' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                  <Icons.Grid className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode('table')} className={`p-2 transition-all border-l border-gray-300 ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                  <Icons.Table className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Icons.Spinner className="w-8 h-8 text-indigo-500" />
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Icons.Document className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No reports found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : viewMode === 'card' ? (
              <div className="p-4 space-y-2">
                {paginatedReports.map((report) => (
                  <div key={report.id} onClick={() => openReport(report)} className={`group p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${selectedReport?.id === report.id ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-gray-200 bg-white hover:border-indigo-200'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-indigo-700">{report.product || 'Untitled'}</h3>
                        <p className="text-sm text-gray-500 truncate">{report.process} • {report.line}</p>
                      </div>
                      <StatusBadge status={report.result_confirmation_status} size="xs" />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Icons.Calendar className="w-3 h-3" />{formatDateRelative(report.date)}</span>
                      {report.unexpected_change && <span className="px-2 py-0.5 bg-gray-100 rounded-full font-medium text-gray-600">{report.unexpected_change}</span>}
                      {report.record_id && <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-medium">Linked</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Process / Line</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedReports.map((report) => (
                      <tr key={report.id} className={`hover:bg-gray-50 cursor-pointer ${selectedReport?.id === report.id ? 'bg-indigo-50' : ''}`} onClick={() => openReport(report)}>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{report.product || 'Untitled'}</p>
                          {report.record_id && <span className="text-xs text-indigo-600 font-medium">🔗 {report.record_id}</span>}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-900">{report.process}</p>
                          <p className="text-sm text-gray-500">{report.line}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-700">{report.unexpected_change || '—'}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(report.date)}</td>
                        <td className="px-4 py-3 text-center"><StatusBadge status={report.result_confirmation_status} size="sm" /></td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={(e) => { e.stopPropagation(); openReport(report); }} className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <Icons.Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {filteredReports.length > 0 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredReports.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} onItemsPerPageChange={setItemsPerPage} />
          )}
        </div>

        {showPanel && (
          <div className={`flex flex-col bg-gray-50 transition-all duration-300 ${expandedPanel ? 'flex-1' : 'flex-1'}`}>
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <button onClick={closePanel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                  <Icons.X className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="font-bold text-gray-900">{isCreating ? 'Create New Report' : formData.product || 'Report Details'}</h3>
                  <p className="text-sm text-gray-500">
                    {isCreating ? 'Fill in the details below' : isEditing ? 'Edit mode' : 'Viewing details'}
                    {formData.record_id && <span className="ml-2 text-indigo-600">• Linked to {formData.record_id}</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={formData.result_confirmation_status} size="md" />
                <button onClick={() => setExpandedPanel(!expandedPanel)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                  {expandedPanel ? <Icons.Collapse className="w-4 h-4" /> : <Icons.Expand className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {(error || success) && (
              <div className={`mx-6 mt-4 p-4 rounded-xl flex items-start gap-3 ${error ? 'bg-rose-50 border border-rose-200' : 'bg-emerald-50 border border-emerald-200'}`}>
                {error ? <Icons.AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" /> : <Icons.CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
                <p className={`text-sm flex-1 ${error ? 'text-rose-700' : 'text-emerald-700'}`}>{error || success}</p>
                <button onClick={() => { setError(null); setSuccess(null); }} className="p-1 hover:bg-white/50 rounded"><Icons.X className="w-4 h-4" /></button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6">
              {isFormMode ? (
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      {formSteps.map((step, idx) => (
                        <React.Fragment key={step.id}>
                          <button onClick={() => setActiveFormStep(step.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeFormStep === step.id ? 'bg-indigo-100 text-indigo-700 font-semibold' : activeFormStep > step.id ? 'text-emerald-600' : 'text-gray-400'}`}>
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${activeFormStep === step.id ? 'bg-indigo-600 text-white' : activeFormStep > step.id ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                              {activeFormStep > step.id ? <Icons.Check className="w-4 h-4" /> : step.id}
                            </span>
                            <span className="hidden sm:inline">{step.label}</span>
                          </button>
                          {idx < formSteps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${activeFormStep > step.id ? 'bg-emerald-500' : 'bg-gray-200'}`} />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <StatusGuide status={formData.result_confirmation_status} />

                  {activeFormStep === 1 && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                          <span className="w-6 h-6 bg-indigo-500 rounded-md flex items-center justify-center text-white text-xs font-bold">1</span>
                          Basic Information
                        </h4>
                      </div>
                      <div className="p-5 space-y-5">
                        {isCreating && (
                          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Icons.Link className="w-5 h-5 text-indigo-600" />
                              <h4 className="font-semibold text-gray-900">Link to 4M Change Record</h4>
                              <span className="text-xs text-gray-400">(Optional)</span>
                            </div>
                            {availableFourMRecords.length === 0 ? (
                              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                                <Icons.CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                <p className="text-gray-700 font-medium">All records linked!</p>
                                <p className="text-gray-500 text-sm mt-1">
                                  {linkedRecordsCount > 0 ? `All ${linkedRecordsCount} unplanned 4M records already have validations.` : 'No unplanned 4M records available.'}
                                </p>
                              </div>
                            ) : (
                              <div>
                                <select value={selectedFourMId} onChange={(e) => setSelectedFourMId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 bg-white">
                                  <option value="">— Select an unplanned change record ({availableFourMRecords.length} available) —</option>
                                  {availableFourMRecords.map((rec) => (
                                    <option key={rec.record_id} value={rec.record_id}>
                                      {rec.record_id} • {rec.date} • {rec.four_m} • {rec.line_name}
                                    </option>
                                  ))}
                                </select>
                                {linkedRecordsCount > 0 && (
                                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                    <Icons.Info className="w-3 h-3" />
                                    {linkedRecordsCount} record(s) already have validations and are not shown.
                                  </p>
                                )}
                                {selectedFourMId && fourMRecords.find(r => r.record_id === selectedFourMId) && (
                                  <LinkedRecordInfo record={fourMRecords.find(r => r.record_id === selectedFourMId)!} />
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <InputField label="Product" name="product" value={formData.product} onChange={handleInputChange} error={validationErrors.product} required icon={<Icons.Factory className="w-4 h-4" />} placeholder="Enter product name" />
                          <InputField label="Process" name="process" value={formData.process} onChange={handleInputChange} error={validationErrors.process} required placeholder="Enter process name" />
                          <InputField label="Line" name="line" value={formData.line} onChange={handleInputChange} error={validationErrors.line} required placeholder="Enter line name" />
                          <InputField label="Date" name="date" type="date" value={formData.date} onChange={handleInputChange} error={validationErrors.date} required icon={<Icons.Calendar className="w-4 h-4" />} />
                          <InputField label="Customer" name="customer" value={formData.customer} onChange={handleInputChange} icon={<Icons.User className="w-4 h-4" />} placeholder="Optional" />
                          <SelectField label="Shift" name="shift" value={formData.shift} onChange={handleInputChange} placeholder="Select shift..." options={SHIFT_OPTIONS} />
                        </div>

                                               <ChangeTypeSelector value={formData.unexpected_change} onChange={(val) => setFormData(prev => ({ ...prev, unexpected_change: val }))} />

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Change Point / Reason</label>
                          <textarea
                            name="change_point"
                            value={formData.change_point}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 resize-none"
                            placeholder="Describe the change and reason..."
                          />
                        </div>

                        <div className="flex justify-end">
                          <button onClick={() => setActiveFormStep(2)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                            Next: Validation <Icons.ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFormStep === 2 && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                          <span className="w-6 h-6 bg-indigo-500 rounded-md flex items-center justify-center text-white text-xs font-bold">2</span>
                          Validation Points
                        </h4>
                        <span className="text-sm text-gray-500">{formData.rows.filter(r => r.spec).length} points</span>
                      </div>

                      <div className="p-5">
                        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-5">
                          {(Object.entries(tabConfig) as [typeof activeTab, typeof tabConfig.before][]).map(([key, config]) => {
                            const colorClasses = {
                              indigo: 'bg-indigo-500 text-white',
                              emerald: 'bg-emerald-500 text-white',
                              amber: 'bg-amber-500 text-white',
                            };
                            return (
                              <button key={key} onClick={() => setActiveTab(key)} className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                                {config.label}
                              </button>
                            );
                          })}
                        </div>

                        <div className="space-y-4">
                          {formData.rows.map((row, idx) => {
                            const currentConfig = tabConfig[activeTab];
                            const completion = getRowCompletion(row);
                            const bgClasses = {
                              before: 'bg-indigo-50 border-indigo-200',
                              after: 'bg-emerald-50 border-emerald-200',
                              end: 'bg-amber-50 border-amber-200',
                            };

                            return (
                              <div key={idx} className={`border-2 ${bgClasses[activeTab]} rounded-xl p-4 space-y-4`}>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2">
                                    <span className="w-8 h-8 bg-white border border-gray-200 shadow-sm text-gray-700 rounded-lg flex items-center justify-center font-bold">{idx + 1}</span>
                                    <ProgressRing progress={completion} size={40} />
                                  </div>
                                  <div className="flex-1">
                                    <input
                                      value={row.spec}
                                      onChange={(e) => handleInputChange(e, idx, 'spec')}
                                      className="w-full border border-gray-300 bg-white rounded-lg px-4 py-2.5 font-medium focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                                      placeholder="Enter specification name (e.g., Temperature, Pressure, Dimension)..."
                                    />
                                  </div>
                                  <div className="flex gap-1">
                                    <button onClick={() => duplicateRow(idx)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors" title="Duplicate">
                                      <Icons.Copy className="w-4 h-4" />
                                    </button>
                                    {formData.rows.length > 1 && (
                                      <button onClick={() => removeRow(idx)} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors" title="Remove">
                                        <Icons.Trash className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <div className="grid grid-cols-4 gap-4">
                                  {[1, 2, 3].map((num) => (
                                    <div key={num}>
                                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Reading {num}</label>
                                      <input
                                        value={(row as any)[`${currentConfig.prefix}_${num}`]}
                                        onChange={(e) => handleInputChange(e, idx, `${currentConfig.prefix}_${num}` as keyof ValidationRow)}
                                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2.5 text-center focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                                        placeholder="—"
                                      />
                                    </div>
                                  ))}
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Judgment</label>
                                    <JudgmentToggle value={row[currentConfig.judgment]} onChange={(val) => handleJudgmentChange(idx, currentConfig.judgment, val)} />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Remarks</label>
                                  <input
                                    value={row.remarks}
                                    onChange={(e) => handleInputChange(e, idx, 'remarks')}
                                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                                    placeholder="Add notes... (type 'fail', 'ng', 'reject' to mark as failure)"
                                  />
                                </div>
                              </div>
                            );
                          })}

                          <button onClick={addRow} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 font-semibold">
                            <Icons.Plus className="w-5 h-5" />
                            Add Validation Point
                          </button>
                        </div>

                        <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
                          <button onClick={() => setActiveFormStep(1)} className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                            Back
                          </button>
                          <button onClick={() => setActiveFormStep(3)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                            Next: Approval <Icons.ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFormStep === 3 && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                          <span className="w-6 h-6 bg-indigo-500 rounded-md flex items-center justify-center text-white text-xs font-bold">3</span>
                          Approval & Summary
                        </h4>
                      </div>
                      <div className="p-5 space-y-5">
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <h5 className="font-medium text-gray-700">Validation Summary</h5>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                              <p className="text-2xl font-bold text-gray-900">{formData.rows.filter(r => r.spec).length}</p>
                              <p className="text-xs text-gray-500">Total Points</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                              <p className="text-2xl font-bold text-emerald-600">{formData.rows.filter(r => r.spec && getRowCompletion(r) === 100).length}</p>
                              <p className="text-xs text-gray-500">Complete</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                              <StatusBadge status={formData.result_confirmation_status} size="lg" />
                              <p className="text-xs text-gray-500 mt-1">Status</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <InputField label="Prepared By" name="prepared_by" value={formData.prepared_by} onChange={handleInputChange} icon={<Icons.User className="w-4 h-4" />} placeholder="Enter name" />
                          <InputField label="Approved By" name="approved_by" value={formData.approved_by} onChange={handleInputChange} icon={<Icons.User className="w-4 h-4" />} placeholder="Enter name" />
                        </div>

                        <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
                          <button onClick={() => setActiveFormStep(2)} className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                            Back
                          </button>
                          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg font-semibold shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {saving ? <Icons.Spinner className="w-5 h-5" /> : <Icons.Save className="w-5 h-5" />}
                            {saving ? 'Saving...' : 'Save Report'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{formData.product}</h3>
                        <p className="text-gray-600 mt-1">{formData.process} • {formData.line}</p>
                        {formData.record_id && <p className="text-indigo-600 text-sm mt-1 font-medium">🔗 Linked to {formData.record_id}</p>}
                      </div>
                      <StatusBadge status={formData.result_confirmation_status} size="lg" />
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-6">
                      {[
                        { label: 'Date', value: formatDate(formData.date) },
                        { label: 'Change Type', value: formData.unexpected_change || '—' },
                        { label: 'Shift', value: formData.shift || '—' },
                        { label: 'Customer', value: formData.customer || '—' },
                      ].map((item) => (
                        <div key={item.label} className="bg-white/60 rounded-lg p-3">
                          <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                          <p className="font-semibold text-gray-900 mt-1">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {formData.change_point && (
                      <div className="mt-4 pt-4 border-t border-indigo-200">
                        <p className="text-xs text-gray-500 font-medium">Change Point</p>
                        <p className="text-gray-800 mt-1">{formData.change_point}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h4 className="font-semibold text-gray-800">Validation Points</h4>
                      <span className="text-xs text-gray-500">{formData.rows.filter(r => r.spec).length} points</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {formData.rows.filter(r => r.spec).map((row, idx) => (
                        <div key={idx} className="p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-600">{idx + 1}</span>
                              <span className="font-semibold text-gray-900">{row.spec}</span>
                            </div>
                            <ProgressRing progress={getRowCompletion(row)} size={40} />
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            {(['before', 'after', 'end'] as const).map((phase) => {
                              const readings = [(row as any)[`${phase}_change_1`], (row as any)[`${phase}_change_2`], (row as any)[`${phase}_change_3`]].filter(Boolean);
                              const judgment = row[`${phase}_judgment` as keyof ValidationRow];
                              const colorClasses = {
                                before: 'bg-indigo-50 border-indigo-200',
                                after: 'bg-emerald-50 border-emerald-200',
                                end: 'bg-amber-50 border-amber-200',
                              };
                              const labels = { before: 'Before Change', after: 'After Change', end: 'End of Change' };

                              return (
                                <div key={phase} className={`p-3 rounded-lg border ${colorClasses[phase]}`}>
                                  <p className="text-xs font-semibold text-gray-500 mb-1">{labels[phase]}</p>
                                  <p className="font-medium text-gray-900">{readings.length > 0 ? readings.join(' / ') : '—'}</p>
                                  {judgment && (
                                    <span className={`inline-block mt-2 px-2 py-0.5 text-xs font-bold rounded ${judgment === 'OK' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                      {judgment}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {row.remarks && (
                            <p className="text-sm text-gray-500 mt-3 italic bg-gray-50 px-3 py-2 rounded-lg">"{row.remarks}"</p>
                          )}
                        </div>
                      ))}

                      {formData.rows.filter(r => r.spec).length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                          <Icons.Document className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          No validation points recorded
                        </div>
                      )}
                    </div>
                  </div>

                  {(formData.prepared_by || formData.approved_by) && (
                    <div className="grid grid-cols-2 gap-4">
                      {formData.prepared_by && (
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <p className="text-xs text-gray-500 font-medium">Prepared By</p>
                          <p className="font-semibold text-gray-900 flex items-center gap-2 mt-1">
                            <Icons.User className="w-4 h-4 text-gray-400" />{formData.prepared_by}
                          </p>
                        </div>
                      )}
                      {formData.approved_by && (
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <p className="text-xs text-gray-500 font-medium">Approved By</p>
                          <p className="font-semibold text-gray-900 flex items-center gap-2 mt-1">
                            <Icons.User className="w-4 h-4 text-gray-400" />{formData.approved_by}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3 flex-shrink-0">
              {isFormMode ? (
                <>
                  <button onClick={closePanel} disabled={saving} className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all disabled:opacity-50">
                    {saving ? <Icons.Spinner className="w-5 h-5" /> : <Icons.Save className="w-5 h-5" />}
                    {saving ? 'Saving...' : 'Save Report'}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={closePanel} className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                    Close
                  </button>
                  <button onClick={startEdit} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all">
                    <Icons.Edit className="w-4 h-4" />Edit Report
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {!showPanel && (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icons.Clipboard className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Select a Report</h3>
              <p className="text-gray-500 mt-1">Choose from the list or create a new one</p>
              <button onClick={startNew} className="mt-4 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors">
                <Icons.Plus className="w-5 h-5" />New Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}