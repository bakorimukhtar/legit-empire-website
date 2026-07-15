// src/pages/Home.js
import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Building,
  MapPin,
  Quote,
  Star,
  ShieldAlert,
  Award,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Home.css";

// Hook: Rotating phrase index — used with a CSS "roll reveal" on mount,
// no letter-by-letter typing. Cleaner, calmer, more deliberate.
const useRotatingWord = (words, interval = 2800) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words, interval]);

  return index;
};

// Component: Stats Counter
const Counter = ({ end, suffix = "", duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);

  useEffect(() => {
    let startTimestamp = null;
    let alive = true;
    
    // Intersection Observer to start counter when in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
            if (alive) {
              setCount(Math.floor(progress * end));
            }
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      alive = false;
      observer.disconnect();
    };
  }, [end, duration]);

  return (
    <span ref={elementRef} className="stat-num">
      {count}
      {suffix}
    </span>
  );
};

// Component: Typewriter Testimonial Card
function TestimonialCard({ quote, name, role, stars }) {
  const [displayedText, setDisplayedText] = useState("");
  const cardRef = useRef(null);

  useEffect(() => {
    let alive = true;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let i = 0;
          const interval = setInterval(() => {
            if (alive) {
              setDisplayedText((prev) => prev + quote.charAt(i));
            }
            i++;
            if (i >= quote.length) {
              clearInterval(interval);
            }
          }, 20);
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      alive = false;
      observer.disconnect();
    };
  }, [quote]);

  return (
    <div className="test-card" ref={cardRef}>
      <Quote className="test-quote-icon" size={24} />
      <p className="test-text">
        <span>{displayedText}</span>
        {displayedText.length < quote.length && <span className="test-cursor">&nbsp;</span>}
      </p>
      <div className="test-stars">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Star 
            key={idx} 
            className={idx < stars ? "star-filled" : "star-empty"} 
            size={14} 
            fill={idx < stars ? "var(--brass)" : "none"} 
          />
        ))}
      </div>
      <div className="test-person">
        <span className="test-name">{name}</span>
        <span className="test-role">{role}</span>
      </div>
    </div>
  );
}

