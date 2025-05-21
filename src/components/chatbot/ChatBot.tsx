"use client"

import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { MessageCard } from './MessageCard'
import { OperationMessageCard } from './OperationMessageCard'
import { useChatbotStore } from '@/store/chatbot.store'

export default function ChatBot() {
  const { messages, addMessage } = useChatbotStore()
  console.log(messages);
  
  const [prompt, setPrompt] = useState('')

  useEffect(() => {
    // Message de bienvenue initial
    if (messages.length === 0) {
      addMessage("Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?", 'general')
    }
  }, [])

  async function handleSendMessage(message: string) {
    try {
      const response = await fetch("http://localhost:8000/api/generate-text", {
        method: "POST",
        headers: {
          'Content-Type': 'application/ld+json',
        },
        credentials: 'include',
        body: JSON.stringify({ "text": message }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'inscription")
      }

      const data = await response.json()
      addMessage(data.content, data.type)
      setPrompt('')

    } catch (error) {
      console.error("Erreur d'inscription:", error)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              {message.type === 'general' && (
                <MessageCard message={message.content} />
              )}
              {message.type === 'service' && (
                <OperationMessageCard message={message.content} />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input 
            placeholder="Type your message..." 
            className="flex-1"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button size="icon" onClick={() => handleSendMessage(prompt)}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
