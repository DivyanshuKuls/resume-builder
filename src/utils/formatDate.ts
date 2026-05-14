export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const [year, month] = dateStr.split('-')
  if (!year) return ''
  if (!month) return year
  const date = new Date(parseInt(year), parseInt(month) - 1, 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function formatDateRange(start: string, end: string, current: boolean): string {
  const startFormatted = formatDate(start)
  const endFormatted = current ? 'Present' : formatDate(end)
  if (!startFormatted) return endFormatted
  if (!endFormatted) return startFormatted
  return `${startFormatted} – ${endFormatted}`
}
