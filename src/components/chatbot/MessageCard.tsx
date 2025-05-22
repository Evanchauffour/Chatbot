import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

interface MessageCardProps {
  message: string;
  isUserMessage?: boolean;
}

export function MessageCard({
  message,
  isUserMessage = false,
}: MessageCardProps) {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 w-fit mt-4 ${
        isUserMessage
          ? "bg-blue-500 ml-auto text-white border-none"
          : "bg-muted"
      }`}
    >
      <p className="text-sm">{message}</p>
    </MotionCard>
  );
}
