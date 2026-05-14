import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '@/store/resumeStore'
import { EntryCard } from '@/editor/components/EntryCard'
import { SectionHeader } from '@/editor/components/SectionHeader'
import { formatDate } from '@/utils/formatDate'
import type { Certification } from '@/types/resume'

function CertEntryForm({ cert }: { cert: Certification }) {
  const { updateCertification } = useResumeStore()
  const upd = (data: Partial<Certification>) => updateCertification(cert.id, data)

  return (
    <>
      <div>
        <Label>Certification Name</Label>
        <Input
          value={cert.name}
          placeholder="AWS Solutions Architect"
          onChange={(e) => upd({ name: e.target.value })}
        />
      </div>

      <div>
        <Label>Issuing Organization</Label>
        <Input
          value={cert.issuer}
          placeholder="Amazon Web Services"
          onChange={(e) => upd({ issuer: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Issue Date</Label>
          <Input
            value={cert.date}
            placeholder="YYYY-MM"
            onChange={(e) => upd({ date: e.target.value })}
          />
        </div>
        <div>
          <Label>Expiry Date</Label>
          <Input
            value={cert.expiryDate}
            placeholder="YYYY-MM (optional)"
            onChange={(e) => upd({ expiryDate: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label>Credential URL</Label>
        <Input
          value={cert.url}
          placeholder="https://credly.com/…"
          onChange={(e) => upd({ url: e.target.value })}
        />
      </div>
    </>
  )
}

export function CertificationsEditor() {
  const { resume, addCertification, removeCertification, reorderCertifications } =
    useResumeStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function handleAdd() {
    const newCert: Certification = {
      id: crypto.randomUUID(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      url: '',
      description: '',
    }
    addCertification(newCert)
    setExpandedId(newCert.id)
  }

  function move(index: number, direction: 'up' | 'down') {
    const items = [...resume.certifications]
    const swap = direction === 'up' ? index - 1 : index + 1
    ;[items[index], items[swap]] = [items[swap], items[index]]
    reorderCertifications(items)
  }

  return (
    <div>
      <SectionHeader
        title="Certifications"
        description="Professional certifications and licences"
        onAdd={handleAdd}
        addLabel="Add Certification"
      />

      {resume.certifications.length === 0 && (
        <p className="py-8 text-center text-xs text-slate-400">
          No certifications yet. Click &quot;Add Certification&quot; to get started.
        </p>
      )}

      <div className="space-y-2">
        {resume.certifications.map((cert, i) => (
          <EntryCard
            key={cert.id}
            title={cert.name}
            subtitle={cert.issuer}
            meta={formatDate(cert.date)}
            isExpanded={expandedId === cert.id}
            isFirst={i === 0}
            isLast={i === resume.certifications.length - 1}
            onToggle={() => setExpandedId(expandedId === cert.id ? null : cert.id)}
            onDelete={() => {
              removeCertification(cert.id)
              if (expandedId === cert.id) setExpandedId(null)
            }}
            onMoveUp={() => move(i, 'up')}
            onMoveDown={() => move(i, 'down')}
          >
            <CertEntryForm cert={cert} />
          </EntryCard>
        ))}
      </div>
    </div>
  )
}
