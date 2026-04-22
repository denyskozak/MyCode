import { useCallback, useEffect, useMemo, useState } from 'react';

export type SpeechState = {
  supported: boolean;
  speaking: boolean;
  paused: boolean;
};

export type UseQuestSpeechReturn = SpeechState & {
  speak: (text: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
};

export function useQuestSpeech(): UseQuestSpeechReturn {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);

  const syncState = useCallback(() => {
    if (!supported) return;
    setSpeaking(window.speechSynthesis.speaking);
    setPaused(window.speechSynthesis.paused);
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  }, [supported]);

  const speak = useCallback(
    (text: string) => {
      if (!supported) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onstart = syncState;
      utterance.onend = syncState;
      utterance.onpause = syncState;
      utterance.onresume = syncState;
      utterance.onerror = syncState;

      window.speechSynthesis.speak(utterance);
      syncState();
    },
    [supported, syncState],
  );

  const pause = useCallback(() => {
    if (!supported || !window.speechSynthesis.speaking) return;
    window.speechSynthesis.pause();
    syncState();
  }, [supported, syncState]);

  const resume = useCallback(() => {
    if (!supported || !window.speechSynthesis.paused) return;
    window.speechSynthesis.resume();
    syncState();
  }, [supported, syncState]);

  useEffect(() => {
    if (!supported) return;
    syncState();
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [supported, syncState]);

  return useMemo(
    () => ({
      supported,
      speaking,
      paused,
      speak,
      pause,
      resume,
      stop,
    }),
    [supported, speaking, paused, speak, pause, resume, stop],
  );
}
