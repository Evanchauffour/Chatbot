import { Card } from "@/components/ui/card"

interface MessageCardProps {
  message: string
}

export function MessageCard({ message }: MessageCardProps) {
  return (
    <Card className="p-4 max-w-[80%] bg-muted">
      <p className="text-sm">{message}</p>
    </Card>
  )
} 