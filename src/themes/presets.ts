import type { ResumeTheme } from './types'

const BASE_TYPOGRAPHY = {
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  baseFontSize: 11,
  scale: {
    name: 2.55,          // ≈ 28px
    jobTitle: 1.18,      // ≈ 13px
    sectionHeading: 0.82, // ≈ 9px
    entryTitle: 1.09,    // ≈ 12px
    secondary: 1.0,      // 11px
    meta: 0.91,          // ≈ 10px
    contact: 0.95,       // ≈ 10.5px
  },
  lineHeight: 1.55,
  letterSpacing: {
    name: '-0.5px',
    sectionHeading: '0.12em',
  },
  fontWeight: {
    name: 700,
    sectionHeading: 700,
    entryTitle: 600,
    secondary: 500,
  },
}

export const THEME_PRESETS: Record<string, ResumeTheme> = {
  classic: {
    id: 'classic',
    name: 'Classic',
    colors: {
      primary: '#1e3a5f',
      heading: '#111827',
      body: '#374151',
      muted: '#6b7280',
      border: '#d1d5db',
      surface: '#f3f4f6',
      link: '#1e3a5f',
    },
    typography: BASE_TYPOGRAPHY,
    spacing: { sectionGap: 20, entryGap: 14, itemGap: 4 },
    borders: { sectionRule: { width: 1, style: 'solid' }, radius: 3 },
    section: { headingTransform: 'uppercase' },
  },

  modern: {
    id: 'modern',
    name: 'Modern',
    colors: {
      primary: '#2563eb',
      heading: '#0f172a',
      body: '#475569',
      muted: '#94a3b8',
      border: '#e2e8f0',
      surface: '#f1f5f9',
      link: '#2563eb',
    },
    typography: BASE_TYPOGRAPHY,
    spacing: { sectionGap: 16, entryGap: 10, itemGap: 4 },
    borders: { sectionRule: { width: 1, style: 'solid' }, radius: 99 },
    section: { headingTransform: 'uppercase' },
  },

  minimal: {
    id: 'minimal',
    name: 'Minimal',
    colors: {
      primary: '#374151',
      heading: '#111827',
      body: '#4b5563',
      muted: '#9ca3af',
      border: '#e5e7eb',
      surface: '#f9fafb',
      link: '#374151',
    },
    typography: {
      ...BASE_TYPOGRAPHY,
      letterSpacing: { name: '-0.5px', sectionHeading: '0.06em' },
    },
    spacing: { sectionGap: 22, entryGap: 14, itemGap: 4 },
    borders: { sectionRule: { width: 1, style: 'solid' }, radius: 2 },
    section: { headingTransform: 'none' },
  },

  professional: {
    id: 'professional',
    name: 'Professional',
    colors: {
      primary: '#0f766e',
      heading: '#1c1917',
      body: '#44403c',
      muted: '#78716c',
      border: '#d6d3d1',
      surface: '#fafaf9',
      link: '#0f766e',
    },
    typography: BASE_TYPOGRAPHY,
    spacing: { sectionGap: 18, entryGap: 12, itemGap: 4 },
    borders: { sectionRule: { width: 1, style: 'solid' }, radius: 3 },
    section: { headingTransform: 'uppercase' },
  },
}
