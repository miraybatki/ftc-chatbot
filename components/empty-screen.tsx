import { ExternalLink } from '@/components/external-link'

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">
          Welcome to FTC Chatbot!
        </h1>
        <p className="leading-normal text-muted-foreground">
          This chatbot has been developed by {' '}
          <ExternalLink href="https://frc9483.com">
            FRC Team 9483
          </ExternalLink>{' '} with the aim of assisting
          FTC teams. It is designed to provide guidance and support to help teams
          succeed in their competitions and projects.
        </p>
      </div>
    </div>
  )
}
