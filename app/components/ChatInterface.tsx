"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, User, Volume2, VolumeX, Mic, MicOff } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  contextData: any[];
}

export function ChatInterface({ contextData }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm STAM. Ask me anything about your subscriptions." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const currentText = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput(currentText);
      };

      recognitionRef.current = recognition;
    }
  }, [contextData, messages]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Try Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Stop any current AI speech when user starts talking (Barge-in)
      window.speechSynthesis.cancel();
      // Optional: Clear input if starting fresh? Or append? 
      // User said "start to audio again", implying resume or retry. 
      // Let's keep existing text to allow appending/editing.
      recognitionRef.current.start();
    }
  };

  const speak = (text: string) => {
    if (isMuted || typeof window === 'undefined') return;
    
    // Cancel current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a nice English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.pitch = 1;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (manualInput?: string) => {
    const textToSend = manualInput || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: "user", content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
  
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMsg],
          context: contextData 
        }),
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const aiText = data.content;
      setMessages(prev => [...prev, { role: "assistant", content: aiText }]);
      speak(aiText);

    } catch (e: any) {
      console.error(e);
      const errorMsg = e.message || "Sorry, I'm having trouble connecting right now.";
      setMessages(prev => [...prev, { role: "assistant", content: errorMsg }]);
      speak(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[400px] border-indigo-100 overflow-hidden shadow-lg shadow-indigo-100/50">
      <div className="p-4 border-b border-indigo-50 bg-indigo-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <h3 className="font-semibold text-indigo-900 text-sm">STAM Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
           <button 
                onClick={toggleListening}
                className={cn("transition-colors", isListening ? "text-red-500 animate-pulse" : "text-indigo-400 hover:text-indigo-600")}
                title={isListening ? "Stop Listening" : "Start Voice Input"}
            >
                {isListening ? (
                    <div className="h-4 w-4 bg-current rounded-sm" /> 
                ) : (
                    <Mic className="h-4 w-4" />
                )}
            </button>
            <button 
                onClick={() => setIsMuted(!isMuted)}
                className="text-indigo-400 hover:text-indigo-600 transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "")}>
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center shrink-0", 
              msg.role === "assistant" ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-600"
            )}>
              {msg.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
            </div>
            <div className={cn(
              "rounded-2xl px-4 py-2 max-w-[80%] text-sm leading-relaxed",
              msg.role === "assistant" 
                ? "bg-white border border-slate-100 text-slate-700 shadow-sm rounded-tl-none" 
                : "bg-indigo-600 text-white rounded-tr-none"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
             <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Bot className="h-4 w-4" />
             </div>
             <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                <div className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce" />
                <div className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                <div className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
             </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-white border-t border-slate-100">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <input
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            placeholder={isListening ? "Listening..." : "Ask about your spending..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || loading}
            className="rounded-xl h-10 w-10 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}
