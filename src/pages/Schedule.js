import React, { useEffect, useMemo, useState } from "react";
import "./Schedule.css";
import SEO from "../components/SEO";
import { motion } from "framer-motion";
import {
  CalendarDays,
  MapPin,
  Clock3,
  Users,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const ADMIN_ORIGIN = "https://admin.legitempirerealestate.com";

const fadeUp = {
  initial: { y: 30, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

const Schedule = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "Abuja",
    projectId: "",       // Required dropdown
    visitDate: "",
    visitTime: "",
    guests: "1",
    notes: "",
  });

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const projectOptions = useMemo(() => {
    return (projects || []).map((p) => ({
      id: String(p.id),
      label: String(p.label || p.name || "Unnamed project"),
    }));
  }, [projects]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const closeConfirm = () => setShowConfirm(false);

  function buildScheduledAt(dateStr, timeStr) {
    if (!dateStr || !timeStr) return "";
    return `${dateStr}T${timeStr}`;
  }

  async function readJsonSafe(res) {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Server returned non-JSON (HTTP ${res.status}).`);
    }
  }

  // Load published projects for dropdown selection
  useEffect(() => {
    let alive = true;

    (async () => {
      setProjectsLoading(true);
      setProjectsError("");

      try {
        const url = new URL("/api/website/get.php", ADMIN_ORIGIN);
        const res = await fetch(url.toString(), {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        const data = await readJsonSafe(res);
        if (!res.ok || !data?.ok) throw new Error(data?.message || "Could not load estates.");

        const rows = Array.isArray(data.projects) ? data.projects : [];
        if (!alive) return;

        setProjects(rows);

        // Auto-select first project for better UX
        setFormData((prev) => {
          if (prev.projectId) return prev;
          return rows.length ? { ...prev, projectId: String(rows[0].id) } : prev;
        });
      } catch (err) {
        if (!alive) return;
        setProjects([]);
        setProjectsError(String(err?.message || "Could not load estates."));
      } finally {
        if (!alive) return;
        setProjectsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      if (!formData.fullName.trim()) throw new Error("Full name is required.");
      if (!formData.phone.trim()) throw new Error("Phone number is required.");
      if (!formData.email.trim()) throw new Error("Email address is required.");
      if (!formData.projectId) throw new Error("Estate / location is required.");
      if (!formData.visitDate) throw new Error("Preferred date is required.");
      if (!formData.visitTime) throw new Error("Preferred time is required.");

      const scheduledAt = buildScheduledAt(formData.visitDate, formData.visitTime);
      if (!scheduledAt) throw new Error("Preferred date & time is required.");

      // Specialized public appointments endpoint
      const url = new URL("/api/website/create_appointment.php", ADMIN_ORIGIN);

      const fd = new FormData();
      fd.append("full_name", formData.fullName.trim());
      fd.append("email", formData.email.trim());
      fd.append("phone", formData.phone.trim());
      fd.append("interest", "inspection"); // Hardcoded interest for visits
      fd.append("budget_range", "");

      // Merge city, guests, and prep-notes into the message block
      const messageParts = [
        `City for inspection: ${formData.city}`,
        `Number of guests: ${formData.guests}`,
        formData.notes ? `Staff Prep Notes: ${formData.notes}` : null,
      ].filter(Boolean);

      fd.append("message", messageParts.join("\n"));
      fd.append("project_id", formData.projectId);
      fd.append("scheduled_at", scheduledAt);
      fd.append("source", "website");

      const res = await fetch(url.toString(), {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });

      const data = await readJsonSafe(res);
      if (!res.ok || !data?.ok) throw new Error(data?.message || "Could not submit appointment request.");

      setShowConfirm(true);

      // Reset form (keeping select project for nice UX)
      setFormData((prev) => ({
        fullName: "",
        email: "",
        phone: "",
        city: "Abuja",
        projectId: prev.projectId || "",
        visitDate: "",
        visitTime: "",
        guests: "1",
        notes: "",
      }));
    } catch (err) {
      setSubmitError(String(err?.message || "Something went wrong."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div className="schedule-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SEO
        title="Book a Property Inspection | Legit Empire"
        description="Schedule a private, guided tour of our estates and residences. Coordinated securely by a Legit Empire representative in Abuja, Lagos, or Kaduna."
        keywords="book property tour nigeria, schedule site inspection abuja, legit empire guided visit"
      />
      {/* HERO */}
      <section className="schedule-hero">
        <motion.div
          className="schedule-hero-text"
          initial={fadeUp.initial}
          whileInView={fadeUp.whileInView}
          viewport={fadeUp.viewport}
          transition={fadeUp.transition}
        >
          <span className="schedule-pill">Book a visit</span>
          <h1>Schedule a private tour with Legit Empire.</h1>
          <p>
            Share a few details about your visit and our team will confirm your appointment, send directions, and prepare the right information ahead of time.
          </p>
          <div className="schedule-meta-row">
            <div>
              <span className="meta-label">Available cities</span>
              <span className="meta-value">Abuja • Lagos • Kaduna</span>
            </div>
            <div>
              <span className="meta-label">Typical response</span>
              <span className="meta-value">Within 24 business hours</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="schedule-hero-card"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
        >
          <div className="hero-card-header">
            <CalendarDays size={18} />
            <span>What to expect</span>
          </div>
          <ul className="hero-checklist">
            <li>
              <ShieldCheck size={16} />
              <span>Verified locations and secure gated estates.</span>
            </li>
            <li>
              <Users size={16} />
              <span>Guided tour with a Legit Empire representative.</span>
            </li>
            <li>
              <Clock3 size={16} />
              <span>Average visit time: 45–60 minutes per estate.</span>
            </li>
            <li>
              <MapPin size={16} />
              <span>Clear directions and parking details before arrival.</span>
            </li>
          </ul>
          <p className="hero-footnote">
            After you submit the form, a member of the team will call or email to confirm your time slot.
          </p>
        </motion.div>
      </section>

      {/* FORM + SIDE INFO */}
      <section className="schedule-body">
        <div className="schedule-layout">
          {/* FORM */}
          <motion.form
            className="schedule-form"
            onSubmit={handleSubmit}
            initial={fadeUp.initial}
            whileInView={fadeUp.whileInView}
            viewport={fadeUp.viewport}
            transition={fadeUp.transition}
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

            <div className="form-row-3">
              <div className="form-group">
                <label>City for inspection</label>
                <select name="city" value={formData.city} onChange={handleChange}>
                  <option value="Abuja">Abuja</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Kaduna">Kaduna</option>
                  <option value="Other">Other (specify in notes)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Preferred date</label>
                <input type="date" name="visitDate" required value={formData.visitDate} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Preferred time</label>
                <input type="time" name="visitTime" required value={formData.visitTime} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Estate / location</label>
                <select
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  disabled={projectsLoading}
                  required
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
                  <p className="schedule-disclaimer" style={{ color: "#b42318", marginTop: 8 }}>
                    Could not load estates: {projectsError}
                  </p>
                ) : null}
              </div>

              <div className="form-group">
                <label>Number of guests</label>
                <select name="guests" value={formData.guests} onChange={handleChange}>
                  <option value="1">Just me</option>
                  <option value="2">2 people</option>
                  <option value="3">3 people</option>
                  <option value="4">4+ people</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Anything we should prepare ahead?</label>
              <textarea
                name="notes"
                rows="4"
                placeholder="Share details like budget range, property type, or any accessibility needs."
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>

            {submitError ? (
              <p className="schedule-disclaimer" style={{ color: "#b42318" }}>
                {submitError}
              </p>
            ) : null}

            <button
              type="submit"
              className="schedule-submit-btn"
              disabled={isSubmitting || projectsLoading || !!projectsError}
            >
              {isSubmitting ? "Submitting..." : "Request appointment"}
            </button>

            <p className="schedule-disclaimer">
              Legit Empire will only use your details to coordinate this visit and relevant project updates. You can opt out at any time.
            </p>
          </motion.form>

          {/* SIDE INFO */}
          <motion.aside
            className="schedule-side"
            initial={fadeUp.initial}
            whileInView={fadeUp.whileInView}
            viewport={fadeUp.viewport}
            transition={fadeUp.transition}
          >
            <h3>Your visit, handled safely.</h3>
            <p>Our team follows a clear on‑site protocol so your inspection is smooth, safe, and productive.</p>

            <ul className="side-list">
              <li>
                <span className="side-dot" />
                <div>
                  <strong>Verified staff only.</strong>
                  <p>
                    You will meet with a Legit Empire representative whose details are shared with you ahead of time.
                  </p>
                </div>
              </li>
              <li>
                <span className="side-dot" />
                <div>
                  <strong>Secure access control.</strong>
                  <p>Gated entrances, visitor logs, and coordinated entry with estate security teams.</p>
                </div>
              </li>
              <li>
                <span className="side-dot" />
                <div>
                  <strong>Prepared documentation pack.</strong>
                  <p>Where applicable, we provide layouts, payment plans and title status during or immediately after the visit.</p>
                </div>
              </li>
            </ul>

            <div className="side-footer">
              <span>Need to talk first?</span>
              <Link to="/contact">
                Speak with our team <ArrowRight size={14} />
              </Link>
            </div>
          </motion.aside>
        </div>
      </section>

      {/* CONFIRMATION OVERLAY */}
      {showConfirm && (
        <motion.div
          className="schedule-confirm-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="schedule-confirm-card"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <div className="confirm-icon">
              <CalendarDays size={40} />
            </div>
            <h2>Appointment request received</h2>
            <p>
              Thank you for scheduling a visit with Legit Empire. Our team will review your preferred time and get back to you to confirm the exact slot.
            </p>
            <button className="confirm-btn" onClick={closeConfirm}>
              Back to schedule
            </button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Schedule;