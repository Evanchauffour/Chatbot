"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { MessageCard } from "./MessageCard";
import { OperationMessageCard } from "./OperationMessageCard";
import OperationsSelection from "./steps/OperationsSelection";
import { useChatbotStore } from "@/store/chatbot.store";
import type { AdditionalOperation } from "@/types/chatbot";

export default function ChatBot() {
  const {
    messages,
    addMessage,
    userMessage,
    addUserMessage,
    isSearchDisabled,
    operationsList,
    setOperationsList,
    setOperationStep,
    operationState,
    selectOperation,
  } = useChatbotStore();

  const [prompt, setPrompt] = useState("");
  const [selectedOpId, setSelectedOpId] = useState<string | null>(null);

  useEffect(() => {
    if (messages.length === 0) {
      addMessage(
        "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
        "general"
      );
    }
  }, [messages.length, addMessage]);

  async function handleSendMessage(message: string) {
    if (!message.trim()) return;
    try {
      const response = await fetch("http://localhost:8000/api/generate-text", {
        method: "POST",
        headers: { "Content-Type": "application/ld+json" },
        credentials: "include",
        body: JSON.stringify({ text: message }),
      });
      const data = await response.json();
      addMessage(data.content, data.type);
      addUserMessage(message);

      if (Array.isArray(data.services) && data.services.length > 0) {
        setOperationsList(data.services as AdditionalOperation[]);
        setSelectedOpId(null);
        setOperationStep("operations_selection");
      }

      setPrompt("");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4">
        {/* 1) On affiche uniquement les général/user ici */}
        {messages.map((msg, idx) =>
          msg.type === "general" ? (
            <div key={msg.id} className="space-y-2">
              <MessageCard message={msg.content} isUserMessage={false} />
              {idx < userMessage.length && (
                <MessageCard
                  message={userMessage[idx].content}
                  isUserMessage={true}
                />
              )}
            </div>
          ) : null
        )}

        {/* 2) On affiche maintenant le message de type "service" */}
        {operationState.step === "operations_selection" &&
          messages
            .filter((m) => m.type === "service")
            .map((m) => (
              <MessageCard
                key={m.id}
                message={m.content}
                isUserMessage={false}
              />
            ))}

        {/* 3) Enfin le composant de sélection */}
        {operationState.step === "operations_selection" ? (
          <OperationsSelection
            operations={operationsList}
            selectedOperationId={selectedOpId}
            onSelect={(op) => setSelectedOpId(op.id)}
            onNext={() => {
              if (!selectedOpId) return;

              const foundOp = operationsList.find((o) => o.id === selectedOpId);
              if (!foundOp) return;

              selectOperation(foundOp);

              setOperationsList([foundOp]);

              setOperationStep("vehicle_selection");
            }}
          />
        ) : (
          /* Quand on n’est plus dans cette étape, on passe à OperationMessageCard */
          messages
            .filter((m) => m.type === "service")
            .map((m) => (
              <OperationMessageCard
                key={m.id}
                message={m.content}
                operationsList={operationsList}
              />
            ))
        )}
      </div>

      <div className="border-t pt-4">
        <div className="flex gap-2">
          <Input
            placeholder="Tapez votre message..."
            className="flex-1"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isSearchDisabled}
          />
          <Button
            size="icon"
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
