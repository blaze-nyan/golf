"use client";
import getAiResponse from "@/app/lib/getAiResponse";
import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X, Maximize, Minimize, Send, Mic } from "lucide-react";
import { Button } from "@heroui/button";
import { logger } from "@/app/lib/logger";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

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
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const size = { width: 320, height: 480 };

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [hasStartedSpeaking, setHasStartedSpeaking] = useState(false);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        values: [5, 4, 3, 4, 3, 4, 4, 5, 4, 36, 5, 4, 3, 4, 4, 4, 5, 4, 3, 36, 72],
      },
      {
        type: "Regular distance",
        values: [444, 319, 106, 257, 86, 328, 234, 428, 303],
      },
    ],
  };

  const removeAsterisks = (str: string) => {
    return str.replace(/\*/g, "");
  };

  const getResponsePlaceholder = (question: string) => {
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes("hackathon")) {
      if (lowerQuestion.includes("description")) return golfCourseData.description;
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

    if (lowerQuestion.includes("weather")) {
      return "It is expected to be sunny—perfect for golfing!";
    }

    if (lowerQuestion.includes("dress code") || lowerQuestion.includes("attire")) {
      return "Golfers are encouraged to wear a collared shirt, golf slacks or shorts, and proper golf shoes. Avoid denim, t-shirts, and sandals.";
    }

    if (
      lowerQuestion.includes("food") ||
      lowerQuestion.includes("menu") ||
      lowerQuestion.includes("eat")
    ) {
      return "If you're feeling hungry after your game, check out our food and beverage offerings here: https://ta-golf.netlify.app/f&b Trust me, you won’t want to miss it!";
    }

    if (
      lowerQuestion.includes("hotel") ||
      lowerQuestion.includes("stay") ||
      lowerQuestion.includes("accommodation")
    ) {
      return "Looking for a place to stay? You can explore great hotels near the course here: https://ta-golf.netlify.app/hotel Perfect for a relaxing stay after a day of golf!";
    }

    if (
      lowerQuestion.includes("membership") ||
      lowerQuestion.includes("join") ||
      lowerQuestion.includes("sign up")
    ) {
      return "Interested in becoming a member? You can learn more about our membership options here: https://ta-golf.netlify.app/membership Join us and enjoy exclusive benefits!";
    }

    if (
      lowerQuestion.includes("book") ||
      lowerQuestion.includes("tee time") ||
      lowerQuestion.includes("reservation")
    ) {
      // Updated to use plain URLs without Markdown syntax
      return "To book a tee time, please visit https://ta-golf.netlify.app/auth/login to log in, then go to https://ta-golf.netlify.app/golfcourse to make your booking.";
    }

    return null;
  };

  const handleSendMessage = useCallback(async (messageToSend?: string) => {
    const message = messageToSend || inputMessage;
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = { type: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    console.log("Handling message:", message, "Is voice input:", isVoiceInput);

    const responsePlaceholder = getResponsePlaceholder(message);

    if (responsePlaceholder) {
      const botMessageContent =
        removeAsterisks(responsePlaceholder) || "I'm sorry, I couldn't understand that.";
      const botMessage: ChatMessage = { type: "bot", content: botMessageContent };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
      setIsVoiceInput(false);
      return;
    }

    try {
      const aiResponse = await getAiResponse(message);
      const responseText = aiResponse[0]?.text || "I'm sorry, I couldn't understand that.";
      const finalText = removeAsterisks(responseText);
      const botMessage: ChatMessage = { type: "bot", content: finalText };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      logger.error("Error fetching AI response:", error);
      const errorMessage = "Error retrieving response. Please try again.";
      const botMessage: ChatMessage = { type: "bot", content: errorMessage };

      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
      setIsVoiceInput(false);
    }
  }, [inputMessage, isLoading, isVoiceInput]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      logger.error("Speech Recognition API not supported in this browser.");
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "Speech recognition is not supported in this browser. Please type your message instead.",
        },
      ]);
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (listening) {
      if (transcript && !hasStartedSpeaking) {
        setHasStartedSpeaking(true);
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
      }

      if (hasStartedSpeaking && transcript) {
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }

        silenceTimeoutRef.current = setTimeout(() => {
          SpeechRecognition.stopListening();
          setInputMessage(transcript);
          setIsVoiceInput(true);
          if (transcript.trim()) {
            handleSendMessage(transcript);
          }
          resetTranscript();
          setHasStartedSpeaking(false);
        }, 1000); // 2-second silence timeout for quick response
      }
    }

    return () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, [transcript, listening, hasStartedSpeaking, handleSendMessage]);

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setHasStartedSpeaking(false);
      resetTranscript();
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    } else {
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    }
  };

  const quickmessage = (reply: string) => {
    setInputMessage(reply);
    setIsVoiceInput(false);
    handleSendMessage(reply);
  };

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
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-100 dark:bg-gray-800">
            <h3 className="font-medium text-gray-800 dark:text-gray-100">Golf Assistant</h3>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                {isMaximized ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

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
                            word.startsWith("http://") || word.startsWith("https://");
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
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex gap-1 items-center">
              <button
                onClick={toggleListening}
                disabled={isLoading || !browserSupportsSpeechRecognition}
                className={`p-2 rounded-lg transition-colors ${
                  listening
                    ? "bg-blue-600 dark:bg-blue-700 animate-pulse"
                    : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                } text-white`}
              >
                <Mic className={`h-6 w-6 ${listening ? "animate-pulse" : ""}`} />
              </button>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsVoiceInput(false);
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 px-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                disabled={isLoading}
              />
              <button
                onClick={() => {
                  setIsVoiceInput(false);
                  handleSendMessage();
                }}
                disabled={isLoading || !inputMessage.trim()}
                className="p-2 rounded-lg bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors text-white"
              >
                <Send className="h-6 w-6" />
              </button>
            </div>
          </div>
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