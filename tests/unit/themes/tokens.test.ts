import { describe, it, expect } from 'vitest'
import { computeThemeCSSVars } from '@/themes/tokens'
import { THEME_PRESETS } from '@/themes/presets'
import type { ThemeSettings } from '@/types/resume'

const baseClassic: ThemeSettings = { preset: 'classic', fontScale: 1.0, spacingDensity: 1.0 }

describe('computeThemeCSSVars – output shape', () => {
  it('returns all required CSS variable keys', () => {
    const vars = computeThemeCSSVars(baseClassic)
    const requiredKeys = [
      '--rt-color-primary', '--rt-color-heading', '--rt-color-body',
      '--rt-color-muted', '--rt-color-border', '--rt-color-surface', '--rt-color-link',
      '--rt-font-family',
      '--rt-font-size-base', '--rt-font-size-name', '--rt-font-size-section',
      '--rt-font-size-entry', '--rt-font-size-secondary', '--rt-font-size-meta',
      '--rt-font-size-contact', '--rt-font-size-job-title',
      '--rt-font-weight-name', '--rt-font-weight-section',
      '--rt-font-weight-entry', '--rt-font-weight-secondary',
      '--rt-letter-spacing-name', '--rt-letter-spacing-section',
      '--rt-line-height',
      '--rt-spacing-section-gap', '--rt-spacing-entry-gap', '--rt-spacing-item-gap',
      '--rt-border-radius', '--rt-rule-width', '--rt-rule-color', '--rt-section-transform',
    ]
    for (const key of requiredKeys) {
      expect(vars).toHaveProperty(key)
    }
  })
})

describe('computeThemeCSSVars – presets', () => {
  const presetIds = ['classic', 'modern', 'minimal', 'professional'] as const

  it.each(presetIds)('produces valid output for %s preset', (preset) => {
    const vars = computeThemeCSSVars({ preset, fontScale: 1.0, spacingDensity: 1.0 })
    expect(vars['--rt-color-primary']).toBeTruthy()
    expect(vars['--rt-font-size-base']).toMatch(/px$/)
  })

  it('falls back to classic when preset is undefined', () => {
    const vars = computeThemeCSSVars({ preset: undefined as unknown as 'classic', fontScale: 1.0, spacingDensity: 1.0 })
    const classic = computeThemeCSSVars(baseClassic)
    expect(vars['--rt-color-primary']).toBe(classic['--rt-color-primary'])
  })
})

describe('computeThemeCSSVars – fontScale', () => {
  it('scales font sizes proportionally', () => {
    const base = computeThemeCSSVars({ preset: 'classic', fontScale: 1.0, spacingDensity: 1.0 })
    const large = computeThemeCSSVars({ preset: 'classic', fontScale: 1.2, spacingDensity: 1.0 })

    const baseSize = parseFloat(base['--rt-font-size-base'])
    const largeSize = parseFloat(large['--rt-font-size-base'])
    expect(largeSize).toBeCloseTo(baseSize * 1.2, 1)
  })

  it('scales name font size proportionally', () => {
    const small = computeThemeCSSVars({ preset: 'classic', fontScale: 0.9, spacingDensity: 1.0 })
    const large = computeThemeCSSVars({ preset: 'classic', fontScale: 1.1, spacingDensity: 1.0 })
    expect(parseFloat(large['--rt-font-size-name'])).toBeGreaterThan(parseFloat(small['--rt-font-size-name']))
  })
})

describe('computeThemeCSSVars – spacingDensity', () => {
  it('scales spacing values proportionally', () => {
    const compact = computeThemeCSSVars({ preset: 'classic', fontScale: 1.0, spacingDensity: 0.75 })
    const spacious = computeThemeCSSVars({ preset: 'classic', fontScale: 1.0, spacingDensity: 1.5 })

    const compactGap = parseFloat(compact['--rt-spacing-section-gap'])
    const spaciousGap = parseFloat(spacious['--rt-spacing-section-gap'])
    expect(spaciousGap).toBeGreaterThan(compactGap)
  })
})

describe('computeThemeCSSVars – color overrides', () => {
  it('overrides primary color', () => {
    const vars = computeThemeCSSVars({ ...baseClassic, primaryColor: '#ff0000' })
    expect(vars['--rt-color-primary']).toBe('#ff0000')
  })

  it('overrides heading color', () => {
    const vars = computeThemeCSSVars({ ...baseClassic, headingColor: '#00ff00' })
    expect(vars['--rt-color-heading']).toBe('#00ff00')
  })

  it('overrides link/accent color', () => {
    const vars = computeThemeCSSVars({ ...baseClassic, accentColor: '#0000ff' })
    expect(vars['--rt-color-link']).toBe('#0000ff')
  })

  it('does not override colors when override fields are absent', () => {
    const vars = computeThemeCSSVars(baseClassic)
    const preset = THEME_PRESETS['classic']
    expect(vars['--rt-color-primary']).toBe(preset.colors.primary)
    expect(vars['--rt-color-link']).toBe(preset.colors.link)
  })
})

describe('computeThemeCSSVars – font family', () => {
  it('uses preset font family when fontFamily is not set', () => {
    const vars = computeThemeCSSVars(baseClassic)
    expect(vars['--rt-font-family']).toBeTruthy()
  })

  it('overrides font family from the known map', () => {
    const vars = computeThemeCSSVars({ ...baseClassic, fontFamily: 'georgia' })
    expect(vars['--rt-font-family']).toContain('Georgia')
  })

  it('passes through unknown font family strings as-is', () => {
    const vars = computeThemeCSSVars({ ...baseClassic, fontFamily: 'CustomFont' })
    expect(vars['--rt-font-family']).toBe('CustomFont')
  })
})
