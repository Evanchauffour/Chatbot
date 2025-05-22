import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

const MotionCard = motion(Card)

interface MessageCardProps {
  message: string
  isUserMessage?: boolean
}

export function MessageCard({ message, isUserMessage = false }: MessageCardProps) {
  return (
    <MotionCard 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 w-fit ${isUserMessage ? "bg-blue-500 ml-auto text-white" : "bg-muted"}`}
    >
      <p className="text-sm">{message}</p>
    </MotionCard>
  )
} 