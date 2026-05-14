import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react'
import type { ContactDetails } from '@/types/resume'

interface PreviewContactProps {
  contact: ContactDetails
}

const PLATFORM_SHORT: Record<string, string> = {
  linkedin: 'in',
  github: 'gh',
  twitter: 'tw',
  x: 'x',
  gitlab: 'gl',
}

function contactHref(type: string, value: string): string {
  if (type === 'email') return `mailto:${value}`
  if (type === 'phone') return `tel:${value.replace(/\s+/g, '')}`
  const url = value.startsWith('http') ? value : `https://${value}`
  return url
}

function SocialBadge({ platform }: { platform: string }) {
  const key = platform.toLowerCase()
  const short = PLATFORM_SHORT[key]
  if (short) {
    return (
      <span
        className="inline-flex items-center justify-center rounded bg-slate-200 font-bold leading-none text-slate-600"
        style={{ width: 13, height: 13, fontSize: 7 }}
      >
        {short.toUpperCase()}
      </span>
    )
  }
  return <ExternalLink style={{ width: 10, height: 10 }} />
}

export function PreviewContact({ contact }: PreviewContactProps) {
  type ContactItem = { icon: React.ReactNode; text: string; href: string }

  const mainItems: ContactItem[] = [
    contact.email && {
      icon: <Mail style={{ width: 10, height: 10 }} />,
      text: contact.email,
      href: contactHref('email', contact.email),
    },
    contact.phone && {
      icon: <Phone style={{ width: 10, height: 10 }} />,
      text: contact.phone,
      href: contactHref('phone', contact.phone),
    },
    contact.address && {
      icon: <MapPin style={{ width: 10, height: 10 }} />,
      text: contact.address,
      href: '',
    },
    contact.website && {
      icon: <Globe style={{ width: 10, height: 10 }} />,
      text: contact.website,
      href: contactHref('url', contact.website),
    },
  ].filter(Boolean) as ContactItem[]

  const socialItems = [
    contact.linkedin && { platform: 'linkedin', text: contact.linkedin, href: contactHref('url', contact.linkedin) },
    contact.github && { platform: 'github', text: contact.github, href: contactHref('url', contact.github) },
  ].filter(Boolean) as { platform: string; text: string; href: string }[]

  if (mainItems.length === 0 && socialItems.length === 0) return null

  return (
    <div
      className="flex flex-wrap items-center gap-x-4 gap-y-1 border-y border-slate-200 py-2.5 text-slate-600"
      style={{ fontSize: 10.5 }}
    >
      {mainItems.map((item, i) =>
        item.href ? (
          <a key={i} href={item.href} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            <span className="text-slate-400">{item.icon}</span>
            {item.text}
          </a>
        ) : (
          <span key={i} className="flex items-center gap-1">
            <span className="text-slate-400">{item.icon}</span>
            {item.text}
          </span>
        ),
      )}

      {mainItems.length > 0 && socialItems.length > 0 && (
        <span className="select-none text-slate-300">·</span>
      )}

      {socialItems.map((item, i) => (
        <a key={i} href={item.href} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors">
          <SocialBadge platform={item.platform} />
          {item.text}
        </a>
      ))}
    </div>
  )
}
