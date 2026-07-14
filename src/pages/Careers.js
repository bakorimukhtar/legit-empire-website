import React, { useState, useEffect, useRef } from "react";
import "./Careers.css";
import SEO from "../components/SEO";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  User,
  FileText,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin,
  TrendingUp,
  Award,
  ChevronRight,
  ChevronLeft,
  ClipboardCheck,
} from "lucide-react";

// Admin API origin (without trailing slash)
const ADMIN_ORIGIN = "https://admin.legitempirerealestate.com";

// The four stages of the application wizard
const STEPS = [
  { key: "position", label: "Position", icon: Briefcase },
  { key: "details", label: "Your Details", icon: User },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "review", label: "Review", icon: ClipboardCheck },
];

const Careers = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loadingVacancies, setLoadingVacancies] = useState(true);
  const [formState, setFormState] = useState({
    careerId: "",
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    cvFile: null,
    cvFileName: "",
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, success: false, message: "" });
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);

  // Fetch open vacancies dynamically from the live API
  useEffect(() => {
    fetch(`${ADMIN_ORIGIN}/api/careers/list.php?view=public`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load vacancies");
        return res.json();
      })
      .then((data) => {
        if (data.ok && data.careers && data.careers.length > 0) {
          setVacancies(data.careers);
        } else {
          setVacancies([]);
        }
        setLoadingVacancies(false);
      })
      .catch((err) => {
        console.error("Error loading careers:", err);
        setVacancies([]);
        setLoadingVacancies(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5242880) {
        setFeedback({
          show: true,
          success: false,
          message: "File size exceeds the 5MB limit. Please upload a lighter document.",
        });
        return;
      }
      setFormState((prev) => ({
        ...prev,
        cvFile: file,
        cvFileName: file.name,
      }));
      setFeedback({ show: false, success: false, message: "" });
    }
  };

  const selectedJob = vacancies.find((v) => v.id.toString() === formState.careerId);

  const selectPosition = (id) => {
    setFormState((prev) => ({
      ...prev,
      careerId: id.toString(),
    }));
    setCurrentStep(1);
    setFeedback({ show: false, success: false, message: "" });
    // Smooth scroll down to application form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const validateStep = (stepIndex) => {
    if (stepIndex === 0) {
      if (!formState.careerId) {
        setFeedback({ show: true, success: false, message: "Choose the position you're applying for to continue." });
        return false;
      }
    }
    if (stepIndex === 1) {
      if (!formState.fullName || !formState.email || !formState.phone) {
        setFeedback({ show: true, success: false, message: "Fill in your name, email and phone number to continue." });
        return false;
      }
    }
    if (stepIndex === 2) {
      if (!formState.cvFile) {
        setFeedback({ show: true, success: false, message: "Upload your resume (PDF/DOC/DOCX) to continue." });
        return false;
      }
    }
    setFeedback({ show: false, success: false, message: "" });
    return true;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setFeedback({ show: false, success: false, message: "" });
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const jumpToStep = (index) => {
    // Only allow jumping backward, or to a step already validated
    if (index < currentStep) {
      setFeedback({ show: false, success: false, message: "" });
      setCurrentStep(index);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    setFeedback({ show: false, success: false, message: "" });
    setIsSubmitting(true);

    // Prepare multipart form data
    const formDataToSend = new FormData();
    formDataToSend.append("career_id", formState.careerId);
    formDataToSend.append("full_name", formState.fullName);
    formDataToSend.append("email", formState.email);
    formDataToSend.append("phone", formState.phone);
    formDataToSend.append("cover_letter", formState.coverLetter);
    formDataToSend.append("cv", formState.cvFile);

    fetch(`${ADMIN_ORIGIN}/api/careers/apply.php`, {
      method: "POST",
      body: formDataToSend,
    })
      .then((res) => res.json())
      .then((data) => {
        setIsSubmitting(false);
        if (data.ok) {
          setSubmitted(true);
          setFeedback({
            show: true,
            success: true,
            message: data.message || "Your application was submitted successfully!",
          });
        } else {
          setFeedback({
            show: true,
            success: false,
            message: data.message || "Server rejected your application. Please check details.",
          });
        }
      })
      .catch((err) => {
        console.error("Submission error:", err);
        setIsSubmitting(false);
        setFeedback({
          show: true,
          success: false,
          message: "Failed to connect to the recruitment server. Please try again later.",
        });
      });
  };

  const startNewApplication = () => {
    setFormState({
      careerId: "",
      fullName: "",
      email: "",
      phone: "",
      coverLetter: "",
      cvFile: null,
      cvFileName: "",
    });
    setCurrentStep(0);
    setSubmitted(false);
    setFeedback({ show: false, success: false, message: "" });
  };

  return (
    <div className="careers-page">
      <SEO
        title="Careers at Legit Empire | Join Our Real Estate Team"
        description="Explore exciting career opportunities in real estate development, engineering, sales, and administration at Legit Empire. Build your future with us."
        keywords="careers at legit empire, real estate jobs abuja, engineering jobs nigeria, property sales jobs"
      />

      {/* HERO SECTION */}
      <section className="careers-hero">
        {/* Blueprint illustration: a professional carrying a briefcase, framed by a rising structure */}
        <svg className="careers-hero-illustration" viewBox="0 0 460 560" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {/* faint construction grid */}
          <g className="blueprint-grid" opacity="0.14">
            <line x1="0" y1="120" x2="460" y2="120" />
            <line x1="0" y1="240" x2="460" y2="240" />
            <line x1="0" y1="360" x2="460" y2="360" />
            <line x1="120" y1="0" x2="120" y2="560" />
            <line x1="340" y1="0" x2="340" y2="560" />
          </g>

          {/* rising building framework behind the figure */}
          <g className="blueprint-structure" opacity="0.24">
            <rect x="280" y="90" width="120" height="380" rx="2" />
            <line x1="280" y1="150" x2="400" y2="150" />
            <line x1="280" y1="210" x2="400" y2="210" />
            <line x1="280" y1="270" x2="400" y2="270" />
            <line x1="280" y1="330" x2="400" y2="330" />
            <line x1="280" y1="390" x2="400" y2="390" />
            <line x1="280" y1="450" x2="400" y2="450" />
            <line x1="310" y1="90" x2="310" y2="470" />
            <line x1="340" y1="90" x2="340" y2="470" opacity="0.5" />
            <line x1="370" y1="90" x2="370" y2="470" />
          </g>

          {/* ground line */}
          <line x1="10" y1="478" x2="450" y2="478" className="blueprint-ground" opacity="0.3" />

          {/* the figure: head, torso, arms, legs */}
          <g className="blueprint-figure">
            {/* head */}
            <circle cx="168" cy="150" r="26" opacity="0.85" />
            {/* neck */}
            <line x1="168" y1="176" x2="168" y2="192" opacity="0.85" />
            {/* torso - tailored blazer silhouette */}
            <path
              d="M120 192
                 C 120 192, 140 210, 168 210
                 C 196 210, 216 192, 216 192
                 L 226 340
                 L 110 340
                 Z"
              opacity="0.85"
            />
            {/* lapel line */}
            <line x1="168" y1="212" x2="168" y2="300" opacity="0.4" />
            {/* left arm resting */}
            <path d="M120 200 C 96 224, 90 268, 96 320" fill="none" opacity="0.85" />
            {/* right arm extended down, holding briefcase handle */}
            <path d="M216 200 C 236 226, 240 262, 236 300" fill="none" opacity="0.85" />

            {/* legs */}
            <path d="M132 340 L 122 478" opacity="0.85" />
            <path d="M204 340 L 214 478" opacity="0.85" />

            {/* briefcase */}
            <g transform="translate(206, 296)">
              <rect x="0" y="14" width="64" height="46" rx="4" opacity="0.9" />
              <path d="M18 14 L18 2 C18 -2 22 -6 28 -6 L36 -6 C42 -6 46 -2 46 2 L46 14" fill="none" opacity="0.9" />
              <line x1="30" y1="30" x2="34" y2="30" opacity="0.9" />
            </g>
          </g>
        </svg>

        <motion.div
          className="careers-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="careers-pill">Build with Legit Empire</span>
          <h1>Shape the future of Nigerian real estate</h1>
          <p>
            We are looking for brilliant, growth-driven, and highly disciplined specialists to
            engineer communities, protect clients, and secure property wealth across Africa.
          </p>
          {vacancies.length > 0 && (
            <a href="#openings" className="btn-brown-large">
              View Open Vacancies <ChevronRight size={16} />
            </a>
          )}
        </motion.div>
      </section>

      {/* WHY JOIN US SECTION */}
      <section className="why-join-section">
        <div className="section-header-centered">
          <span className="section-label">Our Culture</span>
          <h2>A workplace engineered for execution</h2>
        </div>

        <div className="culture-grid">
          <div className="culture-card">
            <div className="culture-icon">
              <TrendingUp size={24} />
            </div>
            <h3>Radical Ownership</h3>
            <p>
              We believe in clear targets, fast iterations, and absolute accountability. At Legit Empire, your contribution directly maps to property delivery and client joy.
            </p>
          </div>

          <div className="culture-card">
            <div className="culture-icon">
              <Award size={24} />
            </div>
            <h3>Professional Masterclass</h3>
            <p>
              Work alongside leading builders, real estate attorneys, and digital operators. We provide ongoing mentorship and resources to fast-track your industry presence.
            </p>
          </div>

          <div className="culture-card">
            <div className="culture-icon">
              <FileText size={24} />
            </div>
            <h3>Radical Transparency</h3>
            <p>
              Our structures, transactions, and values are fully open. We deliver exactly what we promise, providing you with a high-integrity workspace you'll be proud of.
            </p>
          </div>
        </div>
      </section>

      {/* VACANCIES SECTION */}
      <section className="vacancies-section" id="openings">
        <div className="section-header">
          <span className="section-label">Active Vacancies</span>
          <h2>Current Career Opportunities</h2>
          <p>Select a position below to begin a short, guided application.</p>
        </div>

        {loadingVacancies ? (
          <div className="vacancies-spinner">
            <div className="spinner-circle"></div>
            <p>Loading open vacancies...</p>
          </div>
        ) : vacancies.length === 0 ? (
          /* Premium Empty-State Cards */
          <motion.div
            className="no-vacancies-card"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="no-vacancies-icon-shell">
              <Briefcase size={36} />
            </div>
            <h3>All Positions Currently Filled</h3>
            <p>
              We are currently fully staffed across our active Abuja developments. However, we are growing fast! Please check back soon or keep an eye on our official channels for upcoming project releases.
            </p>
          </motion.div>
        ) : (
          <div className="vacancies-grid">
            {vacancies.map((job) => (
              <motion.article
                key={job.id}
                className={`vacancy-card ${formState.careerId === job.id.toString() ? "is-selected" : ""}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
              >
                <div className="vacancy-header">
                  <div className="vacancy-title-group">
                    <span className="vacancy-icon-shell">
                      <Briefcase size={18} />
                    </span>
                    <h3>{job.title}</h3>
                  </div>
                  <span className="location-tag">
                    <MapPin size={12} /> Abuja, Nigeria
                  </span>
                </div>

                <div className="vacancy-body">
                  <p className="job-desc">{job.description}</p>

                  {job.requirements && (
                    <div className="job-reqs">
                      <h4>Key Requirements</h4>
                      <p>{job.requirements}</p>
                    </div>
                  )}
                </div>

                <div className="vacancy-footer">
                  <div className="deadline-group">
                    <Clock size={14} />
                    <span>
                      Apply by <strong>{new Date(job.deadline).toLocaleDateString()}</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => selectPosition(job.id)}
                    className="btn-select-position"
                  >
                    Apply Now <ChevronRight size={14} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* APPLICATION WIZARD SECTION */}
      <section className="application-form-section" ref={formRef}>
        <div className="form-container">
          <div className="form-header">
            <h2>Join Legit Empire</h2>
            <p>A short, guided application. Our recruitment team reviews every dossier within 5 business days.</p>
          </div>

          {vacancies.length === 0 && !loadingVacancies ? (
            /* Elegant Closed Notice banner */
            <div className="portal-closed-alert">
              <AlertCircle size={22} className="alert-closed-icon" />
              <div>
                <h4>Application Portal Temporarily Paused</h4>
                <p>
                  Because all job vacancies are currently filled, the application portal is temporarily closed.
                  It will automatically reopen as soon as a new vacancy goes live in our Abuja listings.
                </p>
              </div>
            </div>
          ) : submitted ? (
            <motion.div
              className="submission-success-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="success-icon-shell">
                <CheckCircle size={34} />
              </div>
              <h3>Application received</h3>
              <p>{feedback.message}</p>
              <button className="btn-select-position" onClick={startNewApplication}>
                Submit another application
              </button>
            </motion.div>
          ) : (
            <div className="careers-wizard">
              {/* PROGRESS INDICATOR */}
              <div className="apply-progress" role="list">
                {STEPS.map((step, index) => {
                  const StepIcon = step.icon;
                  const status =
                    index === currentStep ? "active" : index < currentStep ? "completed" : "upcoming";
                  return (
                    <React.Fragment key={step.key}>
                      <button
                        type="button"
                        className={`apply-step ${status}`}
                        onClick={() => jumpToStep(index)}
                        role="listitem"
                        aria-current={index === currentStep ? "step" : undefined}
                      >
                        <span className="apply-step-icon">
                          {status === "completed" ? <CheckCircle size={16} /> : <StepIcon size={16} />}
                        </span>
                        <span className="apply-step-label">{step.label}</span>
                      </button>
                      {index < STEPS.length - 1 && (
                        <span className={`step-connector ${index < currentStep ? "filled" : ""}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              <form onSubmit={handleSubmit} className="careers-form">
                <AnimatePresence mode="wait">
                  {/* STEP 1 — POSITION */}
                  {currentStep === 0 && (
                    <motion.div
                      key="step-position"
                      className="step-panel"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      <div className="form-group span-2">
                        <label htmlFor="careerId">Select Position*</label>
                        <select
                          name="careerId"
                          id="careerId"
                          value={formState.careerId}
                          onChange={handleInputChange}
                        >
                          <option value="">-- Choose Position --</option>
                          {vacancies.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedJob && (
                        <div className="position-preview">
                          <span className="position-preview-label">You're applying for</span>
                          <strong>{selectedJob.title}</strong>
                          <p>{selectedJob.description}</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* STEP 2 — DETAILS */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step-details"
                      className="step-panel"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      <div className="form-grid">
                        <div className="form-group">
                          <label htmlFor="fullName">Full Name*</label>
                          <input
                            type="text"
                            name="fullName"
                            id="fullName"
                            placeholder="e.g., Al-Ameen Salisu"
                            value={formState.fullName}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="email">Email Address*</label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="e.g., candidate@domain.com"
                            value={formState.email}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="form-group span-2">
                          <label htmlFor="phone">Phone Number (WhatsApp)*</label>
                          <input
                            type="tel"
                            name="phone"
                            id="phone"
                            placeholder="e.g., +234 810 000 0000"
                            value={formState.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3 — DOCUMENTS */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step-documents"
                      className="step-panel"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      <div className="form-grid">
                        <div className="form-group span-2">
                          <label>Resume / CV Document (PDF, DOC, DOCX up to 5MB)*</label>
                          <div className="cv-upload-zone">
                            <input
                              type="file"
                              name="cv"
                              id="cvFile"
                              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              onChange={handleFileChange}
                              className="cv-file-input"
                            />
                            <label htmlFor="cvFile" className="cv-upload-label">
                              <UploadCloud size={28} className="upload-icon" />
                              <span>
                                {formState.cvFileName ? (
                                  <strong>{formState.cvFileName}</strong>
                                ) : (
                                  "Browse Resume Files"
                                )}
                              </span>
                              <small>Maximum Size: 5MB</small>
                            </label>
                          </div>
                        </div>

                        <div className="form-group span-2">
                          <label htmlFor="coverLetter">Introduce Yourself (Cover Letter / Notes)</label>
                          <textarea
                            name="coverLetter"
                            id="coverLetter"
                            rows="5"
                            placeholder="Tell us what excites you about Legit Empire and how you can add value to our mission..."
                            value={formState.coverLetter}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4 — REVIEW */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step-review"
                      className="step-panel"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      <div className="review-grid">
                        <div className="review-row">
                          <span className="review-label">Position</span>
                          <span className="review-value">{selectedJob ? selectedJob.title : "—"}</span>
                        </div>
                        <div className="review-row">
                          <span className="review-label">Full Name</span>
                          <span className="review-value">{formState.fullName || "—"}</span>
                        </div>
                        <div className="review-row">
                          <span className="review-label">Email</span>
                          <span className="review-value">{formState.email || "—"}</span>
                        </div>
                        <div className="review-row">
                          <span className="review-label">Phone</span>
                          <span className="review-value">{formState.phone || "—"}</span>
                        </div>
                        <div className="review-row">
                          <span className="review-label">Resume</span>
                          <span className="review-value">{formState.cvFileName || "—"}</span>
                        </div>
                        {formState.coverLetter && (
                          <div className="review-row review-row-block">
                            <span className="review-label">Cover Letter</span>
                            <p className="review-value">{formState.coverLetter}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Feedback */}
                <AnimatePresence>
                  {feedback.show && (
                    <motion.div
                      className={`form-alert ${feedback.success ? "success" : "error"}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="alert-content">
                        {feedback.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        <span>{feedback.message}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* WIZARD NAVIGATION */}
                <div className="wizard-nav-row">
                  {currentStep > 0 ? (
                    <button type="button" className="btn-step-back" onClick={goBack}>
                      <ChevronLeft size={16} /> Back
                    </button>
                  ) : (
                    <span />
                  )}

                  {currentStep < STEPS.length - 1 ? (
                    <button type="button" className="btn-step-next" onClick={goNext}>
                      Continue <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button type="submit" disabled={isSubmitting} className="btn-submit-app">
                      {isSubmitting ? (
                        <span className="submit-loading">
                          <span className="spinner-mini"></span>
                          Sending application...
                        </span>
                      ) : (
                        "Submit My Application"
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Careers;