import { describe, it, expect, vi, beforeEach } from 'vitest'
import { parseResumeJSON, exportResumeJSON, readJSONFile } from '@/utils/importExport'
import { makeResume } from '../../utils/resumeBuilders'

describe('parseResumeJSON', () => {
  it('throws on null / non-object input', () => {
    expect(() => parseResumeJSON(null)).toThrow('valid JSON object')
    expect(() => parseResumeJSON(42)).toThrow('valid JSON object')
    expect(() => parseResumeJSON([])).toThrow('valid JSON object')
  })

  it('throws when personalInfo is missing', () => {
    expect(() => parseResumeJSON({ title: 'Resume' })).toThrow('personalInfo')
  })

  it('throws when personalInfo is not an object', () => {
    expect(() => parseResumeJSON({ personalInfo: 'bad' })).toThrow('personalInfo')
  })

  it('returns a Resume when personalInfo is present', () => {
    const result = parseResumeJSON({ personalInfo: { fullName: 'Alice' } })
    expect(result.personalInfo.fullName).toBe('Alice')
  })

  it('merges missing fields with defaults', () => {
    const result = parseResumeJSON({ personalInfo: { fullName: 'Bob' } })
    // Arrays default to empty
    expect(Array.isArray(result.experience)).toBe(true)
    expect(Array.isArray(result.skills)).toBe(true)
    // Theme defaults to classic preset
    expect(result.theme.preset).toBe('classic')
  })

  it('preserves provided array data', () => {
    const exp = [{ id: '1', company: 'Acme', position: 'Dev', startDate: '2020-01', endDate: '', current: true, location: '', description: '', highlights: [] }]
    const result = parseResumeJSON({ personalInfo: { fullName: 'Carol' }, experience: exp })
    expect(result.experience).toEqual(exp)
  })

  it('generates a new id when id is missing', () => {
    const result = parseResumeJSON({ personalInfo: {} })
    expect(typeof result.id).toBe('string')
    expect(result.id.length).toBeGreaterThan(0)
  })

  it('preserves the existing id when provided', () => {
    const result = parseResumeJSON({ personalInfo: {}, id: 'my-fixed-id' })
    expect(result.id).toBe('my-fixed-id')
  })

  it('sets title to "Imported Resume" when missing', () => {
    const result = parseResumeJSON({ personalInfo: {} })
    expect(result.title).toBe('Imported Resume')
  })

  it('uses provided title', () => {
    const result = parseResumeJSON({ personalInfo: {}, title: 'My CV' })
    expect(result.title).toBe('My CV')
  })

  it('merges partial personalInfo with defaults', () => {
    const result = parseResumeJSON({ personalInfo: { fullName: 'Dan' } })
    expect(result.personalInfo.fullName).toBe('Dan')
    expect(typeof result.personalInfo.photoAlignment).toBe('string')
  })
})

describe('exportResumeJSON', () => {
  let appendSpy: ReturnType<typeof vi.spyOn>
  let removeSpy: ReturnType<typeof vi.spyOn>
  let clickSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    clickSpy = vi.fn()
    appendSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => document.body)
    removeSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => document.body)
    vi.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click: clickSpy,
    } as unknown as HTMLElement)
  })

  it('triggers a download click', () => {
    exportResumeJSON(makeResume({ personalInfo: { fullName: 'Jane Doe', jobTitle: '', photo: '', photoAlignment: 'left' } }))
    expect(clickSpy).toHaveBeenCalledOnce()
  })

  it('uses fullName in the filename', () => {
    const mockAnchor = { href: '', download: '', click: clickSpy }
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as unknown as HTMLElement)
    exportResumeJSON(makeResume({ personalInfo: { fullName: 'Jane Doe', jobTitle: '', photo: '', photoAlignment: 'left' } }))
    expect(mockAnchor.download).toMatch(/Jane_Doe/)
  })

  it('falls back to "resume" filename when fullName is empty', () => {
    const mockAnchor = { href: '', download: '', click: clickSpy }
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as unknown as HTMLElement)
    exportResumeJSON(makeResume({ personalInfo: { fullName: '', jobTitle: '', photo: '', photoAlignment: 'left' } }))
    expect(mockAnchor.download).toMatch(/^resume_/)
  })
})

describe('readJSONFile', () => {
  it('resolves with parsed JSON for a valid file', async () => {
    const data = { personalInfo: { fullName: 'Test' } }
    const file = new File([JSON.stringify(data)], 'resume.json', { type: 'application/json' })
    const result = await readJSONFile(file)
    expect(result).toEqual(data)
  })

  it('rejects with an error for invalid JSON', async () => {
    const file = new File(['not json {{'], 'bad.json', { type: 'application/json' })
    await expect(readJSONFile(file)).rejects.toThrow('not valid JSON')
  })
})
