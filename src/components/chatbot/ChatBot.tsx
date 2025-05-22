"use client"

import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { MessageCard } from './MessageCard'
import { OperationMessageCard } from './OperationMessageCard'
import { useChatbotStore } from '@/store/chatbot.store'

export default function ChatBot() {
  const { messages, addMessage, userMessage, addUserMessage, isSearchDisabled } = useChatbotStore()
  
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
      addUserMessage(message)
      setPrompt('')

    } catch (error) {
      console.error("Erreur d'inscription:", error)
    }
  }

  return (
    <div className="flex flex-col gap-4 flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={message.id} className="space-y-4">
              {message.type === 'general' && (
                <MessageCard message={message.content} />
              )}
              {message.type === 'service' && (
                <OperationMessageCard message={message.content} />
              )}
              {index < userMessage.length && (
                <MessageCard message={userMessage[index].content} isUserMessage={true} />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t pt-4">
        <div className="flex gap-2">
          <Input 
            placeholder="Type your message..." 
            className="flex-1"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isSearchDisabled}
          />
          <Button size="icon" onClick={() => handleSendMessage(prompt)} disabled={isSearchDisabled}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
