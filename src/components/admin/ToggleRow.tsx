"use client";

import { Switch } from '@/components/ui/switch'
import React from 'react'


export default function ToggleRow({
  label,
  description,
  onCheckedChange,
}: {
  label: string
  description: string
  onCheckedChange?: (checked: boolean) => void | Promise<void>
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch onCheckedChange={onCheckedChange} />
    </div>
  )
}