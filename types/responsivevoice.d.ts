declare global {
  interface Window {
    responsiveVoice: {
      speak: (
        text: string,
        voice: string,
        options?: {
          volume?: number;
          rate?: number;
          pitch?: number;
          onstart?: () => void;
          onend?: () => void;
          onerror?: (error: string) => void;
        }
      ) => void;
    };
  }
}

export {};
