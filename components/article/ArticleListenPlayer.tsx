"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  isSpeechSynthesisSupported,
  pickSpeechVoice,
  speechTextFromArticle,
  splitIntoSpeechChunks,
} from "@/lib/article-speech";
import { cn } from "@/lib/utils";

interface ArticleListenPlayerProps {
  title: string;
  description: string;
  content: string;
  audioUrl?: string;
  className?: string;
}

type ListenStatus = "idle" | "playing" | "paused";

export function ArticleListenPlayer({
  title,
  description,
  content,
  audioUrl,
  className,
}: ArticleListenPlayerProps) {
  const [supported, setSupported] = useState(false);
  const [status, setStatus] = useState<ListenStatus>("idle");
  const chunksRef = useRef<string[]>([]);
  const chunkIndexRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setSupported(isSpeechSynthesisSupported() || Boolean(audioUrl));
  }, [audioUrl]);

  useEffect(() => {
    if (!isSpeechSynthesisSupported()) return;

    const loadVoices = () => {
      pickSpeechVoice();
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakNextChunk = useCallback(() => {
    const chunks = chunksRef.current;
    if (chunkIndexRef.current >= chunks.length) {
      setStatus("idle");
      chunkIndexRef.current = 0;
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunks[chunkIndexRef.current]);
    const voice = pickSpeechVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = 1;

    utterance.onend = () => {
      chunkIndexRef.current += 1;
      speakNextChunk();
    };

    utterance.onerror = () => {
      setStatus("idle");
      chunkIndexRef.current = 0;
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const startSpeech = useCallback(() => {
    if (!isSpeechSynthesisSupported()) return;

    window.speechSynthesis.cancel();
    const text = speechTextFromArticle({ title, description, content });
    chunksRef.current = splitIntoSpeechChunks(text);
    chunkIndexRef.current = 0;
    setStatus("playing");
    speakNextChunk();
  }, [content, description, speakNextChunk, title]);

  const pauseSpeech = useCallback(() => {
    if (!isSpeechSynthesisSupported()) return;
    window.speechSynthesis.pause();
    setStatus("paused");
  }, []);

  const resumeSpeech = useCallback(() => {
    if (!isSpeechSynthesisSupported()) return;
    window.speechSynthesis.resume();
    setStatus("playing");
  }, []);

  const stopSpeech = useCallback(() => {
    if (isSpeechSynthesisSupported()) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    chunkIndexRef.current = 0;
    setStatus("idle");
  }, []);

  if (!supported) {
    return null;
  }

  if (audioUrl) {
    return (
      <section
        className={cn(
          "rounded-xl border border-[var(--light)] bg-white/90 p-4 sm:p-5 shadow-sm",
          className
        )}
        aria-label="Article audio"
      >
        <div className="font-[family-name:var(--font-label)] text-[10px] uppercase tracking-[0.22em] text-[var(--gold)] mb-2">
          Listen
        </div>
        <p className="text-sm text-[var(--mid)] mb-3">
          Play the audio version of this article.
        </p>
        <audio
          ref={audioRef}
          controls
          preload="none"
          src={audioUrl}
          className="w-full"
          onPlay={() => setStatus("playing")}
          onPause={() => setStatus("paused")}
          onEnded={() => setStatus("idle")}
        >
          Your browser does not support audio playback.
        </audio>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "rounded-xl border border-[var(--light)] bg-white/90 p-4 sm:p-5 shadow-sm",
        className
      )}
      aria-label="Listen to article"
    >
      <div className="font-[family-name:var(--font-label)] text-[10px] uppercase tracking-[0.22em] text-[var(--gold)] mb-2">
        Listen
      </div>
      <p className="text-sm text-[var(--mid)] mb-4">
        Prefer audio? Have this article read aloud in your browser — no download required.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {status === "idle" ? (
          <button
            type="button"
            onClick={startSpeech}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--navy)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--royal)] transition-colors"
          >
            <PlayIcon />
            Listen
          </button>
        ) : null}

        {status === "playing" ? (
          <>
            <button
              type="button"
              onClick={pauseSpeech}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--light)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--navy)] hover:bg-[var(--cream)] transition-colors"
            >
              <PauseIcon />
              Pause
            </button>
            <button
              type="button"
              onClick={stopSpeech}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--light)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--mid)] hover:text-[var(--navy)] transition-colors"
            >
              Stop
            </button>
          </>
        ) : null}

        {status === "paused" ? (
          <>
            <button
              type="button"
              onClick={resumeSpeech}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--navy)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--royal)] transition-colors"
            >
              <PlayIcon />
              Resume
            </button>
            <button
              type="button"
              onClick={stopSpeech}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--light)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--mid)] hover:text-[var(--navy)] transition-colors"
            >
              Stop
            </button>
          </>
        ) : null}
      </div>
    </section>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v14.72a1 1 0 0 0 1.5.86l12.01-7.36a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
    </svg>
  );
}
