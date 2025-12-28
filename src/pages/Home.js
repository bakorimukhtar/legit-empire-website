import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  PlayCircle,
  Users,
  Building2,
  ShieldCheck,
  MapPin,
  Home as HomeIcon,
  ArrowRight,
  Sparkles,
  BedDouble,
  Bath,
  Ruler,
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Home.css";

import heroLogo from "../assets/logo.png";

const sampleExterior =
  "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=1600&q=80";
const sampleInterior =
  "https://images.unsplash.com/photo-1600585154340-0ef3c08c0632?auto=format&fit=crop&w=1600&q=80";
const sampleCity =
  "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1600&q=80";

/* ---------- HOOKS ---------- */

// multi-word typewriter for headline
const useTypewriterWords = (words, typeSpeed = 120, deleteSpeed = 80, pause = 2000) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    let speed = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && display === currentWord) {
      speed = pause;
    }
    if (isDeleting && display === "") {
      speed = 500;
    }

    const timer = setTimeout(() => {
      if (!isDeleting && display === currentWord) {
        setIsDeleting(true);
      } else if (isDeleting && display === "") {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      } else if (isDeleting) {
        setDisplay((prev) => prev.slice(0, prev.length - 1));
      } else {
        setDisplay(currentWord.slice(0, display.length + 1));
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [display, isDeleting, wordIndex, words, typeSpeed, deleteSpeed, pause]);

  return display;
};

// single-text typewriter
const useTypewriter = (text, speed = 35, inView = true) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (index >= text.length) return;

    const timer = setTimeout(() => setIndex((prev) => prev + 1), speed);
    return () => clearTimeout(timer);
  }, [index, text, speed, inView]);

  // reset when re-entering view
  useEffect(() => {
    if (inView) setIndex(0);
  }, [inView]);

  return text.slice(0, index);
};

// count-up that restarts when inViewKey changes
const CountUp = ({ end, duration = 4000, inViewKey }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inViewKey) return;

    setValue(0);
    let frame = 0;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    const easeOutQuad = (t) => t * (2 - t);

    const counter = setInterval(() => {
      frame += 1;
      const progress = easeOutQuad(frame / totalFrames);
      const current = Math.round(end * progress);
      setValue(current);
      if (frame === totalFrames) clearInterval(counter);
    }, frameDuration);

    return () => clearInterval(counter);
  }, [end, duration, inViewKey]);

  return <span>{value.toLocaleString()}</span>;
};

/* ---------- SMALL COMPONENTS ---------- */

const TestimonialCard = ({ item, inView }) => {
  const typedText = useTypewriter(item.text, 25, inView);

  return (
    <div className="le-test-card">
      <Quote className="le-test-quote-icon" size={26} />
      <p className="le-test-text">
        “{typedText}
        <span className="typing-cursor light">|</span>”
      </p>
      <div className="le-test-rating">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={18}
            className={i < item.rating ? "le-star filled" : "le-star empty"}
          />
        ))}
      </div>
      <div className="le-test-person">
        <span className="le-test-name">{item.name}</span>
        <span className="le-test-role">{item.role}</span>
      </div>
    </div>
  );
};

/* ---------- MAIN COMPONENT ---------- */

