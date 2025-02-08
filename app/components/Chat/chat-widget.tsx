// app/components/Chat/ChatWidget.tsx
"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@heroui/button";

interface ChatMessage {
  type: "user" | "bot";
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      type: "user",
      content: inputMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Here you would integrate with your AI service
    // For now, just echo back
    const botMessage: ChatMessage = {
      type: "bot",
      content: `Thanks for your message: ${inputMessage}`,
    };

    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-medium">Golf Assistant</h3>
            <button onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.type === "user"
                    ? "ml-auto bg-primary text-white"
                    : "mr-auto bg-gray-100"
                } p-2 rounded-lg max-w-[80%]`}
              >
                {message.content}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
              />
              <Button
                onPress={handleSendMessage}
                className="px-4 py-2 text-white rounded-lg"
                color="primary"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button
          onPress={() => setIsOpen(true)}
          className=" text-white p-3 rounded-full shadow-lg  transition-colors"
          color="primary"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
