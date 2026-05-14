import type { PersonalInfo } from '@/types/resume'

interface PreviewHeaderProps {
  personalInfo: PersonalInfo
}

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/)
  const chars =
    parts.length >= 2 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : (parts[0]?.[0] ?? '?')
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-600"
      style={{ width: 68, height: 68, fontSize: 22 }}
    >
      {chars.toUpperCase()}
    </div>
  )
}

function Avatar({ personalInfo }: { personalInfo: PersonalInfo }) {
  const { photo, fullName, photoAlignment } = personalInfo
  if (photoAlignment === 'none') return null
  if (photo) {
    return (
      <img
        src={photo}
        alt={fullName}
        className="shrink-0 rounded-full object-cover"
        style={{ width: 68, height: 68, border: '1.5px solid #e2e8f0' }}
      />
    )
  }
  if (fullName) return <Initials name={fullName} />
  return null
}

export function PreviewHeader({ personalInfo }: PreviewHeaderProps) {
  const { fullName, jobTitle, photoAlignment } = personalInfo
  if (!fullName && !jobTitle) return null

  const nameBlock = (
    <div className="min-w-0 flex-1">
      {fullName && (
        <h1
          className="font-bold leading-none text-slate-900"
          style={{ fontSize: 28, letterSpacing: '-0.5px' }}
        >
          {fullName}
        </h1>
      )}
      {jobTitle && (
        <p className="mt-1.5 font-normal text-slate-500" style={{ fontSize: 13 }}>
          {jobTitle}
        </p>
      )}
    </div>
  )

  // photo-right: name first, then avatar
  if (photoAlignment === 'right') {
    return (
      <div className="flex items-center gap-5 pb-4">
        {nameBlock}
        <Avatar personalInfo={personalInfo} />
      </div>
    )
  }

  // photo-left (default) or no photo
  return (
    <div className="flex items-center gap-5 pb-4">
      <Avatar personalInfo={personalInfo} />
      {nameBlock}
    </div>
  )
}
