import { User, Phone, LayoutList, Palette } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useResumeStore } from '@/store/resumeStore'
import type { Resume } from '@/types/resume'

// ── Fixed nav items ───────────────────────────────────────────────────────────

interface FixedNavItem {
  id: string
  label: string
  icon: React.ReactNode
  description: string
}

const TOP_ITEMS: FixedNavItem[] = [
  {
    id: 'personalInfo',
    label: 'Personal',
    icon: <User className="h-4 w-4" />,
    description: 'Name, headline, photo',
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: <Phone className="h-4 w-4" />,
    description: 'Email, phone, links',
  },
]

const BOTTOM_ITEMS: FixedNavItem[] = [
  {
    id: 'sections',
    label: 'Sections',
    icon: <LayoutList className="h-4 w-4" />,
    description: 'Add, reorder, hide',
  },
  {
    id: 'theme',
    label: 'Theme',
    icon: <Palette className="h-4 w-4" />,
    description: 'Colors & fonts',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function hasData(resumeData: Resume, sectionId: string): boolean {
  const sec = resumeData.sections.find((s) => s.id === sectionId)
  if (!sec) return false
  switch (sec.type) {
    case 'summary':        return !!resumeData.summary
    case 'experience':     return resumeData.experience.length > 0
    case 'education':      return resumeData.education.length > 0
    case 'skills':         return resumeData.skills.length > 0 || resumeData.skillGroups.some(g => g.skills.length > 0)
    case 'projects':       return resumeData.projects.length > 0
    case 'certifications': return resumeData.certifications.length > 0
    case 'achievements':   return resumeData.achievements.length > 0
    case 'custom': {
      const cs = resumeData.customSections.find((c) => c.id === sectionId)
      return !!(cs?.content)
    }
    default: return false
  }
}

function hasFixedData(resumeData: Resume, id: string): boolean {
  if (id === 'personalInfo') return !!(resumeData.personalInfo.fullName || resumeData.personalInfo.jobTitle)
  if (id === 'contact') return !!(resumeData.contact.email || resumeData.contact.phone)
  return false
}

// ── NavButton ─────────────────────────────────────────────────────────────────

function NavButton({
  id,
  label,
  description,
  icon,
  isActive,
  filled,
  dimmed,
}: {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  isActive: boolean
  filled: boolean
  dimmed?: boolean
}) {
  const setActiveSection = useResumeStore((s) => s.setActiveSection)

  return (
    <button
      type="button"
      onClick={() => setActiveSection(id)}
      className={cn(
        'group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-all',
        isActive
          ? 'bg-blue-50 text-blue-700'
          : dimmed
            ? 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
      )}
    >
      <span
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-md',
          isActive
            ? 'bg-blue-100 text-blue-600'
            : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200',
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <span className={cn('truncate text-sm font-medium', isActive && 'text-blue-700')}>
            {label}
          </span>
          {filled && (
            <span
              className={cn(
                'h-1.5 w-1.5 shrink-0 rounded-full',
                isActive ? 'bg-blue-500' : 'bg-emerald-400',
              )}
            />
          )}
        </div>
        <p
          className={cn(
            'truncate text-xs leading-tight',
            isActive ? 'text-blue-500' : 'text-slate-400',
          )}
        >
          {description}
        </p>
      </div>
    </button>
  )
}

// ── EditorNav ─────────────────────────────────────────────────────────────────

export function EditorNav() {
  const { resume, activeSection } = useResumeStore()

  const sortedSections = [...resume.sections].sort((a, b) => a.order - b.order)

  return (
    <nav className="flex flex-col gap-0.5 p-2">
      {/* Fixed top */}
      {TOP_ITEMS.map((item) => (
        <NavButton
          key={item.id}
          id={item.id}
          label={item.label}
          description={item.description}
          icon={item.icon}
          isActive={activeSection === item.id}
          filled={hasFixedData(resume, item.id)}
        />
      ))}

      {/* Divider */}
      <div className="mx-3 my-1.5 h-px bg-slate-100" />

      {/* Dynamic sections */}
      {sortedSections.map((sec) => (
        <NavButton
          key={sec.id}
          id={sec.id}
          label={sec.title}
          description={sec.visible ? 'Visible in preview' : 'Hidden'}
          icon={
            <span className="text-[10px] font-bold uppercase text-slate-500">
              {sec.title.slice(0, 2)}
            </span>
          }
          isActive={activeSection === sec.id}
          filled={hasData(resume, sec.id)}
          dimmed={!sec.visible}
        />
      ))}

      {/* Divider */}
      <div className="mx-3 my-1.5 h-px bg-slate-100" />

      {/* Fixed bottom */}
      {BOTTOM_ITEMS.map((item) => (
        <NavButton
          key={item.id}
          id={item.id}
          label={item.label}
          description={item.description}
          icon={item.icon}
          isActive={activeSection === item.id}
          filled={false}
        />
      ))}
    </nav>
  )
}
