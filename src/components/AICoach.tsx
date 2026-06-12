import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Bot, Send, User, Sparkles, AlertTriangle } from 'lucide-react';

interface AICoachProps {
  chatHistory: ChatMessage[];
  onSendMessage: (messageText: string) => Promise<void>;
  isSending: boolean;
  errorMessage?: string;
  onClearChat: () => void;
}

export default function AICoach({
  chatHistory,
  onSendMessage,
  isSending,
  errorMessage,
  onClearChat,
}: AICoachProps) {
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Preset questions from Somali lifestyle/fitness
  const presetQuestions = [
    "Maxaan ku bedeli karaa boorashka?",
    "Sida caloosha loo dhaafo si degdeg ah?",
    "Isticmaalka Protein-ka (Borotiinka) ma khatar baa?"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isSending) {
      onSendMessage(inputText.trim());
      setInputText("");
    }
  };

  const handlePresetClick = (question: string) => {
    if (!isSending) {
      onSendMessage(question);
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isSending]);

  return (
    <section className="bg-surface-card p-6 md:p-8 rounded-xl border border-border-subtle shadow-xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-container/[0.02] to-transparent pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row gap-8 relative z-10">
        
        {/* Left Column: Info & Presets */}
        <div className="md:w-1/3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-container/15 rounded-xl border border-primary-container/30">
                <Bot className="text-primary-container h-6 w-6" />
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-text-primary">Kheyre Fit AI</h2>
            </div>
            
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              Weydii macalinkaaga caqliyeed su'aal kasta oo ku saabsan cuntada Soomaalida siday tahay iyo jimicsiyada kugu habboon.
            </p>
          </div>

          <div className="space-y-2 mt-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">Su'aalo Fudud (Presets)</p>
            {presetQuestions.map((question, i) => (
              <button
                key={i}
                disabled={isSending}
                onClick={() => handlePresetClick(question)}
                className="w-full text-left p-3 text-xs bg-surface-input hover:bg-surface-container-high hover:border-primary-container/40 rounded-lg border border-border-subtle transition-all duration-150 text-on-background hover:text-text-primary cursor-pointer disabled:opacity-50 font-medium"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Active Chat Sandbox */}
        <div className="md:w-2/3 flex flex-col bg-surface-container-low/50 backdrop-blur-md border border-border-subtle rounded-xl min-h-[350px]">
          
          {/* Messages Log */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[320px] min-h-[250px]">
            
            {/* Initial model welcome */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0 border border-primary-container/20">
                <Bot className="text-on-primary h-4.5 w-4.5" />
              </div>
              <div className="bg-surface-input px-4 py-3 rounded-2xl rounded-tl-none border border-border-subtle max-w-[85%] shadow-sm">
                <p className="text-xs text-on-surface leading-relaxed">
                  Nabad ma ku wehelisaa! Waxaan ahay macalinkaaga Kheyre Fit AI. Maxaan kaaga caawiyaa cuntada Soomaalida, dhisidda murqaha ama dhimista baruurta maanta?
                </p>
              </div>
            </div>

            {/* Render history */}
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
              >
                {msg.role !== 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0 border border-primary-container/20">
                    <Bot className="text-on-primary h-4.5 w-4.5" />
                  </div>
                )}
                
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[85%] border shadow-sm text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary-container/15 border-primary-container/30 text-text-primary rounded-tr-none'
                      : 'bg-surface-input border-border-subtle text-on-surface rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-surface-input border border-border-subtle flex items-center justify-center shrink-0">
                    <User className="text-text-secondary h-4.5 w-4.5" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing simulation loading indicator */}
            {isSending && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0 border border-primary-container/20">
                  <Bot className="text-on-primary h-4.5 w-4.5 animate-pulse" />
                </div>
                <div className="bg-surface-input px-4 py-3 rounded-2xl rounded-tl-none border border-border-subtle">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-primary-container rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-primary-container rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-primary-container rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Error notifications */}
            {errorMessage && (
              <div className="bg-error-red/10 border border-error-red/20 text-error-red p-3 rounded-lg text-xs flex gap-2 items-start">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Khalad ayaa dhacay</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Form input controls */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-border-subtle bg-surface-container-high/40 rounded-b-xl flex gap-3">
            <input
              type="text"
              disabled={isSending}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="I weydii su'aal ku saabsan jimicsiga ama cuntada..."
              className="flex-1 bg-surface-input border border-border-subtle rounded-xl px-4 py-2.5 text-xs text-on-background focus:outline-none focus:border-primary-container transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="bg-primary-container hover:bg-amber-400 text-on-primary p-2.5 rounded-xl active:scale-95 transition-all text-xs cursor-pointer flex items-center justify-center shrink-0 disabled:opacity-50 disabled:scale-100"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>

        </div>
      </div>
    </section>
  );
}
