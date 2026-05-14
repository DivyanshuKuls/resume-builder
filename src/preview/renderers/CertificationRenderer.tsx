import { formatDate } from '@/utils/formatDate'
import type { RendererProps } from './types'

/** Renders the certifications list. */
export function CertificationRenderer({ resume }: RendererProps) {
  if (resume.certifications.length === 0) return null

  return (
    <div className="space-y-2.5">
      {resume.certifications.map((cert) => (
        <div key={cert.id} className="resume-entry">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-semibold text-slate-900 leading-snug" style={{ fontSize: 12 }}>
              {cert.url ? (
                <a
                  href={cert.url.startsWith('http') ? cert.url : `https://${cert.url}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {cert.name}
                </a>
              ) : (
                cert.name
              )}
            </h3>
            <span className="shrink-0 tabular-nums text-slate-500" style={{ fontSize: 10 }}>
              {formatDate(cert.date)}
              {cert.expiryDate && ` – ${formatDate(cert.expiryDate)}`}
            </span>
          </div>

          {cert.issuer && (
            <p className="mt-0.5 font-medium text-blue-700" style={{ fontSize: 11 }}>
              {cert.issuer}
            </p>
          )}

          {cert.description && (
            <p className="mt-1 leading-relaxed text-slate-600" style={{ fontSize: 11 }}>
              {cert.description}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
