import { cn } from '@/utils/cn'
import { useResume, useResumeActions } from '@/hooks/useResume'
import { THEME_PRESETS } from '@/themes'
import type { BuiltInThemeId } from '@/types/resume'

const PRESET_ORDER: BuiltInThemeId[] = ['classic', 'modern', 'minimal', 'professional']

const FONT_OPTIONS = [
  { value: 'inter',        label: 'Inter' },
  { value: 'roboto',       label: 'Roboto' },
  { value: 'georgia',      label: 'Georgia' },
  { value: 'merriweather', label: 'Merriweather' },
  { value: 'source-sans',  label: 'Source Sans 3' },
]

function ColorSwatch({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-3 w-3 rounded-full border border-black/10"
      style={{ background: color }}
    />
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </p>
  )
}

function ColorField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string
  value: string | undefined
  placeholder: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value ?? placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-9 cursor-pointer rounded border border-slate-300 bg-white p-0.5"
        />
        <input
          type="text"
          value={value ?? ''}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 flex-1 rounded border border-slate-200 bg-white px-2 font-mono text-xs text-slate-700 placeholder:text-slate-300 focus:border-blue-400 focus:outline-none"
          maxLength={7}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-slate-400 hover:text-slate-600"
            title="Reset to preset default"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export function ThemeEditor() {
  const resume = useResume()
  const { updateTheme } = useResumeActions()
  const { theme } = resume

  const activePreset = THEME_PRESETS[theme.preset ?? 'classic']

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">Theme</h2>
        <p className="mt-0.5 text-xs text-slate-500">Choose a preset and fine-tune to match your style</p>
      </div>

      {/* ── Preset picker ─────────────────────────────────────────────── */}
      <div>
        <SectionLabel>Preset</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_ORDER.map((id) => {
            const preset = THEME_PRESETS[id]
            const isActive = (theme.preset ?? 'classic') === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => updateTheme({ preset: id })}
                className={cn(
                  'flex flex-col gap-1.5 rounded-lg border p-3 text-left transition-colors',
                  isActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn('text-xs font-semibold', isActive ? 'text-blue-700' : 'text-slate-700')}>
                    {preset.name}
                  </span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  )}
                </div>
                <div className="flex gap-1">
                  <ColorSwatch color={preset.colors.primary} />
                  <ColorSwatch color={preset.colors.heading} />
                  <ColorSwatch color={preset.colors.body} />
                  <ColorSwatch color={preset.colors.border} />
                </div>
                <span className="text-[10px] text-slate-400">
                  {preset.section.headingTransform === 'uppercase' ? 'UPPERCASE SECTIONS' : 'Mixed case sections'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Color overrides ────────────────────────────────────────────── */}
      <div>
        <SectionLabel>Color overrides</SectionLabel>
        <div className="space-y-3">
          <ColorField
            label="Primary color"
            value={theme.primaryColor}
            placeholder={activePreset.colors.primary}
            onChange={(v) => updateTheme({ primaryColor: v || undefined })}
          />
          <ColorField
            label="Heading color"
            value={theme.headingColor}
            placeholder={activePreset.colors.heading}
            onChange={(v) => updateTheme({ headingColor: v || undefined })}
          />
          <ColorField
            label="Accent / link color"
            value={theme.accentColor}
            placeholder={activePreset.colors.link}
            onChange={(v) => updateTheme({ accentColor: v || undefined })}
          />
        </div>
      </div>

      {/* ── Typography ────────────────────────────────────────────────── */}
      <div>
        <SectionLabel>Typography</SectionLabel>
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">Font family</label>
            <select
              value={theme.fontFamily ?? 'inter'}
              onChange={(e) => updateTheme({ fontFamily: e.target.value === 'inter' ? undefined : e.target.value })}
              className="h-8 w-full rounded border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:border-blue-400 focus:outline-none"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700">Font size</label>
              <span className="text-xs tabular-nums text-slate-400">
                {((theme.fontScale ?? 1.0) * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min={85}
              max={120}
              step={5}
              value={Math.round((theme.fontScale ?? 1.0) * 100)}
              onChange={(e) => {
                const val = Number(e.target.value) / 100
                updateTheme({ fontScale: val === 1.0 ? undefined : val })
              }}
              className="w-full accent-blue-600"
            />
            <div className="mt-0.5 flex justify-between text-[10px] text-slate-400">
              <span>Compact</span>
              <span>Normal</span>
              <span>Large</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Spacing ────────────────────────────────────────────────────── */}
      <div>
        <SectionLabel>Spacing</SectionLabel>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-medium text-slate-700">Density</label>
            <span className="text-xs tabular-nums text-slate-400">
              {((theme.spacingDensity ?? 1.0) * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min={75}
            max={125}
            step={5}
            value={Math.round((theme.spacingDensity ?? 1.0) * 100)}
            onChange={(e) => {
              const val = Number(e.target.value) / 100
              updateTheme({ spacingDensity: val === 1.0 ? undefined : val })
            }}
            className="w-full accent-blue-600"
          />
          <div className="mt-0.5 flex justify-between text-[10px] text-slate-400">
            <span>Tight</span>
            <span>Balanced</span>
            <span>Airy</span>
          </div>
        </div>
      </div>

      {/* ── Reset ─────────────────────────────────────────────────────── */}
      {(theme.primaryColor || theme.headingColor || theme.accentColor || theme.fontFamily || theme.fontScale || theme.spacingDensity) && (
        <button
          type="button"
          onClick={() => updateTheme({
            primaryColor: undefined,
            headingColor: undefined,
            accentColor: undefined,
            fontFamily: undefined,
            fontScale: undefined,
            spacingDensity: undefined,
          })}
          className="text-xs text-slate-400 hover:text-slate-600 underline"
        >
          Reset all overrides to preset defaults
        </button>
      )}
    </div>
  )
}
