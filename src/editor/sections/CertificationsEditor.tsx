import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '@/store/resumeStore'
import { useUIStore } from '@/store/uiStore'
import { EntryCard } from '@/editor/components/EntryCard'
import { SectionHeader } from '@/editor/components/SectionHeader'
import { EmptyState } from '@/editor/components/EmptyState'
import { SortableEntryList, SortableEntryCard, arrayMove } from '@/editor/components/SortableEntryList'
import { formatDate } from '@/utils/formatDate'
import type { Certification } from '@/types/resume'
import type { SectionEditorProps } from '@/editor/SectionEditor'

const SECTION_KEY = 'certifications'

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

export function CertificationsEditor({ section }: SectionEditorProps) {
  const { resume, addCertification, removeCertification, reorderCertifications } = useResumeStore()
  const { expandedEntry, setExpandedEntry, toggleExpandedEntry } = useUIStore()
  const expandedId = expandedEntry[SECTION_KEY] ?? null

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
    setExpandedEntry(SECTION_KEY, newCert.id)
  }

  return (
    <div>
      <SectionHeader
        title={section.title}
        description="Professional certifications and licences · drag to reorder"
        onAdd={handleAdd}
        addLabel="Add Certification"
      />

      {resume.certifications.length === 0 && (
        <EmptyState message="No certifications yet." action="Add Certification" />
      )}

      <SortableEntryList
        ids={resume.certifications.map((c) => c.id)}
        onReorder={(from, to) =>
          reorderCertifications(arrayMove([...resume.certifications], from, to))
        }
      >
        {resume.certifications.map((cert) => (
          <SortableEntryCard key={cert.id} id={cert.id}>
            {(handleProps) => (
              <EntryCard
                title={cert.name}
                subtitle={cert.issuer}
                meta={formatDate(cert.date)}
                isExpanded={expandedId === cert.id}
                onToggle={() => toggleExpandedEntry(SECTION_KEY, cert.id)}
                onDelete={() => {
                  removeCertification(cert.id)
                  if (expandedId === cert.id) setExpandedEntry(SECTION_KEY, null)
                }}
                dragHandleProps={handleProps}
              >
                <CertEntryForm cert={cert} />
              </EntryCard>
            )}
          </SortableEntryCard>
        ))}
      </SortableEntryList>
    </div>
  )
}
