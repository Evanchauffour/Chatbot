"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { MessageCard } from "./MessageCard";
import { OperationMessageCard } from "./OperationMessageCard";
import { useChatbotStore } from "@/store/chatbot.store";
import { AdditionalOperation } from "@/types/chatbot";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatBot() {
  const {
    messages,
    addMessage,
    userMessage,
    addUserMessage,
    isSearchDisabled,
    setOperationsList,
    setOperationStep,
  } = useChatbotStore();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (messages.length === 0) {
      addMessage(
        "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
        "general"
      );
    }
  }, []);

  async function handleSendMessage(message: string) {
    addUserMessage(message);
    setIsLoading(true);
    setPrompt("");
    try {
      const response = await fetch("http://localhost:8000/api/generate-text", {
        method: "POST",
        headers: { "Content-Type": "application/ld+json" },
        credentials: "include",
        body: JSON.stringify({ text: message }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'inscription");
      const data = await response.json();
      addMessage(data.content, data.type);

      if (Array.isArray(data.services) && data.services.length > 0) {
        setOperationsList(data.services as AdditionalOperation[]);
        setOperationStep("operations_selection");
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="
        relative
        flex flex-col
        h-full overflow-hidden pb-4
      "
    >

      <div className="relative flex-1 overflow-y-auto chat-container py-6">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={message.id} className="space-y-4">
              {message.type === "general" && (
                <MessageCard message={message.content} />
              )}
              {message.type === "service" && (
                <OperationMessageCard message={message.content} />
              )}
              {index < userMessage.length && (
                <MessageCard
                  message={userMessage[index].content}
                  isUserMessage
                />
              )}
            </div>
          ))}
          {isLoading && <Skeleton className="h-10 w-10 rounded-full" />}
        </div>
      </div>

      <div className="relative border-t pt-4 px-6 bg-transparent">
        <div className="flex gap-2">
          <Input
            placeholder="Tapez votre message…"
            className="flex-1 bg-white/80 backdrop-blur-sm"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isSearchDisabled}
          />
          <Button
            size="icon"
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => handleSendMessage(prompt)}
            disabled={isSearchDisabled}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
