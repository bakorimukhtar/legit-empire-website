// src/App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Globe,
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  FileText,
  Users,
} from "lucide-react";

// --- IMPORT PAGES ---
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Services from "./pages/Services";
import Schedule from "./pages/Schedule";
import ComingSoon from "./pages/ComingSoon";

// --- IMPORT COMPONENTS ---
import Chatbot from "./components/Chatbot";

// --- ASSET IMPORTS ---
import logo from "./assets/logo.png";

function App() {
  const [isProjectsOpen, setProjectsOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleProjects = () => {
    setProjectsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setProjectsOpen(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setProjectsOpen(false);
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="App">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo-area">
          <Link to="/" onClick={closeMenu}>
            <img
              src={logo}
              alt="Legit Empire Real Estate"
              className="logo-img"
            />
          </Link>
          <div className="logo-text">
            <span className="logo-title">Legit Empire</span>
            <span className="logo-subtitle">Real Estate Developers</span>
            <span className="logo-rc">RC: 8343179</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="nav-center">
          <Link to="/" className="nav-link">
            Home
          </Link>

          <div style={{ position: "relative" }}>
            <button
              className={`nav-link ${isProjectsOpen ? "active" : ""}`}
              onClick={toggleProjects}
            >
              Portfolio{" "}
              <ChevronDown
                size={16}
                style={{
                  transform: isProjectsOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "0.2s",
                }}
              />
            </button>
            <AnimatePresence>
              {isProjectsOpen && (
                <motion.div
                  className="dropdown-menu"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                >
                  <Link
                    to="/projects"
                    className="dropdown-item"
                    onClick={() => setProjectsOpen(false)}
                  >
                    Completed Projects
                  </Link>
                  <Link
                    to="/projects"
                    className="dropdown-item"
                    onClick={() => setProjectsOpen(false)}
                  >
                    Ongoing Developments
                  </Link>
                  <Link
                    to="/schedule"
                    className="dropdown-item"
                    onClick={() => setProjectsOpen(false)}
                  >
                    Book Site Visit
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/services" className="nav-link">
            Services
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          <Link to="/contact" className="nav-link">
            Contact
          </Link>
        </div>

        {/* Right actions */}
        <div className="nav-actions">
          <button className="nav-link lang-pill">
            <Globe size={18} /> EN
          </button>
          <Link to="/schedule">
            <button className="btn-primary">Schedule Appointment</button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <button
                className="mobile-link"
                onClick={toggleProjects}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                Portfolio
                <ChevronDown
                  size={18}
                  style={{
                    transform: isProjectsOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "0.2s",
                  }}
                />
              </button>

              <AnimatePresence>
                {isProjectsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Link
                      to="/projects"
                      className="mobile-sub-link"
                      onClick={closeMenu}
                    >
                      Completed Projects
                    </Link>
                    <Link
                      to="/projects"
                      className="mobile-sub-link"
                      onClick={closeMenu}
                    >
                      Ongoing Developments
                    </Link>
                    <Link
                      to="/schedule"
                      className="mobile-sub-link"
                      onClick={closeMenu}
                    >
                      Book Site Visit
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              <Link to="/" className="mobile-link" onClick={closeMenu}>
                Home
              </Link>
              <Link
                to="/services"
                className="mobile-link"
                onClick={closeMenu}
              >
                Services
              </Link>
              <Link to="/about" className="mobile-link" onClick={closeMenu}>
                About
              </Link>
              <Link to="/contact" className="mobile-link" onClick={closeMenu}>
                Contact
              </Link>

              <Link to="/schedule" onClick={closeMenu} style={{ width: "100%" }}>
                <button className="btn-primary mobile-cta-btn">
                  Schedule Appointment
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ROUTES */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/services" element={<Services />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-top">
            <div className="logo-area-footer">
              <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                <img
                  src={logo}
                  alt="Legit Empire Real Estate"
                  className="logo-img footer-logo-img"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </Link>
              <span>Building trusted property wealth.</span>
            </div>
            <div className="newsletter-box">
              <p>Stay ahead of new property launches.</p>
              <div className="input-group">
                <input type="email" placeholder="Enter your email" />
                <button>Subscribe</button>
              </div>
            </div>
          </div>

          <div className="footer-divider" />

          <div className="footer-grid">
            <div className="footer-col">
              <h4>Company</h4>
              <Link to="/about">About Legit Empire</Link>
              <Link to="/services">Our Services</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/coming-soon">Careers</Link>
            </div>
            <div className="footer-col">
              <h4>Portfolio</h4>
              <Link to="/projects">Residential Estates</Link>
              <Link to="/projects">Commercial Spaces</Link>
              <Link to="/projects">Off-plan Projects</Link>
              <Link to="/schedule">Book Inspection</Link>
            </div>
            <div className="footer-col footer-col-contact">
              <h4>Contact</h4>
              <div className="footer-contact-item">
                <FileText size={14} />
                <span>RC8343179</span>
              </div>
              <div className="footer-contact-item">
                <MapPin size={14} />
                <span>
                  Plot 74. Wing B, 3rd floor, Ogun State house by ministry of
                  finance, Ralgh sodeinde street., Abuja, Nigeria
                </span>
              </div>
              <div className="footer-contact-item">
                <Phone size={14} />
                <a href="tel:+2348100789541">+234 810 078 9541</a>
              </div>
            </div>
            <div className="footer-col footer-col-affiliate">
              <h4>Affiliate Program</h4>
              <div className="footer-contact-item">
                <Users size={14} />
                <span>Earn commissions by referring buyers.</span>
              </div>
              <Link to="/coming-soon">Join as an affiliate</Link>
              <Link to="/contact">Talk to our affiliate team</Link>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Legit Empire Real Estate.</p>
          </div>
        </div>
      </footer>

      {/* FLOATING CHATBOT */}
      <Chatbot />
    </div>
  );
}

export default App;