function Home() {
  const phrases = ["Luxury Apartments", "Gated Communities", "Prime City Plots", "Mixed-Use Developments"];
  const rotatingIndex = useRotatingWord(phrases);

  const [projectIndex, setProjectIndex] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackProjects = [
    {
      id: 1,
      name: "Empire Residences Phase 1",
      location: "Gwarinpa, Abuja",
      type: "Residential Estate",
      size: "210 sqm",
      status: "Sold Out",
      coverImage: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 2,
      name: "Legit Gardens Estate",
      location: "Lekki, Lagos",
      type: "Residential Estate",
      size: "320 sqm",
      status: "Under Construction",
      coverImage: "https://images.unsplash.com/photo-1600585154340-0ef3c08c0632?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 3,
      name: "Empire Towers",
      location: "Central Business District, Abuja",
      type: "Commercial",
      size: "145 sqm",
      status: "Now Selling",
      coverImage: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  // Fetch published projects dynamically from database
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("https://admin.legitempirerealestate.com/api/website/listprojects.php", {
          headers: { Accept: "application/json" }
        });
        const data = await res.json();
        if (data?.ok && Array.isArray(data.projects) && data.projects.length > 0) {
          if (alive) {
            setProjects(data.projects);
          }
        } else if (alive) {
          setProjects(fallbackProjects);
        }
      } catch (err) {
        console.warn("Home projects fetch failed, using fallback static data:", err);
        if (alive) {
          setProjects(fallbackProjects);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handleNextProject = () => {
    if (projects.length === 0) return;
    setProjectIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrevProject = () => {
    if (projects.length === 0) return;
    setProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <div className="Home">
      {/* HERO SECTION */}
      <section className="hero">
        {/* Architectural self-drawing blueprint skyline graphic */}
        <svg
          className="skyline-bg"
          id="heroSkyline"
          viewBox="0 0 640 460"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          style={{ zIndex: 0 }}
        >
          <polyline points="20,220 220,80 260,104 300,84 620,220" />
          <rect x="250" y="60" width="90" height="330" />
          <rect x="360" y="130" width="60" height="260" />
          <rect x="430" y="170" width="52" height="220" />
          <rect x="60" y="220" width="140" height="170" />
          <line x1="0" y1="390" x2="640" y2="390" />
        </svg>

        <div className="wrap hero-grid">
          <div className="hero-text">
            <span className="hero-tickline" aria-hidden="true" />

            <h1 className="hero-title">
              <span className="hero-line hero-line-1">
                <span className="hero-line-inner">
                  Building{" "}
                  <span className="rot-wrap">
                    <span key={rotatingIndex} className="rot-word">
                      {phrases[rotatingIndex]}
                    </span>
                  </span>
                </span>
              </span>
              <span className="hero-line hero-line-2">
                <span className="hero-line-inner">that stands the test of time.</span>
              </span>
            </h1>

            <p className="hero-sub hero-fade-up" style={{ maxWidth: "100%" }}>
              Legit Empire designs and delivers modern homes, estates and investment-grade properties for homeowners and investors across Nigeria.
            </p>
            <div className="hero-actions hero-fade-up">
              <Link to="/schedule" className="btn btn-primary">
                Schedule a visit
              </Link>
              <Link to="/projects" className="btn btn-ghost">
                Explore Projects
              </Link>
            </div>
            <div className="hero-meta-cards">
              <div className="meta-card spec-plate meta-card-1">
                <span className="corner-bracket tl"></span>
                <span className="corner-bracket tr"></span>
                <span className="corner-bracket bl"></span>
                <span className="corner-bracket br"></span>
                <div className="spec-stamp">APPROVED</div>
                <div className="meta-card-inner">
                  <div className="meta-card-icon">
                    <Building size={20} />
                  </div>
                  <div className="meta-divider"></div>
                  <div className="meta-card-content">
                    <span className="meta-label">Project focus</span>
                    <span className="meta-value">Residential · Commercial · Mixed-use</span>
                  </div>
                </div>
              </div>
              <div className="meta-card spec-plate meta-card-2">
                <span className="corner-bracket tl"></span>
                <span className="corner-bracket tr"></span>
                <span className="corner-bracket bl"></span>
                <span className="corner-bracket br"></span>
                <div className="spec-stamp">VERIFIED</div>
                <div className="meta-card-inner">
                  <div className="meta-card-icon">
                    <Users size={20} />
                  </div>
                  <div className="meta-divider"></div>
                  <div className="meta-card-content">
                    <span className="meta-label">Buyers served</span>
                    <span className="meta-value">Investors & Families</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats">
        <div className="wrap stats-grid reveal-stagger">
          <div className="stat-item">
            <Counter end={18} suffix="+" />
            <span className="stat-label">Completed projects</span>
          </div>
          <div className="stat-item">
            <Counter end={1200} suffix="+" />
            <span className="stat-label">Delivered units</span>
          </div>
          <div className="stat-item">
            <Counter end={3} suffix="" />
            <span className="stat-label">States in Nigeria</span>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="block">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="eyebrow">Section 02 — Why Legit Empire</div>
            <h2>Every plot comes with a paper trail you can trust.</h2>
            <p>From title documentation to final handover, we build the way we'd want to buy — transparent, on schedule, and made to hold its value.</p>
          </div>
          <div className="why-grid reveal-stagger">
            <div className="why-card" data-index="A">
              <ShieldAlert className="why-icon" size={40} />
              <h3>Transparent from day one</h3>
              <p>Every allocation, payment plan and title document is laid out before you commit — no surprises at handover.</p>
            </div>
            <div className="why-card" data-index="B">
              <Building className="why-icon" size={40} />
              <h3>Built to last</h3>
              <p>Materials, structural review and finishing are chosen for decades of use, not just a good first impression.</p>
            </div>
            <div className="why-card" data-index="C">
              <Award className="why-icon" size={40} />
              <h3>Trusted across Nigeria</h3>
              <p>18+ completed projects and 1,200+ units delivered across three states — a track record families check for themselves.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section className="block" id="projects" style={{ background: "var(--paper-dim)" }}>
        <div className="wrap">
          <div className="projects-head reveal">
            <div>
              <div className="eyebrow">Section 03 — Current Plots</div>
              <h2>Portfolio</h2>
            </div>
            {projects.length > 1 && (
              <div className="proj-nav-group">
                <button className="proj-nav" onClick={handlePrevProject} aria-label="Previous project">
                  <ChevronLeft size={20} />
                </button>
                <button className="proj-nav" onClick={handleNextProject} aria-label="Next project">
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="proj-viewport reveal">
            {loading ? (
              <div style={{ padding: "40px 0", textAlign: "center", color: "var(--ink-50)", fontFamily: "Space Grotesk, monospace" }}>
                Connecting to database...
              </div>
            ) : projects.length === 0 ? (
              <div style={{ padding: "40px 0", textAlign: "center", color: "var(--ink-50)", fontFamily: "Space Grotesk, monospace" }}>
                No active developments published.
              </div>
            ) : (
              <div className="proj-track" style={{ transform: `translateX(-${projectIndex * 100}%)` }}>
                {projects.map((proj) => (
                  <div key={proj.id} className="project-card">
                    <div className="project-imgwrap">
                      <img src={proj.coverImage || "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=1200&q=80"} alt={proj.name} />
                      <span className="plot-status">{proj.status || "Ongoing"}</span>
                    </div>
                    <div className="project-body">
                      <h3>{proj.name}</h3>
                      <div className="project-loc">
                        <MapPin size={15} />
                        {proj.location}
                      </div>
                      <div className="project-specs">
                        {proj.type && <span className="spec">{proj.type}</span>}
                        {proj.units && <span className="spec">{proj.units} units</span>}
                        {proj.size && <span className="spec">{proj.size}</span>}
                      </div>
                      <Link to="/projects" className="proj-link">
                        View details <ArrowRight size={14} style={{ marginLeft: "4px" }} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {projects.length > 1 && (
            <div className="proj-dots">
              {projects.map((_, idx) => (
                <button
                  key={idx}
                  className={`proj-dot ${idx === projectIndex ? "active" : ""}`}
                  onClick={() => setProjectIndex(idx)}
                  aria-label={`Go to project ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="block">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="eyebrow">Section 04 — Client Notes</div>
            <h2>What our clients say about Legit Empire.</h2>
            <p>Real feedback from homeowners and investors who trusted us with their property goals.</p>
          </div>
          <div className="test-grid reveal-stagger">
            <TestimonialCard 
              quote="Legit Empire delivered exactly what was promised. The finishing, documentation and follow-up support made the entire process stress-free for my family."
              name="Mrs. Amina Yusuf"
              role="Homeowner, Empire Residences"
              stars={5}
            />
            <TestimonialCard 
              quote="From inspection to allocation, the team was transparent and professional. I feel confident recommending them to serious property investors."
              name="Mr. Ishaq"
              role="Investor, Legit Gardens"
              stars={5}
            />
            <TestimonialCard 
              quote="Their understanding of both design and long-term maintenance makes them a strong partner for our staff housing projects."
              name="Engr. Bello"
              role="Corporate client"
              stars={4}
            />
          </div>
        </div>
      </section>

      {/* CALL TO ACTION SECTION */}
      <div className="wrap cta-wrap">
        <div className="cta-band reveal">
          <div className="cta-text">
            <h2>Ready to inspect a property or start a new project?</h2>
            <p>Book a guided site visit or speak with our team about custom developments and bulk purchases.</p>
          </div>
          <div className="cta-actions">
            <Link to="/schedule" className="btn btn-primary">
              Book inspection
            </Link>
            <Link to="/contact" className="btn btn-ghost-light">
              Talk to our team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;