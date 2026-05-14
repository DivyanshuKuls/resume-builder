export type BuiltInThemeId = 'classic' | 'modern' | 'minimal' | 'professional'

export interface ResumeThemeColors {
  primary: string   // company names, primary accents
  heading: string   // entry titles, candidate name
  body: string      // body text, descriptions
  muted: string     // dates, meta info, icons
  border: string    // dividers, rules, outlines
  surface: string   // skill pill backgrounds, avatar bg
  link: string      // URLs, social links
}

export interface ResumeThemeTypography {
  fontFamily: string
  baseFontSize: number  // px, e.g. 11 — all other sizes are multiplied from this
  scale: {
    name: number          // candidate name
    jobTitle: number      // job title / subtitle
    sectionHeading: number
    entryTitle: number
    secondary: number     // company, institution
    meta: number          // dates, location, GPA
    contact: number       // contact bar text
  }
  lineHeight: number
  letterSpacing: {
    name: string          // e.g. '-0.5px'
    sectionHeading: string // e.g. '0.12em'
  }
  fontWeight: {
    name: number
    sectionHeading: number
    entryTitle: number
    secondary: number
  }
}

export interface ResumeThemeSpacing {
  sectionGap: number   // px gap between body sections
  entryGap: number     // px gap between entries within a section
  itemGap: number      // px gap within an entry (between bullets etc.)
}

export interface ResumeThemeBorders {
  sectionRule: {
    width: number       // px
    style: 'solid' | 'dashed' | 'none'
  }
  radius: number        // px — skill pills, badges
}

export interface ResumeThemeSection {
  headingTransform: 'uppercase' | 'capitalize' | 'none'
}

export interface ResumeTheme {
  id: BuiltInThemeId
  name: string
  colors: ResumeThemeColors
  typography: ResumeThemeTypography
  spacing: ResumeThemeSpacing
  borders: ResumeThemeBorders
  section: ResumeThemeSection
}

/** CSS variable map produced by computeThemeCSSVars — applied as inline style on .resume-paper */
export type ThemeCSSVars = Record<string, string>
