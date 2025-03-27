declare module "react-speech-recognition" {
  export interface SpeechRecognitionOptions {
    continuous?: boolean;
    language?: string;
  }

  export interface SpeechRecognitionHook {
    transcript: string;
    listening: boolean;
    resetTranscript: () => void;
    browserSupportsSpeechRecognition: boolean;
  }

  export const useSpeechRecognition: () => SpeechRecognitionHook;

  export interface SpeechRecognition {
    startListening: (options?: SpeechRecognitionOptions) => void;
    stopListening: () => void;
  }

  const SpeechRecognition: SpeechRecognition;
  export default SpeechRecognition;
}
