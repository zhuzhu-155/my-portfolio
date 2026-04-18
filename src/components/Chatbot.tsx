import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, User, Bot, Loader2, X, Minimize2, Maximize2 } from "lucide-react";
import { chatWithGemini, models } from "@/src/lib/gemini";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "model";
  content: string;
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", content: "Hi! I'm your AI Marketing Consultant. How can I help you refine your campaign today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatWithGemini([...messages, userMessage], models.pro);
      setMessages(prev => [...prev, { role: "model", content: response || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "model", content: "Error: Failed to connect to AI service." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4"
          >
            <Card className="w-[380px] h-[500px] flex flex-col shadow-2xl border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-primary text-primary-foreground rounded-t-lg">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  Marketing Consultant
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => setIsOpen(false)}
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0">
                <div className="h-full p-4 overflow-y-auto" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex gap-3 text-sm",
                          msg.role === "user" ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                          msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                          {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={cn(
                          "p-3 rounded-2xl max-w-[80%]",
                          msg.role === "user" 
                            ? "bg-primary text-primary-foreground rounded-tr-none" 
                            : "bg-muted rounded-tl-none"
                        )}>
                          <div className="prose prose-xs dark:prose-invert">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-muted p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-xs text-muted-foreground">Thinking...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-3 border-t">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex w-full items-center space-x-2"
                >
                  <Input
                    placeholder="Ask for suggestions..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="lg"
        className={cn(
          "rounded-full h-14 w-14 shadow-xl transition-all duration-300",
          isOpen ? "rotate-90 scale-0" : "rotate-0 scale-100"
        )}
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    </div>
  );
}
