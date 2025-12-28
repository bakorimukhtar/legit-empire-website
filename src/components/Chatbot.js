import React, { useState } from "react";
import "./Chatbot.css";
import {
  MessageCircle,
  X,
  Send,
  User,
  PhoneCall,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  // WhatsApp number (without +)
  const supportNumber = "2348100789541";

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const whatsappUrl = `https://wa.me/${supportNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
    setMessage("");
  };

  return (
    <div className="chatbot-container">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-window"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-avatar">
                  <span>LE</span>
                </div>
                <div>
                  <h4>Legit Empire Support</h4>
                  <div className="chat-status-row">
                    <span className="status-dot" />
                    <span className="chat-status-text">Usually replies within a few minutes</span>
                  </div>
                </div>
              </div>
              <button onClick={toggleChat} className="close-chat-btn" aria-label="Close chat">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="chat-body">
              <div className="system-message">
                <div className="avatar-circle">
                  <User size={16} />
                </div>
                <div className="msg-bubble">
                  <p className="msg-title">Hi there 👋</p>
                  <p className="msg-text">
                    Welcome to Legit Empire. Share what you’re looking for and the team will 
                    follow up on WhatsApp with available projects and next steps.
                  </p>
                  <div className="quick-tags">
                    <span className="quick-tag">Book inspection</span>
                    <span className="quick-tag">Request brochure</span>
                    <span className="quick-tag">Talk to sales</span>
                  </div>
                </div>
              </div>

              <div className="chat-note">
                <Info size={14} />
                <span>Conversations continue on WhatsApp so you can keep track easily.</span>
              </div>
            </div>

            {/* Footer */}
            <form className="chat-footer" onSubmit={handleSend}>
              <div className="chat-input-wrap">
                <input
                  type="text"
                  placeholder="Tell us how we can help with your property search..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <button type="submit" className="send-btn" aria-label="Send to WhatsApp">
                <Send size={18} />
              </button>
            </form>

            {/* Optional small bottom bar */}
            <div className="chat-footer-meta">
              <PhoneCall size={14} />
              <span>Prefer a call? +234 810 078 9541</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        className={`chat-toggle-btn ${isOpen ? "open" : ""}`}
        onClick={toggleChat}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Open chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={26} />}
      </motion.button>
    </div>
  );
};

export default Chatbot;
