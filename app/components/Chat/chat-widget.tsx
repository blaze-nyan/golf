"use client";
import getAiResponse from "@/app/lib/getAiResponse";
import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Maximize, Minimize, Send } from "lucide-react";
import { Button } from "@heroui/button";

interface ChatMessage {
  type: "user" | "bot";
  content: string;
}

const quickReplies = [
  "Sendible features & plans",
  "I'm already a customer",
  "Request a demo",
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  const removeAsterisks = (str: string) => {
    return str.replace(/\*/g, "");
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = { type: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const aiResponse = await getAiResponse(inputMessage);
      const responseText = aiResponse[0]?.text;
      const finalText = responseText
        ? removeAsterisks(responseText)
        : "I'm sorry, I couldn't understand that.";

      const botMessage: ChatMessage = { type: "bot", content: finalText };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        { type: "bot", content: "Error retrieving response. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickmessage = (reply: string) => {
    setInputMessage(reply);
    handleSendMessage();
    console.log("hello");
  };

  if (!isClient) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div
          ref={chatBoxRef}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-black/30 flex flex-col resize overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-200 ${
            isMaximized
              ? "fixed inset-0 m-0 rounded-none w-full h-full"
              : "max-w-full max-h-[90vh]"
          }`}
          style={{
            width: isMaximized ? "100%" : `${size.width}px`,
            height: isMaximized ? "100%" : `${size.height}px`,
          }}
        >
          {/* Header */}
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-100 dark:bg-gray-800">
            <h3 className="font-medium text-gray-800 dark:text-gray-100">
              Golf Assistant
            </h3>
            <div className="flex gap-2">
              {/* Maximize/Minimize Toggle */}
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                {isMaximized ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.length === 0 ? (
              <div className="text-start mt-4">
                <p className="p-2 rounded-lg max-w-[85%] bg-gray-200 text-gray-800">
                  Hey 👋 Got any questions?
                </p>
                <p className="text-sm mt-2 p-2 rounded-lg max-w-[85%] bg-gray-200 text-gray-800">
                  I'll be glad to assist! What can I help you with?
                </p>
                <div className="mt-6 space-y-2">
                  {quickReplies.map((reply, index) => (
                    <Button
                      key={index}
                      onPress={() => quickmessage(reply)}
                      className="block border-solid border-2 border-orange-500 text-left bg-white hover:bg-orange-100 text-orange-800 py-2 px-3 rounded-md"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-2 sm:p-3 rounded-lg max-w-[85%] ${
                      message.type === "user"
                        ? "bg-green-600 dark:bg-green-700 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {message.type === "bot"
                      ? message.content.split(" ").map((word, idx) => {
                          const isUrl =
                            word.startsWith("http://") ||
                            word.startsWith("https://");
                          return isUrl ? (
                            <a
                              key={idx}
                              href={word}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 dark:text-blue-400 hover:underline"
                            >
                              {word}{" "}
                            </a>
                          ) : (
                            word + " "
                          );
                        })
                      : message.content}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                disabled={isLoading}
              />
              <Button
                onPress={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="px-4 py-2 text-white rounded-lg bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button onPress={() => setIsOpen(true)} className="text-white p-3 rounded-full shadow-lg bg-green-600">
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
