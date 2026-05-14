import type { ThemeCSSVars } from './types'
import type { ThemeSettings } from '@/types/resume'
import { THEME_PRESETS } from './presets'

const FONT_FAMILY_MAP: Record<string, string> = {
  inter:    "'Inter', system-ui, -apple-system, sans-serif",
  roboto:   "'Roboto', system-ui, sans-serif",
  georgia:  "Georgia, 'Times New Roman', serif",
  merriweather: "'Merriweather', Georgia, serif",
  'source-sans': "'Source Sans 3', system-ui, sans-serif",
}

/**
 * Resolves a ThemeSettings object (preset + user overrides) into a flat map of
 * CSS custom properties to be applied as inline style on .resume-paper.
 *
 * This is the single place that bridges "user preference data" to "CSS".
 * Renderers never read ThemeSettings directly — they only see the CSS vars.
 */
export function computeThemeCSSVars(settings: ThemeSettings): ThemeCSSVars {
  const preset = THEME_PRESETS[settings.preset ?? 'classic'] ?? THEME_PRESETS.classic
  const fontScale = settings.fontScale ?? 1.0
  const spacingScale = settings.spacingDensity ?? 1.0

  // Merge user overrides on top of preset colors
  const colors = {
    ...preset.colors,
    ...(settings.primaryColor  ? { primary: settings.primaryColor }  : {}),
    ...(settings.headingColor  ? { heading: settings.headingColor }  : {}),
    ...(settings.accentColor   ? { link:    settings.accentColor }   : {}),
  }

  const typo = preset.typography
  const base = typo.baseFontSize * fontScale
  const fontFamily = settings.fontFamily
    ? (FONT_FAMILY_MAP[settings.fontFamily] ?? settings.fontFamily)
    : typo.fontFamily

  const s = preset.spacing

  return {
    '--rt-color-primary':  colors.primary,
    '--rt-color-heading':  colors.heading,
    '--rt-color-body':     colors.body,
    '--rt-color-muted':    colors.muted,
    '--rt-color-border':   colors.border,
    '--rt-color-surface':  colors.surface,
    '--rt-color-link':     colors.link,

    '--rt-font-family':          fontFamily,
    '--rt-font-size-base':       `${round(base)}px`,
    '--rt-font-size-name':       `${round(base * typo.scale.name)}px`,
    '--rt-font-size-job-title':  `${round(base * typo.scale.jobTitle)}px`,
    '--rt-font-size-section':    `${round(base * typo.scale.sectionHeading)}px`,
    '--rt-font-size-entry':      `${round(base * typo.scale.entryTitle)}px`,
    '--rt-font-size-secondary':  `${round(base * typo.scale.secondary)}px`,
    '--rt-font-size-meta':       `${round(base * typo.scale.meta)}px`,
    '--rt-font-size-contact':    `${round(base * typo.scale.contact)}px`,

    '--rt-font-weight-name':      String(typo.fontWeight.name),
    '--rt-font-weight-section':   String(typo.fontWeight.sectionHeading),
    '--rt-font-weight-entry':     String(typo.fontWeight.entryTitle),
    '--rt-font-weight-secondary': String(typo.fontWeight.secondary),

    '--rt-letter-spacing-name':    typo.letterSpacing.name,
    '--rt-letter-spacing-section': typo.letterSpacing.sectionHeading,

    '--rt-line-height': String(typo.lineHeight),

    '--rt-spacing-section-gap': `${round(s.sectionGap * spacingScale)}px`,
    '--rt-spacing-entry-gap':   `${round(s.entryGap  * spacingScale)}px`,
    '--rt-spacing-item-gap':    `${round(s.itemGap   * spacingScale)}px`,

    '--rt-border-radius':  `${preset.borders.radius}px`,
    '--rt-rule-width':     `${preset.borders.sectionRule.width}px`,
    '--rt-rule-color':     colors.border,
    '--rt-section-transform': preset.section.headingTransform,
  }
}

function round(n: number): number {
  return Math.round(n * 10) / 10
}
