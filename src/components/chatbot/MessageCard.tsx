import { Card } from "@/components/ui/card"

interface MessageCardProps {
  message: string
  isUserMessage?: boolean
}

export function MessageCard({ message, isUserMessage = false }: MessageCardProps) {
  return (
    <Card className={`p-4 w-fit ${isUserMessage ? "bg-blue-500 ml-auto text-white" : "bg-muted"}`}>
      <p className="text-sm">{message}</p>
    </Card>
  )
} 