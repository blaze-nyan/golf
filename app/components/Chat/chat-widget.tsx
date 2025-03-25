"use client";
import getAiResponse from "@/app/lib/getAiResponse";
import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Maximize,
  Minimize,
  Send,
  Mic,
  MicOff,
  Loader,
  Info,
} from "lucide-react";
import { Button } from "@heroui/button";
import { logger } from "@/app/lib/logger";

interface ChatMessage {
  type: "user" | "bot";
  content: string;
  audioUrl?: string;
}

const quickReplies = [
  "Sendible features & plans",
  "I'm already a customer",
  "Request a demo",
];

// Fixed demo phrase that will always be used for voice input
const DEMO_VOICE_PHRASE = "Hello, I'd like to know about membership options.";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const size = { width: 320, height: 480 };

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [showDemoTooltip, setShowDemoTooltip] = useState(false);

  // Audio playback
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsClient(true);

    // Create audio element for playback
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();
    }
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
      return "If you're feeling hungry after your game, check out our food and beverage offerings here: https://ta-golf.netlify.app/f&b Trust me, you won't want to miss it!";
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

    // Booking-related questions
    if (
      lowerQuestion.includes("book") ||
      lowerQuestion.includes("reservation") ||
      lowerQuestion.includes("tee time") ||
      lowerQuestion.includes("schedule")
    ) {
      return "To book a tee time, please visit our online booking system at https://ta-golf.netlify.app/auth/login to login and then go to https://ta-golf.netlify.app/golfcourse to book your tee time. You'll be able to see real-time availability.";
    }

    // Hello or greeting
    if (
      lowerQuestion.includes("hello") ||
      lowerQuestion.includes("hi") ||
      lowerQuestion.includes("hey") ||
      lowerQuestion.includes("greetings")
    ) {
      return "Hello there! How can I assist you with your golfing plans today?";
    }

    return null;
  };

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

  const removeAsterisks = (str: string) => {
    return str.replace(/\*/g, "");
  };

  // Generate text-to-speech for bot responses
  const textToSpeech = async (text: string): Promise<string> => {
    if ("speechSynthesis" in window) {
      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Try to get voices
        let voices = window.speechSynthesis.getVoices();

        // If voices array is empty, wait for them to load
        if (voices.length === 0) {
          window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            // Try to find a female English voice
            utterance.voice =
              voices.find(
                (voice) =>
                  voice.lang.includes("en") &&
                  (voice.name.includes("Female") ||
                    voice.name.includes("Google") ||
                    voice.name.includes("Samantha"))
              ) || null;

            // Start speech synthesis
            window.speechSynthesis.speak(utterance);
          };
        } else {
          // Try to find a female English voice
          utterance.voice =
            voices.find(
              (voice) =>
                voice.lang.includes("en") &&
                (voice.name.includes("Female") ||
                  voice.name.includes("Google") ||
                  voice.name.includes("Samantha"))
            ) || null;

          // Start speech synthesis
          window.speechSynthesis.speak(utterance);
        }

        // Resolve with a dummy URL since we're using browser's TTS
        resolve("browser-tts://response");
      });
    } else {
      return Promise.resolve("");
    }
  };

  // Play audio for a message
  const playMessageAudio = (audioUrl: string) => {
    if (!audioUrl) return;

    if (audioUrl.startsWith("browser-tts://")) {
      // Already handled by the browser's TTS
      return;
    }

    // For external audio URLs
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch((err) => {
        logger.error("Error playing audio:", err);
      });
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    await processUserMessage(inputMessage);
  };

  // Process a user message (either typed or from voice)
  const processUserMessage = async (message: string) => {
    // Add user message to chat
    const userMessage: ChatMessage = { type: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setIsProcessingVoice(false);

    const responsePlaceholder = getResponsePlaceholder(message);

    if (responsePlaceholder) {
      const processedResponse =
        removeAsterisks(responsePlaceholder) ||
        "I'm sorry, I couldn't understand that.";

      // Generate TTS for the response
      const audioUrl = await textToSpeech(processedResponse);

      const botMessage: ChatMessage = {
        type: "bot",
        content: processedResponse,
        audioUrl,
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
        // Play the response audio
        playMessageAudio(audioUrl);
      }, 1000);

      return;
    }

    try {
      const aiResponse = await getAiResponse(message);
      const responseText = aiResponse[0]?.text;
      const finalText = responseText
        ? removeAsterisks(responseText)
        : "I'm sorry, I couldn't understand that.";

      // Generate TTS for the AI response
      const audioUrl = await textToSpeech(finalText);

      const botMessage: ChatMessage = {
        type: "bot",
        content: finalText,
        audioUrl,
      };

      setMessages((prev) => [...prev, botMessage]);

      // Play the response audio
      playMessageAudio(audioUrl);
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
  };

  // Simulated voice recording for demo
  const startRecording = async () => {
    setIsRecording(true);

    // Show demo message if first time using voice
    if (
      messages.length === 0 ||
      !messages.some(
        (m) => m.type === "user" && m.content === DEMO_VOICE_PHRASE
      )
    ) {
      setShowDemoTooltip(true);
      setTimeout(() => setShowDemoTooltip(false), 5000);
    }

    // Simulate recording for 2 seconds
    setTimeout(() => {
      stopRecording();
    }, 2000);
  };

  // Stop simulated recording
  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessingVoice(true);

    // Process demo phrase after a short delay
    setTimeout(() => {
      processUserMessage(DEMO_VOICE_PHRASE);
    }, 1000);
  };

  // Toggle voice recording
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
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
                  I&apos;ll be glad to assist! You can type or speak your
                  question.
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
                    <div>
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

                    {/* Play button for bot messages with audio */}
                    {message.type === "bot" && message.audioUrl && (
                      <button
                        onClick={() => playMessageAudio(message.audioUrl || "")}
                        className="mt-1 text-xs text-blue-500 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Play voice
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Demo tooltip - shown when voice button is first clicked */}
            {showDemoTooltip && (
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 p-2 rounded-lg text-sm flex items-start gap-2 mb-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Demo Voice Feature:</strong> For this demo, we&apos;ll
                  simulate that you said: &quot;{DEMO_VOICE_PHRASE}&quot;
                </div>
              </div>
            )}

            {/* Recording or loading indicator */}
            {(isRecording || isProcessingVoice || isLoading) && (
              <div className="flex justify-center items-center">
                <div
                  className={`px-4 py-2 ${
                    isRecording
                      ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                      : isProcessingVoice
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                      : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                  } rounded-full animate-pulse flex items-center gap-2`}
                >
                  {isRecording ? (
                    <>
                      <span className="h-2 w-2 bg-red-500 rounded-full"></span>
                      Listening... (Demo)
                    </>
                  ) : isProcessingVoice ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Processing voice... (Demo)
                    </>
                  ) : (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Thinking...
                    </>
                  )}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={isRecording ? "Listening..." : "Type a message..."}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                disabled={isLoading || isRecording || isProcessingVoice}
              />

              {/* Voice Input Button with Demo indicator */}
              <Button
                onPress={toggleRecording}
                disabled={isLoading || isProcessingVoice}
                className={`rounded-lg transition-colors relative ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                <div className="flex flex-col items-center px-2 py-1">
                  {isRecording ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <>
                      <Mic className="h-5 w-5" />
                      <span className="text-[9px] -mt-0.5">DEMO</span>
                    </>
                  )}
                </div>
              </Button>

              {/* Send Button */}
              <Button
                onPress={handleSendMessage}
                disabled={
                  isLoading ||
                  isRecording ||
                  isProcessingVoice ||
                  !inputMessage.trim()
                }
                className="px-4 py-2 text-white rounded-lg bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button
          onPress={() => setIsOpen(true)}
          className="text-white p-3 rounded-full shadow-lg bg-green-600"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
