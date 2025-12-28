import React, { useState } from "react";
import "./Contact.css";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, CheckCircle, X, ArrowRight } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    interest: "buy",
    budgetRange: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Contact form submitted:", formData);
      setIsSubmitting(false);
      setShowModal(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        interest: "buy",
        budgetRange: "",
        message: "",
      });
    }, 1500);
  };

  const closeModal = () => setShowModal(false);

  return (
    <motion.div
      className="contact-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
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
            Share a few details and the team will reach out with curated
            opportunities that match your goals, whether you are buying a home,
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
              <a href="tel:+2348100789541" className="hero-card-value">
                +234 810 078 9541
              </a>
            </div>
          </div>
          <div className="hero-card-item">
            <div className="hero-card-icon">
              <Mail size={18} />
            </div>
            <div>
              <p className="hero-card-label">Email</p>
              <a
                href="mailto:info@legitempire.africa"
                className="hero-card-value"
              >
                info@legitempire.africa
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
                Plot 74. Wing B, 3rd floor, Ogun State House, Ralgh Sodeinde
                St., Abuja.
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
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>What are you interested in?</label>
                <div className="pill-options">
                  <button
                    type="button"
                    className={`pill-btn ${
                      formData.interest === "buy" ? "active" : ""
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, interest: "buy" }))
                    }
                  >
                    Buying a home
                  </button>
                  <button
                    type="button"
                    className={`pill-btn ${
                      formData.interest === "invest" ? "active" : ""
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, interest: "invest" }))
                    }
                  >
                    Investing
                  </button>
                  <button
                    type="button"
                    className={`pill-btn ${
                      formData.interest === "partnership" ? "active" : ""
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        interest: "partnership",
                      }))
                    }
                  >
                    Development partnership
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Preferred budget range (₦)</label>
                <select
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleChange}
                >
                  <option value="">Select an option</option>
                  <option value="under-30m">Under ₦30m</option>
                  <option value="30-80m">₦30m – ₦80m</option>
                  <option value="80-150m">₦80m – ₦150m</option>
                  <option value="150m-plus">₦150m and above</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>How can we help?</label>
              <textarea
                name="message"
                rows="4"
                placeholder="Share project name, preferred location, or any details that help us serve you better."
                required
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Submit enquiry"}
            </button>

            <p className="disclaimer">
              By submitting this form you agree to be contacted by Legit Empire
              via phone, email, or WhatsApp regarding your enquiry.
            </p>
          </motion.form>

          {/* RIGHT: SIDE INFO / MICRO FAQ */}
          <motion.div
            className="contact-side-panel"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.04 }}
          >
            <h3>Prefer to speak directly?</h3>
            <p>
              For time‑sensitive transactions or site visits, you can reach the
              team on call or WhatsApp during business hours.
            </p>
            <div className="side-highlight">
              <span>Mon – Sat</span>
              <span>9:00am – 6:00pm (WAT)</span>
            </div>

            <ul className="micro-faq">
              <li>
                <strong>How soon can I get a call back?</strong>
                <span>
                  Usually within one business day, depending on the project and
                  enquiry volume.
                </span>
              </li>
              <li>
                <strong>Can you arrange an on‑site inspection?</strong>
                <span>
                  Yes. Share your preferred date and city and the team will
                  coordinate viewing logistics.
                </span>
              </li>
              <li>
                <strong>Do you work with overseas buyers?</strong>
                <span>
                  Absolutely. We support diaspora clients with secure remote
                  documentation and virtual tours.
                </span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-card contact-modal-card"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <button className="close-modal-btn" onClick={closeModal}>
                <X size={20} />
              </button>
              <div className="modal-icon success-icon">
                <CheckCircle size={46} />
              </div>
              <h2>Enquiry received</h2>
              <p>
                Thank you for contacting Legit Empire. A member of the team will
                review your message and respond with next steps shortly.
              </p>
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
