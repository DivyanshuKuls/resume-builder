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
      className="rt-initials-bg flex shrink-0 items-center justify-center rounded-full font-semibold"
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
        className="rt-avatar-border shrink-0 rounded-full object-cover"
        style={{ width: 68, height: 68, borderWidth: '1.5px', borderStyle: 'solid' }}
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
        <h1 className="rt-name leading-none">{fullName}</h1>
      )}
      {jobTitle && (
        <p className="rt-job-title mt-1.5">{jobTitle}</p>
      )}
    </div>
  )

  if (photoAlignment === 'right') {
    return (
      <div className="flex items-center gap-5 pb-4">
        {nameBlock}
        <Avatar personalInfo={personalInfo} />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-5 pb-4">
      <Avatar personalInfo={personalInfo} />
      {nameBlock}
    </div>
  )
}
