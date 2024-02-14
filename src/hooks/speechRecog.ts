import { useEffect, useState } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition: unknown;
  }
}

//@ts-expect-error no need to check for window.SpeechRecognition
let recognition: SpeechRecognition | null = null;

if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
  const SpeechRecognition =
    //@ts-expect-error no need to check for window.SpeechRecognition
    window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.interimResults = true;
  recognition.lang = "ko-KR"; // Adjust the language as needed
  recognition.continuous = true;
}

const useSpeechToText = () => {
  const [text, setText] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);

  useEffect(() => {
    if (!recognition) return;

    //@ts-expect-error no need to check for recognition
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        //@ts-expect-error no need to check for event.results
        .map((result) => result[0].transcript)
        .join("");
      setText(transcript);
      // if (event.results[0].isFinal) {
      //   setIsListening(false);
      // }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    //@ts-expect-error no need to check for recognition
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = () => {
    setText("");
    setIsListening(true);
    recognition?.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition?.stop();
  };

  return {
    text,
    startListening,
    stopListening,
    isListening,
    hasRecognitionSupport: !!recognition,
  };
};

export default useSpeechToText;