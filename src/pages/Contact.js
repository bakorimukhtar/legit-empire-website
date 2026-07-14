import React, { useEffect, useMemo, useState } from "react";
import "./Contact.css";
import SEO from "../components/SEO";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, CheckCircle, X, AlertTriangle } from "lucide-react";

// Admin API origin (no trailing slash)
// - For local-to-live API testing: "https://admin.legitempirerealestate.com"
// - For local-to-local XAMPP testing: "http://localhost/Legit%20Empire/public"
const ADMIN_ORIGIN = "https://admin.legitempirerealestate.com";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    interest: "buy",
    budgetRange: "",
    message: "",
    projectId: "", // Optional / Nullable
  });

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalState, setModalState] = useState({
    type: "success",
    title: "",
    message: "",
  });

  const projectOptions = useMemo(() => {
    return projects.map((p) => ({
      id: String(p.id),
      label: p.label || `${p.name}${p.location ? ` — ${p.location}` : ""}`,
    }));
  }, [projects]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Load published projects for selection dropdown
  useEffect(() => {
    let alive = true;

    async function loadProjects() {
      setProjectsLoading(true);
      setProjectsError("");

      try {
        const url = new URL("/api/website/get.php", ADMIN_ORIGIN);
        const res = await fetch(url.toString(), { method: "GET" });
        const data = await res.json();

        if (!res.ok || !data?.ok) throw new Error(data?.message || "Could not load projects.");

        const rows = Array.isArray(data.projects) ? data.projects : [];
        if (!alive) return;

        setProjects(rows);
      } catch (err) {
        if (!alive) return;
        setProjects([]);
        setProjectsError(String(err?.message || "Could not load projects."));
      } finally {
        if (!alive) return;
        setProjectsLoading(false);
      }
    }

    loadProjects();
    return () => {
      alive = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic input validation
      if (!formData.fullName.trim()) throw new Error("Full name is required.");
      if (!formData.phone.trim()) throw new Error("Phone number is required.");
      if (!formData.message.trim()) throw new Error("Message is required.");

      const url = new URL("/api/website/create.php", ADMIN_ORIGIN);

      // Populate FormData for PHP $_POST
      const fd = new FormData();
      fd.append("full_name", formData.fullName.trim());
      fd.append("email", formData.email.trim());
      fd.append("phone", formData.phone.trim());
      fd.append("interest", formData.interest);
      fd.append("budget_range", formData.budgetRange || "");
      fd.append("message", formData.message.trim());
      if (formData.projectId) {
        fd.append("project_id", formData.projectId);
      }
      fd.append("source", "website"); // Lead origin

      const res = await fetch(url.toString(), {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.message || "Could not submit inquiry.");

      setModalState({
        type: "success",
        title: "Message Sent Successfully",
        message: "Thank you for reaching out to Legit Empire! We have received your inquiry. A member of our team will review details and contact you within 24 business hours.",
      });
      setShowModal(true);

      // Reset form (keeping selected project for nice UX)
      setFormData((prev) => ({
        fullName: "",
        email: "",
        phone: "",
        interest: "buy",
        budgetRange: "",
        message: "",
        projectId: prev.projectId || "",
      }));
    } catch (err) {
      setModalState({
        type: "error",
        title: "Failed to Send Message",
        message: String(err?.message || "Please try again."),
      });
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <motion.div className="contact-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SEO
        title="Contact Legit Empire | Schedule a Guided Property Inspection"
        description="Talk to our real estate advisory team. Send an inquiry or schedule an on-site property inspection in Abuja, Lagos, or Kaduna."
        keywords="contact legit empire, real estate contact nigeria, property inspection abuja, legit empire telephone"
      />
      {/* HERO */}
      <section className="contact-hero">
        <motion.div
          className="contact-hero-content"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="contact-pill">Contact Legit Empire</span>
          <h1>Let’s talk about your next property move.</h1>
          <p>
            Share a few details and the team will reach out with curated opportunities that match your goals, whether you are buying a home,
            investing, or partnering on a development.
          </p>
          <div className="contact-hero-meta">
            <div>
              <span className="meta-label">Response time</span>
              <span className="meta-value">Within 24 business hours</span>
            </div>
            <div>
              <span className="meta-label">Service areas</span>
              <span className="meta-value">Abuja • Lagos • Kaduna</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="contact-hero-card"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
        >
          <div className="hero-card-heading">
            <span>Talk to our team</span>
          </div>
          <div className="hero-card-item">
            <div className="hero-card-icon">
              <Phone size={18} />
            </div>
            <div>
              <p className="hero-card-label">Call</p>
              <a href="tel:+2348132161510" className="hero-card-value">
                +234 813 216 1510
              </a>
            </div>
          </div>
          <div className="hero-card-item">
            <div className="hero-card-icon">
              <Mail size={18} />
            </div>
            <div>
              <p className="hero-card-label">Email</p>
              <a href="mailto:info@legitempirerealestate.com" className="hero-card-value">
                info@legitempirerealestate.com
              </a>
            </div>
          </div>
          <div className="hero-card-item">
            <div className="hero-card-icon">
              <MapPin size={18} />
            </div>
            <div>
              <p className="hero-card-label">Head office</p>
              <p className="hero-card-value">
                Plot 74. Wing B, 3rd floor, Ogun State House, Ralgh Sodeinde St., Abuja.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FORM + INFO SECTION */}
      <section className="contact-body">
        <div className="contact-layout">
          {/* LEFT: FORM */}
          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="form-row-2">
              <div className="form-group">
                <label>Full name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Mobile number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+234..."
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Estate / location (optional)</label>
                <select
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  disabled={projectsLoading}
                >
                  <option value="">
                    {projectsLoading ? "Loading estates…" : "Select an estate/location"}
                  </option>

                  {projectOptions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>

                {projectsError ? (
                  <p className="disclaimer" style={{ color: "#b42318" }}>
                    Could not load estates: {projectsError}
                  </p>
                ) : null}
              </div>

              <div className="form-group">
                <label>Preferred budget range (₦) (optional)</label>
                <select name="budgetRange" value={formData.budgetRange} onChange={handleChange}>
                  <option value="">Select an option</option>
                  <option value="under-30m">Under ₦30m</option>
                  <option value="30-80m">₦30m – ₦80m</option>
                  <option value="80-150m">₦80m – ₦150m</option>
                  <option value="150m-plus">₦150m and above</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>What are you interested in?</label>
              <div className="pill-options">
                <button
                  type="button"
                  className={`pill-btn ${formData.interest === "buy" ? "active" : ""}`}
                  onClick={() => setFormData((prev) => ({ ...prev, interest: "buy" }))}
                >
                  Buying a home
                </button>
                <button
                  type="button"
                  className={`pill-btn ${formData.interest === "invest" ? "active" : ""}`}
                  onClick={() => setFormData((prev) => ({ ...prev, interest: "invest" }))}
                >
                  Investing
                </button>
                <button
                  type="button"
                  className={`pill-btn ${formData.interest === "partnership" ? "active" : ""}`}
                  onClick={() => setFormData((prev) => ({ ...prev, interest: "partnership" }))}
                >
                  Development partnership
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>How can we help?</label>
              <textarea
                name="message"
                rows="4"
                placeholder="Share any extra details that help us serve you better."
                required
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting || projectsLoading}>
              {isSubmitting ? "Sending..." : "Send message"}
            </button>

            <p className="disclaimer">
              By submitting this form you agree to be contacted by Legit Empire via phone, email, or WhatsApp regarding your request.
            </p>
          </motion.form>

          {/* RIGHT: SIDE INFO */}
          <motion.div
            className="contact-side-panel"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.04 }}
          >
            <h3>Prefer to speak directly?</h3>
            <p>For time‑sensitive transactions or site visits, you can reach the team on call or WhatsApp during business hours.</p>
            <div className="side-highlight">
              <span>Mon – Sat</span>
              <span>9:00am – 6:00pm (WAT)</span>
            </div>

            <ul className="micro-faq">
              <li>
                <strong>How soon can I get a call back?</strong>
                <span>Usually within one business day, depending on the project and enquiry volume.</span>
              </li>
              <li>
                <strong>Can you arrange an on‑site inspection?</strong>
                <span>Yes. Share your preferred date and city and the team will coordinate viewing logistics.</span>
              </li>
              <li>
                <strong>Do you work with overseas buyers?</strong>
                <span>Absolutely. We support diaspora clients with secure remote documentation and virtual tours.</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="modal-card contact-modal-card"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <button className="close-modal-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>

              <div
                className="modal-icon success-icon"
                style={{
                  background: modalState.type === "success" ? "#dcfce7" : "#fee2e2",
                  color: modalState.type === "success" ? "#16a34a" : "#b42318",
                }}
              >
                {modalState.type === "success" ? <CheckCircle size={46} /> : <AlertTriangle size={46} />}
              </div>

              <h2>{modalState.title}</h2>
              <p>{modalState.message}</p>

              <button className="modal-action-btn" onClick={closeModal}>
                Back to site
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Contact;