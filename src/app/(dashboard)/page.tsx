"use client"

import ChatBot from '@/components/chatbot/ChatBot'
import { Button } from '@/components/ui/button';
import { useChatbotStore } from '@/store/chatbot.store';
import { Plus } from 'lucide-react';

export default function Home() {
  const { resetStore } = useChatbotStore()
  return (
    <div className="h-full flex flex-col gap-4 py-4 overflow-hidden">
      <Button className='flex items-center gap-2 w-fit' onClick={() => resetStore()}>
        <Plus className="w-4 h-4" />
        Nouveau chat
      </Button>
      <ChatBot />
    </div>
  );
}
