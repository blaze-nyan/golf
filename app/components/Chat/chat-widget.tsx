"use client";
import getAiResponse from '@/app/lib/getAiResponse';
import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Maximize, Minimize } from "lucide-react";
import { Button } from "@heroui/button";

interface ChatMessage {
  type: "user" | "bot";
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 320, height: 480 });
  const isResizing = useRef(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = { type: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    try {
      const aiResponse = await getAiResponse(inputMessage);
      const botMessage: ChatMessage = {
        type: "bot",
        content: aiResponse[0]?.text || "I'm sorry, I couldn't understand that.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [...prev, { type: "bot", content: "Error retrieving response. Please try again." }]);
    }
  };

  const handleResizeMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    isResizing.current = true;

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizing.current) return;

      const newWidth = startWidth + (moveEvent.clientX - startX);
      const newHeight = startHeight + (moveEvent.clientY - startY);
      
      setSize({
        width: Math.max(320, newWidth), // Prevent too small
        height: Math.max(400, newHeight),
      });
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  if (!isClient) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div
          ref={chatBoxRef}
          className={`bg-white rounded-lg shadow-xl flex flex-col resize overflow-hidden ${
            isMaximized ? "fixed inset-0 w-full h-full" : ""
          }`}
          style={{
            width: isMaximized ? "100%" : `${size.width}px`,
            height: isMaximized ? "100%" : `${size.height}px`,
          }}
        >
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center bg-gray-200">
            <h3 className="font-medium">Golf Assistant</h3>
            <div className="flex gap-2">
              {/* Maximize/Minimize Toggle */}
              <button onClick={() => setIsMaximized(!isMaximized)}>
                {isMaximized ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
              <button onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div ref={messagesEndRef} />
                <div className={`p-2 rounded-lg max-w-[80%] ${message.type === "user" ? "bg-green-500 text-white" : "bg-gray-100 text-black"}`}>
                  {message.type === "bot" ? (
                    message.content.split(" ").map((word, idx) => {
                      const isUrl = word.startsWith("http://") || word.startsWith("https://");
                      return isUrl ? (
                        <a key={idx} href={word} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {word}{" "}
                        </a>
                      ) : (
                        word + " "
                      );
                    })
                  ) : (
                    message.content
                  )}
                </div>
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
              <Button onPress={handleSendMessage} className="px-4 py-2 text-white rounded-lg bg-green-600">
                Send
              </Button>
            </div>
          </div>

          {/* Resize Handle */}
          {!isMaximized && (
            <div
              onMouseDown={handleResizeMouseDown}
              className="absolute bottom-0 right-0 w-4 h-4 bg-gray-300 cursor-se-resize"
            />
          )}
        </div>
      ) : (
        <Button onPress={() => setIsOpen(true)} className="text-white p-3 rounded-full shadow-lg transition-colors bg-green-600">
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
