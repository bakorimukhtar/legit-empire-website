// src/App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  Globe,
  MapPin,
  Phone,
  Mail,
  FileText,
  Users,
  Instagram,
  Music,
  Linkedin,
  ExternalLink
} from "lucide-react";

// --- IMPORT PAGES ---
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Services from "./pages/Services";
import Schedule from "./pages/Schedule";
import ComingSoon from "./pages/ComingSoon";
import Careers from "./pages/Careers";
import Teams from "./pages/Teams";

// --- IMPORT COMPONENTS ---
import Chatbot from "./components/Chatbot";

// --- ASSET IMPORTS ---
import logo from "./assets/logo.png";

function App() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cacModal, setCacModal] = useState({ show: false, progress: 0, url: "", timer: null });
  const location = useLocation();

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);

    // Setup scroll reveal observer on route change
    const timer = setTimeout(() => {
      const targets = document.querySelectorAll(".reveal, .reveal-stagger");
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
          }
        });
      }, { threshold: 0.15 });
      
      targets.forEach((t) => io.observe(t));

      return () => {
        targets.forEach((t) => io.unobserve(t));
      };
    }, 150);

    return () => clearTimeout(timer);
  }, [location]);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("lock");
    } else {
      document.body.classList.remove("lock");
    }
  }, [isMobileMenuOpen]);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (cacModal.timer) clearTimeout(cacModal.timer);
    };
  }, [cacModal.timer]);

  const triggerCacVerification = (e, url) => {
    e.preventDefault();
    navigator.clipboard.writeText("8343179").catch(() => {});
    
    // Reset previous timer if any
    if (cacModal.timer) clearTimeout(cacModal.timer);

    setCacModal({ show: true, progress: 0, url, timer: null });
    
    // Animate progress bar fill
    setTimeout(() => {
      setCacModal(prev => ({ ...prev, progress: 100 }));
    }, 50);

    // Auto-redirect after 1.8 seconds
    const timer = setTimeout(() => {
      proceedCac(url);
    }, 1800);

    setCacModal(prev => ({ ...prev, timer }));
  };

  const proceedCac = (url) => {
    window.open(url || "https://icrp.cac.gov.ng/public-search", "_blank");
    setCacModal(prev => {
      if (prev.timer) clearTimeout(prev.timer);
      return { show: false, progress: 0, url: "", timer: null };
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("mobile-menu")) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="App">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="brand">
          <Link to="/" onClick={closeMenu}>
            <img
              src={logo}
              alt="Legit Empire Real Estate"
              className="mark"
            />
          </Link>
          <div className="brand-text">
            <span className="brand-title">Legit Empire</span>
            <span className="brand-sub">Real Estate Limited</span>
            <a 
              href="https://icrp.cac.gov.ng/public-search" 
              onClick={(e) => triggerCacVerification(e, "https://icrp.cac.gov.ng/public-search")} 
              className="brand-rc"
            >
              RC: 8343179
            </a>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="nav-center">
          <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
            Home
          </Link>
          <Link to="/projects" className={`nav-link ${location.pathname === "/projects" ? "active" : ""}`}>
            Projects
          </Link>
          <Link to="/services" className={`nav-link ${location.pathname === "/services" ? "active" : ""}`}>
            Services
          </Link>
          <Link to="/about" className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}>
            About
          </Link>
          <Link to="/contact" className={`nav-link ${location.pathname === "/contact" ? "active" : ""}`}>
            Contact
          </Link>
        </div>

        {/* Desktop Nav Actions */}
        <div className="nav-actions">
          <button className="lang-pill">
            <Globe size={14} /> EN
          </button>
          <Link to="/schedule" className="btn btn-primary">
            Schedule Appointment
          </Link>
        </div>

        {/* Mobile Toggle FAB */}
        <button
          className={`mobile-toggle ${isMobileMenuOpen ? "active" : ""}`}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span className="hamburger-box">
            <span className="hamburger-line top"></span>
            <span className="hamburger-line mid"></span>
            <span className="hamburger-line bot"></span>
          </span>
        </button>
      </nav>

      {/* 3D PERSPECTIVE MOBILE MENU OVERLAY */}
      <div 
        className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`} 
        id="mobileMenu"
        onClick={handleBackdropClick}
      >
        <div className="mobile-menu-links">
          <Link to="/" className={location.pathname === "/" ? "active" : ""} onClick={closeMenu}>
            Home
          </Link>
          <Link to="/projects" className={location.pathname === "/projects" ? "active" : ""} onClick={closeMenu}>
            Projects
          </Link>
          <Link to="/services" className={location.pathname === "/services" ? "active" : ""} onClick={closeMenu}>
            Services
          </Link>
          <Link to="/about" className={location.pathname === "/about" ? "active" : ""} onClick={closeMenu}>
            About
          </Link>
          <Link to="/contact" className={location.pathname === "/contact" ? "active" : ""} onClick={closeMenu}>
            Contact
          </Link>
        </div>

        <div className="mobile-menu-footer">
          <a href="tel:+2348132161510" className="social-item phone-link" style={{ display: "flex", gap: "10px", color: "var(--paper-70)", textDecoration: "none", marginBottom: "8px" }}>
            <Phone size={18} />
            <span>+234 813 216 1510</span>
          </a>
          <a href="mailto:info@legitempire.com" className="social-item email-link" style={{ display: "flex", gap: "10px", color: "var(--paper-70)", textDecoration: "none", marginBottom: "16px" }}>
            <Mail size={18} />
            <span>info@legitempire.com</span>
          </a>
          
          <div className="social-icons-row" style={{ display: "flex", gap: "20px", marginBottom: "24px" }}>
            <a href="https://www.instagram.com/legit_.empire/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--paper-70)" }} aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="https://vt.tiktok.com/ZSXh1wTDJ/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--paper-70)" }} aria-label="TikTok">
              <Music size={20} />
            </a>
            <a href="https://linkedin.com/company/legitempire" target="_blank" rel="noopener noreferrer" style={{ color: "var(--paper-70)" }} aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
          </div>

          <Link to="/schedule" className="btn btn-primary" onClick={closeMenu} style={{ justifyContent: "center", width: "100%" }}>
            Schedule Appointment
          </Link>
        </div>
      </div>

      {/* MAIN ROUTES CONTENT */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/services" element={<Services />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="wrap footer-content">
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
                <button type="button">Subscribe</button>
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
              <Link to="/careers">Careers</Link>
            </div>
            <div className="footer-col">
              <h4>Projects</h4>
              <Link to="/projects">Residential Estates</Link>
              <Link to="/projects">Commercial Spaces</Link>
              <Link to="/projects">Off-plan Projects</Link>
              <Link to="/schedule">Book Inspection</Link>
            </div>
            <div className="footer-col footer-col-contact">
              <h4>Contact</h4>
              <div className="footer-contact-item">
                <FileText size={16} />
                <a 
                  href="https://icrp.cac.gov.ng/public-search" 
                  onClick={(e) => triggerCacVerification(e, "https://icrp.cac.gov.ng/public-search")}
                  style={{ textDecoration: "underline" }}
                >
                  RC8343179
                </a>
              </div>
              <div className="footer-contact-item">
                <MapPin size={16} />
                <span>
                  Plot 74, Wing B, 3rd Floor, Ogun State House by Ministry of Finance, Ralph Sodeinde Street, Abuja, Nigeria
                </span>
              </div>
              <div className="footer-contact-item">
                <Phone size={16} />
                <a href="tel:+2348132161510">+234 813 216 1510</a>
              </div>
            </div>
            <div className="footer-col footer-col-affiliate">
              <h4>Affiliate Program</h4>
              <div className="footer-contact-item">
                <Users size={16} />
                <span>Earn commissions by referring buyers.</span>
              </div>
              <Link to="/coming-soon">Join as an affiliate</Link>
              <Link to="/contact">Talk to our affiliate team</Link>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Legit Empire Real Estate Limited.</p>
          </div>
        </div>
      </footer>

      {/* FLOATING CONVERSATIONAL CHATBOT */}
      <Chatbot />

      {/* CAC VERIFICATION FULL-PAGE MODAL */}
      <div className={`cac-modal-overlay ${cacModal.show ? "show" : ""}`}>
        <div className="cac-modal-card">
          <div className="cac-modal-icon">
            <ExternalLink size={28} />
          </div>
          <h3 className="cac-modal-title">Verification Portal</h3>
          <div className="cac-modal-body">
            Official registration number copied to clipboard:<br />
            <span className="cac-modal-code">RC: 8343179</span><br /><br />
            We are opening the Corporate Affairs Commission portal. Simply paste (Ctrl+V) the copied number to verify Legit Empire Real Estate Ltd.
          </div>
          <div className="cac-modal-progress">
            <div className="cac-modal-progress-bar" style={{ width: `${cacModal.progress}%` }}></div>
          </div>
          <button 
            className="btn btn-primary cac-modal-btn" 
            onClick={() => proceedCac(cacModal.url)}
          >
            Proceed Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;