const Home = () => {
  const [currentProject, setCurrentProject] = useState(0);

  const rotatingHeadlines = [
    "Luxury Apartments",
    "Gated Communities",
    "Prime City Plots",
    "Mixed‑Use Developments",
  ];

  const heroTyped = useTypewriterWords(rotatingHeadlines, 120, 80, 2000);

  const statsData = [
    {
      icon: <Building2 size={40} />,
      number: 18,
      suffix: "+",
      label: "Completed projects",
    },
    {
      icon: <HomeIcon size={40} />,
      number: 1200,
      suffix: "+",
      label: "Delivered units",
    },
    {
      icon: <MapPin size={40} />,
      number: 3,
      suffix: "",
      label: "States in Nigeria",
    },
  ];

  const projects = [
    {
      name: "Empire Residences Phase 1",
      location: "Gwarinpa, Abuja",
      img: sampleExterior,
      beds: 3,
      baths: 3,
      size: "210 sqm",
      tag: "Sold Out",
    },
    {
      name: "Legit Gardens Estate",
      location: "Lekki, Lagos",
      img: sampleInterior,
      beds: 4,
      baths: 4,
      size: "320 sqm",
      tag: "Under Construction",
    },
    {
      name: "Empire Towers",
      location: "Central Business District",
      img: sampleCity,
      beds: 2,
      baths: 2,
      size: "145 sqm",
      tag: "Now Selling",
    },
  ];

  const testimonials = [
    {
      name: "Mrs. Amina Yusuf",
      role: "Homeowner, Empire Residences",
      text: "Legit Empire delivered exactly what was promised. The finishing, documentation and follow‑up support made the entire process stress‑free for my family.",
      rating: 5,
    },
    {
      name: "Mr. Ishaq",
      role: "Investor, Legit Gardens",
      text: "From inspection to allocation, the team was transparent and professional. I feel confident recommending them to serious property investors.",
      rating: 5,
    },
    {
      name: "Engr. Bello",
      role: "Corporate client",
      text: "Their understanding of both design and long‑term maintenance makes them a strong partner for our staff housing projects.",
      rating: 4,
    },
  ];

  const nextProject = () =>
    setCurrentProject((p) => (p + 1) % projects.length);
  const prevProject = () =>
    setCurrentProject((p) => (p - 1 + projects.length) % projects.length);

  const statsContainerVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };
  const statItemVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // in-view tracking
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { amount: 0.4 });

  const testRef = useRef(null);
  const testsInView = useInView(testRef, { amount: 0.3 });

  return (
    <div className="le-home">
      {/* HERO */}
      <section className="le-hero">
        <div className="le-hero-blobs">
          <div className="le-blob le-blob-1" />
          <div className="le-blob le-blob-2" />
        </div>

        <div className="le-hero-grid">
          <motion.div
            className="le-hero-text"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.4 }}
            transition={{ duration: 0.7 }}
          >
            <div className="le-hero-pill">
              <ShieldCheck size={22} />
              <span>Trusted Nigerian Real Estate Developer</span>
            </div>

            <h1 className="le-hero-title">
              Building{" "}
              <span className="le-hero-gradient">
                <span className="typing-text">
                  {heroTyped}
                  <span className="typing-cursor">|</span>
                </span>
              </span>{" "}
              that stand the test of time.
            </h1>

            <p className="le-hero-sub">
              Legit Empire designs and delivers modern homes, estates and
              investment‑grade properties for homeowners and investors across
              Nigeria.
            </p>

            <div className="le-hero-actions">
              <Link to="/schedule">
                <button className="btn-primary">Schedule a visit</button>
              </Link>
              <button className="le-hero-secondary">
                <PlayCircle size={22} />
                Watch project tour
              </button>
            </div>

            <div className="le-hero-meta">
              <div>
                <span className="le-meta-label">Project focus</span>
                <span className="le-meta-value">
                  Residential • Commercial • Mixed‑use
                </span>
              </div>
              <div>
                <span className="le-meta-label">Buyers served</span>
                <span className="le-meta-value">
                  First‑time & seasoned investors
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="le-hero-media"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="le-hero-card">
              <img src={heroLogo} alt="Legit Empire" className="le-hero-logo" />
              <img
                src={projects[2].img}
                alt="Featured development"
                className="le-hero-mainimg"
              />
              <div className="le-hero-badge">
                <Building2 size={18} />
                <span>Premium developments • Turnkey delivery</span>
              </div>
              <div className="le-hero-small-card">
                <h4>Empire Towers</h4>
                <p>Grade‑A apartments in the heart of the city.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="le-stats" ref={statsRef}>
        <motion.div
          className="le-stats-grid"
          variants={statsContainerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.3 }}
        >
          {statsData.map((item) => (
            <motion.div
              key={item.label}
              className="le-stat-item"
              variants={statItemVariant}
            >
              <div className="le-stat-icon">{item.icon}</div>
              <div>
                <h3>
                  <CountUp
                    end={item.number}
                    duration={3500}
                    inViewKey={statsInView}
                  />
                  {item.suffix}
                </h3>
                <p>{item.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* WHY */}
      {/* ... keep your WHY and PROJECTS sections exactly as you already have them ... */}

      {/* TESTIMONIALS / REVIEWS */}
      <section className="le-testimonials" ref={testRef}>
        <motion.div
          className="le-section-header le-test-header"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <div className="le-section-pill">
            <Sparkles size={18} />
            Client testimonials
          </div>
          <h2>What our clients say about Legit Empire.</h2>
          <p>
            Real feedback from homeowners and investors who trusted us with
            their property goals.
          </p>
        </motion.div>

        <motion.div
          className="le-test-grid"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {testimonials.map((item, idx) => (
            <TestimonialCard key={idx} item={item} inView={testsInView} />
          ))}
        </motion.div>
      </section>
{/* CTA STRIP */}
<section className="le-cta">
        <div className="le-cta-inner">
          <div>
            <h2>Ready to inspect a property or start a new project?</h2>
            <p>
              Book a guided site visit or speak with our team about custom
              developments and bulk purchases.
            </p>
          </div>
          <div className="le-cta-actions">
            <Link to="/schedule">
              <button className="btn-primary">Book inspection</button>
            </Link>
            <Link to="/contact">
              <button className="le-cta-outline">Talk to our team</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
