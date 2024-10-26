export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col items-center space-y-2">
        <div className="flex justify-center mb-4">
          <img
            src="/revolutionary-dozer.svg"
            alt="Revu Dozer"
            className="w-auto h-24"
          />
        </div>

        <h1 className="text-lg font-semibold text-center">
          Welcome to FTC Chatbot!
        </h1>
        <p className="leading-tight text-muted-foreground text-center">
          This chatbot has been developed by FRC Team 9483 with the aim of 
          assisting FTC teams. It is designed to provide guidance and support 
          to help teams succeed in their competitions and projects.
        </p>
      </div>
    </div>
  )
}
