import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Send, Bot, User } from "lucide-react";

// Subcomponent for typewriter effect
const TypewriterText = ({ text }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            setDisplayedText(text.substring(0, i + 1));
            i++;
            if (i >= text.length) {
                clearInterval(timer);
            }
        }, 20); // typing speed
        return () => clearInterval(timer);
    }, [text]);

    return <span>{displayedText}</span>;
};

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { text: "Hello 👋 How can I help you today?", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        if (!input.trim() || isTyping) return;

        const userMessage = { text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        setTimeout(() => {
            const botMessage = {
                text: "This is a demo reply 🤖. I am answering your query with an animated typing effect!",
                sender: "bot"
            };
            setMessages((prev) => [...prev, botMessage]);
            setIsTyping(false);
        }, 1200); // delay before bot responds
    };

    return (
        <div className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">

            {/* Header */}
            <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-teal-700 to-indigo-700 text-transparent bg-clip-text">
                    Chat Support
                </h1>
                <p className="text-gray-500 mt-2 text-sm">
                    Ask anything. We're here to help.
                </p>
            </motion.div>

            {/* Chat Card — slides in from top */}
            <motion.div
                initial={{ opacity: 0, y: -60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
                <Card className="flex flex-col h-[75vh] p-4 rounded-2xl shadow-lg bg-white/70 backdrop-blur-xl dark:bg-gray-800/80">

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 p-2">
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={msg.sender === "bot" ? { opacity: 0, y: -20 } : { opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : ""}`}
                            >
                                {msg.sender === "bot" && (
                                    <div className="p-2 rounded-full bg-teal-100 dark:bg-teal-900 flex-shrink-0">
                                        <Bot className="w-5 h-5 text-teal-600" />
                                    </div>
                                )}

                                <div
                                    className={`px-4 py-2 rounded-2xl max-w-xs text-sm shadow ${msg.sender === "user"
                                        ? "bg-teal-600 text-white rounded-tr-none"
                                        : "bg-gray-100 dark:bg-gray-700 dark:text-white rounded-tl-none"
                                        }`}
                                >
                                    {msg.sender === "bot" ? <TypewriterText text={msg.text} /> : msg.text}
                                </div>

                                {msg.sender === "user" && (
                                    <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900 flex-shrink-0">
                                        <User className="w-5 h-5 text-indigo-600" />
                                    </div>
                                )}
                            </motion.div>
                        ))}

                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="flex items-start gap-3"
                            >
                                <div className="p-2 rounded-full bg-teal-100 dark:bg-teal-900 flex-shrink-0">
                                    <Bot className="w-5 h-5 text-teal-600" />
                                </div>
                                <div className="px-4 py-3 rounded-2xl max-w-xs text-sm shadow bg-gray-100 dark:bg-gray-700 dark:text-white rounded-tl-none flex items-center gap-1">
                                    <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}></motion.div>
                                    <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}></motion.div>
                                    <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}></motion.div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="flex items-center gap-2 mt-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition"
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            disabled={isTyping}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isTyping || !input.trim()}
                            className="p-3 bg-gradient-to-r from-teal-600 to-indigo-600 text-white rounded-xl shadow hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default Chatbot;