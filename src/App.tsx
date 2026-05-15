import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { AppLayout } from '@/components/layout/AppLayout'
import { AppHeader } from '@/components/layout/AppHeader'
import { EditorPanel } from '@/editor/EditorPanel'
import { PreviewPanel } from '@/preview/PreviewPanel'
import { Toaster } from '@/components/ui/Toaster'
import { useResume } from '@/hooks/useResume'

export default function App() {
  const resume = useResume()
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: resume.personalInfo.fullName
      ? `${resume.personalInfo.fullName} – Resume`
      : 'Resume',
  })

  return (
    <>
      <AppLayout
        header={<AppHeader onPrint={() => handlePrint()} />}
        editor={<EditorPanel />}
        preview={<PreviewPanel ref={printRef} onPrint={() => handlePrint()} />}
      />
      <Toaster />
    </>
  )
}
