import type { Resume } from '@/types/resume'
import { sampleResume } from '@/utils/defaults'

/** Download the resume as a pretty-printed JSON file. */
export function exportResumeJSON(resume: Resume): void {
  const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const name = resume.personalInfo.fullName
    ? resume.personalInfo.fullName.replace(/\s+/g, '_')
    : 'resume'
  a.download = `${name}_${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Parse and lightly validate an imported JSON file.
 * Missing optional fields are filled with defaults from sampleResume.
 * Throws a descriptive Error if the structure is too broken to use.
 */
export function parseResumeJSON(raw: unknown): Resume {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('File does not contain a valid JSON object.')
  }

  const obj = raw as Record<string, unknown>

  // Require at minimum a personalInfo object — distinguishes a resume from random JSON
  if (!obj['personalInfo'] || typeof obj['personalInfo'] !== 'object') {
    throw new Error('Missing required field: personalInfo. Is this a resume export file?')
  }

  // Merge with defaults for any missing top-level fields
  const merged: Resume = {
    ...sampleResume,
    ...obj,
    id: typeof obj['id'] === 'string' ? obj['id'] : crypto.randomUUID(),
    title: typeof obj['title'] === 'string' ? obj['title'] : 'Imported Resume',
    createdAt: typeof obj['createdAt'] === 'string' ? obj['createdAt'] : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    personalInfo: {
      ...sampleResume.personalInfo,
      ...(typeof obj['personalInfo'] === 'object' ? (obj['personalInfo'] as object) : {}),
    },
    contact: {
      ...sampleResume.contact,
      ...(typeof obj['contact'] === 'object' ? (obj['contact'] as object) : {}),
    },
    theme: {
      ...sampleResume.theme,
      ...(typeof obj['theme'] === 'object' ? (obj['theme'] as object) : {}),
    },
    sections: Array.isArray(obj['sections']) ? obj['sections'] : sampleResume.sections,
    skills: Array.isArray(obj['skills']) ? obj['skills'] : [],
    skillGroups: Array.isArray(obj['skillGroups']) ? obj['skillGroups'] : [],
    experience: Array.isArray(obj['experience']) ? obj['experience'] : [],
    education: Array.isArray(obj['education']) ? obj['education'] : [],
    projects: Array.isArray(obj['projects']) ? obj['projects'] : [],
    certifications: Array.isArray(obj['certifications']) ? obj['certifications'] : [],
    achievements: Array.isArray(obj['achievements']) ? obj['achievements'] : [],
    customSections: Array.isArray(obj['customSections']) ? obj['customSections'] : [],
  } as Resume

  return merged
}

/** Read a File as text and return the parsed JSON value. */
export function readJSONFile(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        resolve(JSON.parse(e.target!.result as string))
      } catch {
        reject(new Error('File is not valid JSON.'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file.'))
    reader.readAsText(file)
  })
}
