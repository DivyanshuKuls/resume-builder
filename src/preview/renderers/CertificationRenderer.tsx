import { formatDate } from '@/utils/formatDate'
import type { RendererProps } from './types'

export function CertificationRenderer({ resume }: RendererProps) {
  if (resume.certifications.length === 0) return null

  return (
    <div className="rt-entry-gap flex flex-col">
      {resume.certifications.map((cert) => (
        <div key={cert.id} className="resume-entry">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="rt-entry-title leading-snug">
              {cert.url ? (
                <a href={cert.url.startsWith('http') ? cert.url : `https://${cert.url}`}>
                  {cert.name}
                </a>
              ) : (
                cert.name
              )}
            </h3>
            <span className="rt-meta shrink-0 tabular-nums">
              {formatDate(cert.date)}
              {cert.expiryDate && ` – ${formatDate(cert.expiryDate)}`}
            </span>
          </div>

          {cert.issuer && (
            <p className="rt-primary mt-0.5">{cert.issuer}</p>
          )}

          {cert.description && (
            <p className="rt-body mt-1 leading-relaxed">{cert.description}</p>
          )}
        </div>
      ))}
    </div>
  )
}
