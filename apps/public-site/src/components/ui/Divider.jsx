import React from 'react'
import { cn } from '../../lib/utils'

export default function Divider({ className }) {
  return (
    <hr
      className={cn('border-0 border-t border-zinc-800 my-0', className)}
    />
  )
}
