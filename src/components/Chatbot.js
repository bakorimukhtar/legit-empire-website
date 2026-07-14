// src/components/Chatbot.js
import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import {
  MessageCircle,
  X,
  Send,
  User,
  PhoneCall,
  Info,
  Calendar,
  MapPin,
  AlertCircle,
  Building,
  Mail
} from "lucide-react";

const ADMIN_ORIGIN = "https://admin.legitempirerealestate.com";
const SUPPORT_NUMBER = "+234 813 216 1510";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [projects, setProjects] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Conversational state variables
  const [currentStep, setCurrentStep] = useState("ASK_NAME");
  const [flow, setFlow] = useState("welcome");
  
  // Collected client data
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Abuja");
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [guests, setGuests] = useState("1");
  const [notes, setNotes] = useState("");
  const [msgText, setMsgText] = useState("");

  const messagesEndRef = useRef(null);

  const fallbackProjects = [
    { id: 1, name: "Empire Residences Phase 1", location: "Gwarinpa, Abuja" },
    { id: 2, name: "Empire Residences Phase 2", location: "Gwarinpa, Abuja" },
    { id: 3, name: "Empire Smart City", location: "Gosa, Airport Road, Abuja" },
    { id: 4, name: "Empire Courtyard", location: "Gwarinpa, Abuja" }
  ];

  // Fetch projects from database when chat opens
  useEffect(() => {
    if (!isOpen) return;
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${ADMIN_ORIGIN}/api/website/get.php`, {
          headers: { Accept: "application/json" },
        });
        const data = await res.json();
        if (data?.ok && Array.isArray(data.projects)) {
          if (alive) {
            setProjects(data.projects);
          }
        } else if (alive) {
          setProjects(fallbackProjects);
        }
      } catch (err) {
        console.warn("Chatbot project list fetch failed, using fallbacks:", err);
        if (alive) {
          setProjects(fallbackProjects);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [isOpen]);

  // Initialize welcome message with typing simulation
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      const t1 = setTimeout(() => {
        setMessages([
          {
            id: "w1",
            sender: "bot",
            text: "Hello! Welcome to Legit Empire.",
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);
        
        const t2 = setTimeout(() => {
          setIsTyping(true);
          const t3 = setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                id: "w2",
                sender: "bot",
                text: "Could you please tell me your full name so I know who I am speaking with?",
                timestamp: new Date(),
              },
            ]);
            setIsTyping(false);
          }, 1000);
          return () => clearTimeout(t3);
        }, 600);
        return () => clearTimeout(t2);
      }, 1000);
      return () => clearTimeout(t1);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to latest bubble
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addUserMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: "user",
        text,
        timestamp: new Date(),
      },
    ]);
  };

  const addBotMessage = (text, componentType) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: "bot",
        text,
        componentType,
        timestamp: new Date(),
      },
    ]);
  };

  // Queue bot response with typing delay simulation
  const queueBotResponse = (text, componentType, delay = 1200) => {
    setIsTyping(true);
    setTimeout(() => {
      addBotMessage(text, componentType);
      setIsTyping(false);
    }, delay);
  };

  // Check if a message block is still active for user input
  const isInteractiveActive = (msgId) => {
    if (isTyping) return false;
    if (messages.length === 0) return false;
    return messages[messages.length - 1].id === msgId;
  };

  // Flow options chooser buttons
  const renderFlowButtons = (msgId) => {
    const active = isInteractiveActive(msgId);
    return (
      <div className="flex flex-col gap-2 mt-2 w-full">
        <button
          disabled={!active}
          onClick={() => handleOptionSelect("inspection", "Book a Site Inspection")}
          className="chatbot-flow-option-btn"
        >
          <Calendar size={14} />
          Book a Site Inspection
        </button>
        <button
          disabled={!active}
          onClick={() => handleOptionSelect("message", "Send a Contact Message")}
          className="chatbot-flow-option-btn"
        >
          <Mail size={14} />
          Send a Contact Message
        </button>
      </div>
    );
  };

  // Date and Time picker bubble
  const DateTimePicker = ({ msgId }) => {
    const active = isInteractiveActive(msgId);
    const [d, setD] = useState(visitDate);
    const [t, setT] = useState(visitTime);

    return (
      <div className="chatbot-datetime-card mt-2">
        <div className="chatbot-datetime-inputs">
          <div className="chatbot-input-group">
            <label>Date</label>
            <input
              type="date"
              disabled={!active}
              value={d}
              onChange={(e) => setD(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="chatbot-input-group">
            <label>Time</label>
            <input
              type="time"
              disabled={!active}
              value={t}
              onChange={(e) => setT(e.target.value)}
            />
          </div>
        </div>
        <button
          disabled={!active || !d || !t}
          onClick={() => {
            addUserMessage(`Date: ${d}, Time: ${t}`);
            setVisitDate(d);
            setVisitTime(t);
            setCurrentStep("ASK_PROJECT");
            queueBotResponse("Which of our available estates/projects would you like to inspect?", "PROJECT_PICKER");
          }}
          className="chatbot-card-submit-btn"
        >
          <Calendar size={14} />
          Confirm Date & Time
        </button>
      </div>
    );
  };

  // Estate project picker list
  const renderProjectButtons = (msgId) => {
    const active = isInteractiveActive(msgId);
    if (projects.length === 0) {
      return (
        <div className="chatbot-error-card mt-2">
          <div className="chatbot-error-title">
            <AlertCircle size={14} />
            <span>No properties available</span>
          </div>
          <div>We could not load any active developments. Please restart or contact support.</div>
        </div>
      );
    }

    return (
      <div className="chatbot-projects-container mt-2">
        {projects.map((proj) => (
          <button
            key={proj.id}
            disabled={!active}
            onClick={() => {
              addUserMessage(`Estate: ${proj.name}`);
              setSelectedProjectId(String(proj.id));
              setSelectedProjectName(proj.name);
              setCurrentStep("ASK_GUESTS");
              queueBotResponse("How many guests will be accompanying you for the inspection?", "GUESTS_PICKER");
            }}
            className="chatbot-project-btn"
          >
            <strong className="chatbot-project-name">{proj.name}</strong>
            <span className="chatbot-project-loc">
              <MapPin size={10} /> {proj.location}
            </span>
          </button>
        ))}
      </div>
    );
  };

  // Guests size buttons
  const renderGuestsButtons = (msgId) => {
    const active = isInteractiveActive(msgId);
    return (
      <div className="chatbot-chips-row mt-2">
        {["1", "2", "3", "4+"].map((g) => (
          <button
            key={g}
            disabled={!active}
            onClick={() => {
              addUserMessage(`${g} guest${g !== "1" ? "s" : ""}`);
              setGuests(g);
              setCurrentStep("ASK_NOTES");
              queueBotResponse("Do you have any notes or additional details for our team?", "NOTES_PICKER");
            }}
            className="chatbot-chip-btn"
          >
            {g} {g !== "4+" ? "Guest" : "Guests"}
          </button>
        ))}
      </div>
    );
  };

  // Skip notes button
  const renderNotesButtons = (msgId) => {
    const active = isInteractiveActive(msgId);
    return (
      <div className="chatbot-chips-row mt-2">
        <button
          disabled={!active}
          onClick={() => {
            addUserMessage("No notes");
            setNotes("None");
            setCurrentStep("CONFIRM_INSPECTION");
            queueBotResponse("Excellent! Please review your site inspection details below:", "CONFIRM_INSPECTION");
          }}
          className="chatbot-chip-btn"
        >
          <X size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
          No notes (Skip)
        </button>
      </div>
    );
  };

  // City selector quick chip
  const renderCityButtons = (msgId) => {
    const active = isInteractiveActive(msgId);
    return (
      <div className="chatbot-chips-row mt-2">
        <button
          disabled={!active}
          onClick={() => {
            addUserMessage("Abuja");
            setCity("Abuja");
            setCurrentStep("ASK_DATETIME");
            queueBotResponse("Please select your preferred date and time for the inspection:", "DATETIME_PICKER");
          }}
          className="chatbot-chip-btn"
        >
          <MapPin size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
          Abuja
        </button>
      </div>
    );
  };

  // Complete / Restart button
  const renderCompleteButton = (msgId) => {
    const active = isInteractiveActive(msgId);
    return (
      <div className="chatbot-chips-row mt-1">
        <button
          disabled={!active}
          onClick={() => handleReset()}
          className="chatbot-chip-btn"
          style={{ background: "var(--ink-soft)", color: "var(--paper)" }}
        >
          Start New Chat
        </button>
      </div>
    );
  };

  // Retry booking / message buttons
  const renderRetryCard = (type, msgId) => {
    const active = isInteractiveActive(msgId);
    return (
      <div className="chatbot-chips-row mt-2">
        <button
          disabled={!active}
          onClick={() => type === "inspection" ? submitInspection() : submitMessage()}
          className="chatbot-chip-btn"
        >
          Retry
        </button>
        <button
          disabled={!active}
          onClick={() => handleReset()}
          className="chatbot-chip-btn"
          style={{ background: "none", color: "var(--ink)" }}
        >
          Start Over
        </button>
      </div>
    );
  };

  // Summary Review card before submitting
  const renderConfirmCard = (type, msgId) => {
    const isInspection = type === "inspection";
    const active = isInteractiveActive(msgId);
    return (
      <div className="chatbot-confirm-card mt-2">
        <h5 className="chatbot-confirm-title">
          {isInspection ? <Calendar size={14} /> : <Info size={14} />}
          {isInspection ? "Site Inspection Review" : "Message Details"}
        </h5>
        <div className="chatbot-confirm-details">
          <div className="chatbot-confirm-row"><span className="chatbot-confirm-label">Name:</span> <span className="chatbot-confirm-val">{name}</span></div>
          <div className="chatbot-confirm-row"><span className="chatbot-confirm-label">Phone:</span> <span className="chatbot-confirm-val">{phone}</span></div>
          <div className="chatbot-confirm-row"><span className="chatbot-confirm-label">Email:</span> <span className="chatbot-confirm-val">{email}</span></div>
          {isInspection ? (
            <>
              <div className="chatbot-confirm-row"><span className="chatbot-confirm-label">City:</span> <span className="chatbot-confirm-val">{city}</span></div>
              <div className="chatbot-confirm-row"><span className="chatbot-confirm-label">Estate:</span> <span className="chatbot-confirm-val">{selectedProjectName}</span></div>
              <div className="chatbot-confirm-row"><span className="chatbot-confirm-label">Date/Time:</span> <span className="chatbot-confirm-val">{visitDate} at {visitTime}</span></div>
              <div className="chatbot-confirm-row"><span className="chatbot-confirm-label">Guests:</span> <span className="chatbot-confirm-val">{guests}</span></div>
              <div className="chatbot-confirm-row"><span className="chatbot-confirm-label">Notes:</span> <span className="chatbot-confirm-val">{notes}</span></div>
            </>
          ) : (
            <div style={{ marginTop: "8px", borderTop: "1px solid var(--line)", paddingTop: "8px" }}>
              <span className="chatbot-confirm-label" style={{ display: "block", marginBottom: "4px" }}>Message:</span>
              <p className="chatbot-confirm-msgbox">{msgText}</p>
            </div>
          )}
        </div>
        {active && (
          <div className="chatbot-confirm-actions">
            <button
              onClick={() => handleReset()}
              className="btn btn-secondary"
              style={{ padding: "8px 12px", fontSize: "11px", minHeight: "auto" }}
            >
              Start Over
            </button>
            <button
              onClick={() => isInspection ? submitInspection() : submitMessage()}
              className="btn btn-primary"
              style={{ padding: "8px 12px", fontSize: "11px", minHeight: "auto", justifyContent: "center" }}
            >
              {isInspection ? "Confirm & Book" : "Send Message"}
            </button>
          </div>
        )}
      </div>
    );
  };

  // Submit Site Inspection to PHP Backend
  const submitInspection = async () => {
    setCurrentStep("SUBMITTING_INSPECTION");
    const loadingId = "l-insp";
    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        sender: "bot",
        text: "Scheduling your inspection on our server... Please wait...",
        timestamp: new Date(),
      },
    ]);

    try {
      const fd = new FormData();
      fd.append("full_name", name.trim());
      fd.append("email", email.trim());
      fd.append("phone", phone.trim());
      fd.append("interest", "inspection");
      fd.append("budget_range", "");

      const messageParts = [
        `City for inspection: ${city}`,
        `Number of guests: ${guests}`,
        notes && notes !== "None" ? `Staff Prep Notes: ${notes}` : null,
      ].filter(Boolean);

      fd.append("message", messageParts.join("\n"));
      fd.append("project_id", selectedProjectId);
      fd.append("scheduled_at", `${visitDate}T${visitTime}`);
      fd.append("source", "website");

      const res = await fetch(`${ADMIN_ORIGIN}/api/website/create_appointment.php`, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || "Failed to schedule appointment.");
      }

      setCurrentStep("COMPLETE_INSPECTION");
      setMessages((prev) => prev.filter((m) => m.id !== loadingId));
      setIsTyping(true);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: "bot",
            text: `Appointment successfully scheduled! You will receive a confirmation email shortly. Our sales advisory team will also contact you on WhatsApp/Phone at ${phone}.`,
            componentType: "COMPLETE_BUTTON",
            timestamp: new Date(),
          }
        ]);
        setIsTyping(false);
      }, 1000);

    } catch (err) {
      setCurrentStep("CONFIRM_INSPECTION");
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== loadingId),
        {
          id: Math.random().toString(),
          sender: "bot",
          text: `Error scheduling inspection: ${err.message || "An unexpected error occurred."}`,
          componentType: "RETRY_INSPECTION",
          timestamp: new Date(),
        },
      ]);
    }
  };

  // Submit Message to PHP Backend
  const submitMessage = async () => {
    setCurrentStep("SUBMITTING_MESSAGE");
    const loadingId = "l-msg";
    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        sender: "bot",
        text: "Sending your message to our database... Please wait...",
        timestamp: new Date(),
      },
    ]);

    try {
      const fd = new FormData();
      fd.append("full_name", name.trim());
      fd.append("email", email.trim());
      fd.append("phone", phone.trim());
      fd.append("interest", "general");
      fd.append("budget_range", "");
      fd.append("message", msgText.trim());
      fd.append("source", "chatbot");

      const res = await fetch(`${ADMIN_ORIGIN}/api/website/create.php`, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || "Failed to submit message.");
      }

      setCurrentStep("COMPLETE_MESSAGE");
      setMessages((prev) => prev.filter((m) => m.id !== loadingId));
      setIsTyping(true);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: "bot",
            text: "Message successfully sent! Thank you for contacting Legit Empire. Our sales advisory team will reach out to you shortly.",
            componentType: "COMPLETE_BUTTON",
            timestamp: new Date(),
          }
        ]);
        setIsTyping(false);
      }, 1000);

    } catch (err) {
      setCurrentStep("CONFIRM_MESSAGE");
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== loadingId),
        {
          id: Math.random().toString(),
          sender: "bot",
          text: `Error sending message: ${err.message || "An unexpected error occurred."}`,
          componentType: "RETRY_MESSAGE",
          timestamp: new Date(),
        },
      ]);
    }
  };

  // Reset conversational wizard
  const handleReset = () => {
    setName("");
    setPhone("");
    setEmail("");
    setCity("Abuja");
    setVisitDate("");
    setVisitTime("");
    setSelectedProjectId("");
    setSelectedProjectName("");
    setGuests("1");
    setNotes("");
    setMsgText("");
    setInputValue("");
    setCurrentStep("ASK_NAME");
    setFlow("welcome");
    setMessages([
      {
        id: "w1",
        sender: "bot",
        text: "Hello! Welcome to Legit Empire.",
        timestamp: new Date(),
      },
      {
        id: "w2",
        sender: "bot",
        text: "Could you please tell me your full name so I know who I am speaking with?",
        timestamp: new Date(),
      },
    ]);
  };

  // Process text-input submissions
  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const value = inputValue.trim();
    addUserMessage(value);
    setInputValue("");

    if (currentStep === "ASK_NAME") {
      setName(value);
      setCurrentStep("CHOOSE_FLOW");
      queueBotResponse(`Nice to meet you, ${value}! How can we help you today? Please select an option below:`, "FLOW_CHOOSER");
    } else if (currentStep === "ASK_PHONE") {
      setPhone(value);
      setCurrentStep("ASK_EMAIL");
      queueBotResponse("Got it. What is your email address?");
    } else if (currentStep === "ASK_EMAIL") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        queueBotResponse("That email address format seems invalid. Please enter a valid email address (e.g. name@example.com):");
        return;
      }
      setEmail(value);
      if (flow === "inspection") {
        setCurrentStep("ASK_CITY");
        queueBotResponse("Which city are you looking to inspect properties in?", "CITY_CHOOSER");
      } else {
        setCurrentStep("ASK_MESSAGE");
        queueBotResponse("Great. What message or details would you like to send to our team?");
      }
    } else if (currentStep === "ASK_CITY") {
      setCity(value);
      setCurrentStep("ASK_DATETIME");
      queueBotResponse("Please select your preferred date and time for the inspection:", "DATETIME_PICKER");
    } else if (currentStep === "ASK_NOTES") {
      setNotes(value);
      setCurrentStep("CONFIRM_INSPECTION");
      queueBotResponse("Excellent! Please review your site inspection details below:", "CONFIRM_INSPECTION");
    } else if (currentStep === "ASK_MESSAGE") {
      setMsgText(value);
      setCurrentStep("CONFIRM_MESSAGE");
      queueBotResponse("Please review your contact message details below:", "CONFIRM_MESSAGE");
    }
  };

  // Process option selection buttons
  const handleOptionSelect = (val, label) => {
    addUserMessage(label);
    if (val === "inspection") {
      setFlow("inspection");
      setCurrentStep("ASK_PHONE");
      queueBotResponse("Great! Let's book a site inspection. What is your phone number so we can reach you?");
    } else {
      setFlow("message");
      setCurrentStep("ASK_PHONE");
      queueBotResponse("Sure thing! What is your phone number so we can reach you?");
    }
  };

  const isInputDisabled =
    currentStep === "CHOOSE_FLOW" ||
    currentStep === "ASK_DATETIME" ||
    currentStep === "ASK_PROJECT" ||
    currentStep === "ASK_GUESTS" ||
    currentStep === "CONFIRM_INSPECTION" ||
    currentStep === "CONFIRM_MESSAGE" ||
    currentStep.startsWith("SUBMITTING") ||
    isTyping;

  const getInputPlaceholder = () => {
    if (isTyping) return "Assistant is typing...";
    if (isInputDisabled) return "Please choose an option above...";
    if (currentStep === "ASK_NAME") return "Enter your full name...";
    if (currentStep === "ASK_PHONE") return "Enter your phone number...";
    if (currentStep === "ASK_EMAIL") return "Enter your email address...";
    if (currentStep === "ASK_CITY") return "Enter city name...";
    if (currentStep === "ASK_NOTES") return "Enter additional notes...";
    if (currentStep === "ASK_MESSAGE") return "Enter your message...";
    return "Type a message...";
  };

  const getInputType = () => {
    if (currentStep === "ASK_EMAIL") return "email";
    if (currentStep === "ASK_PHONE") return "tel";
    return "text";
  };

  const handleRestartClick = (e) => {
    e.preventDefault();
    if (window.confirm("Restart chat session?")) {
      handleReset();
    }
  };

  return (
    <div className="chatbot-wrapper">
      
      {/* Conversational Chat Window */}
      <div className={`chatbot-window ${isOpen ? "show" : ""}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-header-avatar">LE</div>
            <div>
              <h4 className="chatbot-header-title">Legit Empire Assistant</h4>
              <div className="chatbot-header-status">
                <span className="chatbot-header-dot" />
                <span>Online | Instant Booking</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="chatbot-header-close"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages Body */}
        <div className="chatbot-messages">
          {messages.map((msg) => {
            const isBot = msg.sender === "bot";
            return (
              <div
                key={msg.id}
                className={`chat-bubble-row ${isBot ? "bot" : "user"}`}
              >
                {/* Avatar Icon */}
                <div className="chat-bubble-avatar">
                  {isBot ? "LE" : "U"}
                </div>

                {/* Message Bubble wrapper */}
                <div className="chat-bubble-content">
                  {/* Text bubble */}
                  {msg.text && (
                    <div className="chat-bubble-text">
                      {msg.text}
                    </div>
                  )}
                  {/* Dynamic interactive components rendering in-cycle */}
                  {msg.componentType === "FLOW_CHOOSER" && renderFlowButtons(msg.id)}
                  {msg.componentType === "CITY_CHOOSER" && renderCityButtons(msg.id)}
                  {msg.componentType === "DATETIME_PICKER" && <DateTimePicker msgId={msg.id} />}
                  {msg.componentType === "PROJECT_PICKER" && renderProjectButtons(msg.id)}
                  {msg.componentType === "GUESTS_PICKER" && renderGuestsButtons(msg.id)}
                  {msg.componentType === "NOTES_PICKER" && renderNotesButtons(msg.id)}
                  {msg.componentType === "CONFIRM_INSPECTION" && renderConfirmCard("inspection", msg.id)}
                  {msg.componentType === "CONFIRM_MESSAGE" && renderConfirmCard("message", msg.id)}
                  {msg.componentType === "RETRY_INSPECTION" && renderRetryCard("inspection", msg.id)}
                  {msg.componentType === "RETRY_MESSAGE" && renderRetryCard("message", msg.id)}
                  {msg.componentType === "COMPLETE_BUTTON" && renderCompleteButton(msg.id)}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="chat-bubble-row bot">
              <div className="chat-bubble-avatar">LE</div>
              <div className="chatbot-typing-bubble">
                <span className="chatbot-typing-dot" />
                <span className="chatbot-typing-dot" />
                <span className="chatbot-typing-dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Form Footer */}
        <form onSubmit={handleSend} className="chatbot-footer-form">
          <input
            type={getInputType()}
            placeholder={getInputPlaceholder()}
            disabled={isInputDisabled}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="chatbot-footer-input"
          />
          <button
            type="submit"
            disabled={isInputDisabled || !inputValue.trim()}
            className="chatbot-footer-send-btn"
            aria-label="Send"
          >
            <Send size={14} />
          </button>
        </form>

        {/* Small Meta Footer */}
        <div className="chatbot-meta-bottom">
          <div className="chatbot-meta-phone">
            <PhoneCall size={12} style={{ color: "#25D366" }} />
            <span>Prefer a call? {SUPPORT_NUMBER}</span>
          </div>
          <button
            onClick={handleRestartClick}
            className="chatbot-meta-restart"
          >
            Restart Assistant
          </button>
        </div>
      </div>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-launcher"
        aria-label="Open support assistant"
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={22} />}
      </button>

    </div>
  );
}
