"use client";
import getAiResponse from "@/app/lib/getAiResponse";
import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Maximize, Minimize, Send } from "lucide-react";
import { Button } from "@heroui/button";
import { logger } from "@/app/lib/logger";
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
  // const [size, setSize] = useState({ width: 320, height: 480 });
  const size = { width: 320, height: 480 };
  // const isResizing = useRef(false);

  const golfCourseData = {
    name: "Hackathon",
    description:
      "Nestled in the heart of lush greenery, Hackathon Golf Course offers an exceptional golfing experience...",
    numberOfHoles: 18,
    par: 72,
    allowCrossOver: true,
    feeStockId: 0,
    holes: [
      {
        type: "Regular par",
        values: [
          5, 4, 3, 4, 3, 4, 4, 5, 4, 36, 5, 4, 3, 4, 4, 4, 5, 4, 3, 36, 72,
        ],
      },
      {
        type: "Regular distance",
        values: [444, 319, 106, 257, 86, 328, 234, 428, 303],
      },
    ],
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const getResponsePlaceholder = (question: string) => {
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes("hackathon")) {
      if (lowerQuestion.includes("description"))
        return golfCourseData.description;
      if (lowerQuestion.includes("holes"))
        return `Hackathon Golf Course has ${golfCourseData.numberOfHoles} holes.`;
      if (lowerQuestion.includes("par"))
        return `The total par for this course is ${golfCourseData.par}.`;
      if (lowerQuestion.includes("cross over"))
        return golfCourseData.allowCrossOver
          ? "Yes, crossover is allowed."
          : "No, crossover is not allowed.";
      if (lowerQuestion.includes("distance"))
        return `Regular distances for the first few holes: ${golfCourseData.holes[1].values
          .slice(0, 5)
          .join(", ")}...`;
    }

    // Weather response - Always sunny!
    if (lowerQuestion.includes("weather")) {
      return "It is expected to be sunny—perfect for golfing!";
    }

    // Dress code response
    if (
      lowerQuestion.includes("dress code") ||
      lowerQuestion.includes("attire")
    ) {
      return "Golfers are encouraged to wear a collared shirt, golf slacks or shorts, and proper golf shoes. Avoid denim, t-shirts, and sandals.";
    }

    // Food-related question
    if (
      lowerQuestion.includes("food") ||
      lowerQuestion.includes("menu") ||
      lowerQuestion.includes("eat")
    ) {
      return "If you're feeling hungry after your game, check out our food and beverage offerings here: https://ta-golf.netlify.app/f&b Trust me, you won’t want to miss it!";
    }

    // Hotel or places to stay
    if (
      lowerQuestion.includes("hotel") ||
      lowerQuestion.includes("stay") ||
      lowerQuestion.includes("accommodation")
    ) {
      return "Looking for a place to stay? You can explore great hotels near the course here: https://ta-golf.netlify.app/hotel Perfect for a relaxing stay after a day of golf!";
    }

    // Membership-related question
    if (
      lowerQuestion.includes("membership") ||
      lowerQuestion.includes("join") ||
      lowerQuestion.includes("sign up")
    ) {
      return "Interested in becoming a member? You can learn more about our membership options here: https://ta-golf.netlify.app/membership Join us and enjoy exclusive benefits!";
    }

    return null;
  };

  const removeAsterisks = (str: string) => {
    return str.replace(/\*/g, "");
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = { type: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    const responsePlaceholder = getResponsePlaceholder(inputMessage);

    if (responsePlaceholder) {
      const botMessage: ChatMessage = {
        type: "bot",
        content:
          removeAsterisks(responsePlaceholder) ||
          "I'm sorry, I couldn't understand that.",
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      }, 2000); // 1-second delay

      return;
    }

    try {
      const aiResponse = await getAiResponse(inputMessage);
      const responseText = aiResponse[0]?.text;
      const finalText = responseText
        ? removeAsterisks(responseText)
        : "I'm sorry, I couldn't understand that.";

      const botMessage: ChatMessage = { type: "bot", content: finalText };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      logger.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "Error retrieving response. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickmessage = (reply: string) => {
    setInputMessage(reply);
    handleSendMessage();
    logger.log("hello");
  };

  // const handleResizeMouseDown = (event: React.MouseEvent) => {
  //   event.preventDefault();
  //   isResizing.current = true;

  //   const startX = event.clientX;
  //   const startY = event.clientY;
  //   const startWidth = size.width;
  //   const startHeight = size.height;

  //   const handleMouseMove = (moveEvent: MouseEvent) => {
  //     if (!isResizing.current) return;

  //     const newWidth = startWidth + (moveEvent.clientX - startX);
  //     const newHeight = startHeight + (moveEvent.clientY - startY);

  //     setSize({
  //       width: Math.max(300, Math.min(newWidth, window.innerWidth - 40)), // Prevent too small or too large
  //       height: Math.max(400, Math.min(newHeight, window.innerHeight - 40)),
  //     });
  //   };

  //   const handleMouseUp = () => {
  //     isResizing.current = false;
  //     document.removeEventListener("mousemove", handleMouseMove);
  //     document.removeEventListener("mouseup", handleMouseUp);
  //   };

  //   document.addEventListener("mousemove", handleMouseMove);
  //   document.addEventListener("mouseup", handleMouseUp);
  // };

  if (!isClient) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 chat-widget">
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
                  I&apos;ll be glad to assist! What can I help you with?
                </p>
                <div className="mt-6 space-y-2">
                  {quickReplies.map((reply, index) => (
                    <Button
                      key={index}
                      onPress={() => quickmessage(reply)}
                      className="px-2 sm:px-4 py-1 sm:py-2 border border-green-500 text-green-500 dark:border-green-400 dark:text-green-400 text-xs sm:text-sm font-semibold rounded-full shadow-sm bg-transparent"
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

          {/* Resize Handle */}
          {/* {!isMaximized && (
            <div
              onMouseDown={handleResizeMouseDown}
              className="absolute bottom-0 right-0 w-4 h-4 bg-gray-300 dark:bg-gray-600 cursor-se-resize"
            />
          )} */}
        </div>
      ) : (
        <Button
          onPress={() => setIsOpen(true)}
          className="text-white p-3 rounded-full shadow-lg bg-green-600"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
