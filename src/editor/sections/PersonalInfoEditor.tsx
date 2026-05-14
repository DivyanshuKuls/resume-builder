import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Camera, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useResumeStore } from '@/store/resumeStore'
import { cn } from '@/utils/cn'
import type { PersonalInfo, PhotoAlignment } from '@/types/resume'

const ALIGNMENT_OPTIONS: { value: PhotoAlignment; label: string }[] = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'none', label: 'No photo' },
]

export function PersonalInfoEditor() {
  const { resume, updatePersonalInfo, updatePhoto } = useResumeStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, watch, reset } = useForm<Pick<PersonalInfo, 'fullName' | 'jobTitle'>>({
    defaultValues: {
      fullName: resume.personalInfo.fullName,
      jobTitle: resume.personalInfo.jobTitle,
    },
  })

  useEffect(() => {
    reset({
      fullName: resume.personalInfo.fullName,
      jobTitle: resume.personalInfo.jobTitle,
    })
  }, [resume.id, reset])

  const fullName = watch('fullName')
  const jobTitle = watch('jobTitle')

  useEffect(() => {
    const timer = setTimeout(() => updatePersonalInfo({ fullName, jobTitle }), 200)
    return () => clearTimeout(timer)
  }, [fullName, jobTitle, updatePersonalInfo])

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') updatePhoto(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  function removePhoto() {
    updatePhoto('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">Personal Information</h2>
        <p className="mt-0.5 text-xs text-slate-500">Name, headline, and profile photo</p>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" placeholder="e.g. Alex Johnson" {...register('fullName')} />
        </div>

        <div>
          <Label htmlFor="jobTitle">Job Title / Headline</Label>
          <Input
            id="jobTitle"
            placeholder="e.g. Senior Software Engineer"
            {...register('jobTitle')}
          />
        </div>
      </div>

      {/* Photo upload */}
      <div>
        <Label className="mb-2">Profile Photo</Label>
        <div className="flex items-center gap-4">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50">
            {resume.personalInfo.photo ? (
              <>
                <img
                  src={resume.personalInfo.photo}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </>
            ) : (
              <Camera className="h-6 w-6 text-slate-400" />
            )}
          </div>
          <div className="space-y-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              {resume.personalInfo.photo ? 'Change Photo' : 'Upload Photo'}
            </Button>
            <p className="text-xs text-slate-400">JPG, PNG or WEBP · Max 2MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>
        </div>
      </div>

      {/* Photo alignment */}
      {resume.personalInfo.photo && (
        <div>
          <Label className="mb-2">Photo Position</Label>
          <div className="flex gap-2">
            {ALIGNMENT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => updatePersonalInfo({ photoAlignment: opt.value })}
                className={cn(
                  'flex-1 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
                  resume.personalInfo.photoAlignment === opt.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-300 text-slate-600 hover:border-slate-400',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
