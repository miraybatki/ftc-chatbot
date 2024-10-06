import React from 'react'

import { cn } from '@/lib/utils'
import { ExternalLink } from './external-link'

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className
      )}
      {...props}
    >
      Developed by {' '}
          <ExternalLink href="https://frc9483.com">
            FRC Team 9483
          </ExternalLink>{' '}
    </p>
  )
}
