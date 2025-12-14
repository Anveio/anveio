'use client'

import type { FC } from 'react'

export interface DemoPlaceholderProps {
  message: string
}

export const DemoPlaceholder: FC<DemoPlaceholderProps> = ({ message }) => {
  return (
    <div className="rounded-lg border border-dashed border-neutral-400 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
      <strong>Demo Placeholder</strong>
      <p>{message}</p>
    </div>
  )
}

export default DemoPlaceholder
