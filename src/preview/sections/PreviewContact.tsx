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
  return value.startsWith('http') ? value : `https://${value}`
}

function SocialBadge({ platform }: { platform: string }) {
  const key = platform.toLowerCase()
  const short = PLATFORM_SHORT[key]
  if (short) {
    return (
      <span
        className="rt-social-badge inline-flex items-center justify-center rounded font-bold leading-none"
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
    contact.github   && { platform: 'github',   text: contact.github,   href: contactHref('url', contact.github) },
  ].filter(Boolean) as { platform: string; text: string; href: string }[]

  if (mainItems.length === 0 && socialItems.length === 0) return null

  return (
    <div className="rt-contact rt-border-contact flex flex-wrap items-center gap-x-4 gap-y-1 border-y py-2.5">
      {mainItems.map((item, i) =>
        item.href ? (
          <a key={i} href={item.href} className="flex items-center gap-1">
            <span className="rt-icon-muted">{item.icon}</span>
            {item.text}
          </a>
        ) : (
          <span key={i} className="flex items-center gap-1">
            <span className="rt-icon-muted">{item.icon}</span>
            {item.text}
          </span>
        ),
      )}

      {mainItems.length > 0 && socialItems.length > 0 && (
        <span className="rt-icon-muted select-none">·</span>
      )}

      {socialItems.map((item, i) => (
        <a key={i} href={item.href} className="rt-social-link flex items-center gap-1">
          <SocialBadge platform={item.platform} />
          {item.text}
        </a>
      ))}
    </div>
  )
}
