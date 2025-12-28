import React, { useState, useEffect, useRef } from "react";
import "./About.css";
import { motion, useInView, animate } from "framer-motion";
import {
  MapPin,
  Home as HomeIcon,
  Users,
  ArrowRight,
  Building2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

// Counter that runs once when stat is in view
const Counter = ({ from, to, duration = 2 }) => {
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    const node = nodeRef.current;
    const controls = animate(from, to, {
      duration,
      ease: "easeOut",
      onUpdate(value) {
        node.textContent = Math.round(value).toLocaleString();
      },
    });
    return () => controls.stop();
  }, [from, to, duration, isInView]);

  return <span ref={nodeRef}>{from}</span>;
};

const About = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const statsData = [
    {
      icon: <MapPin size={28} />,
      value: 3,
      suffix: " Cities",
      label: "Prime Nigerian locations",
    },
    {
      icon: <HomeIcon size={28} />,
      value: 1200,
      suffix: "+",
      label: "Delivered and ongoing units",
    },
    {
      icon: <Users size={28} />,
      value: 500,
      suffix: "+",
      label: "Clients and residents served",
    },
  ];

  const values = [
    {
      icon: <ShieldCheck size={22} />,
      title: "Radical transparency",
      text: "Clear documentation, realistic delivery timelines, and honest communication at every stage of the transaction.",
    },
    {
      icon: <Building2 size={22} />,
      title: "Quality developments",
      text: "Architecture, construction and infrastructure designed to stand the test of time in growing Nigerian cities.",
    },
    {
      icon: <Users size={22} />,
      title: "People-first communities",
      text: "Spaces that prioritise safety, everyday convenience, and long-term value for families and investors.",
    },
  ];

  const team = [
    {
      name: "Al‑Ameen Salisu Mamman",
      role: "Chief Executive Officer",
      bio: "Founder of Legit Empire Real Estate, leading the vision to deliver secure, well‑documented communities and sustainable property wealth across Nigeria.",
      img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=1000&auto=format&fit=crop",
      linkedin: "#",
      email: "info@legitempire.com",
      phone: "+2348100789541",
    },
  ];

  const faqs = [
    {
      question: "What kind of developments does Legit Empire focus on?",
      answer:
        "We develop well‑planned residential estates, gated communities and mixed‑use projects in strategic growth corridors within Nigeria.",
    },
    {
      question: "Can I pay for a unit in phases?",
      answer:
        "Yes. On selected projects we provide structured installment plans, allowing buyers to spread payments while their units are under construction.",
    },
    {
      question: "Do you support due diligence and title verification?",
      answer:
        "Our team works with trusted legal partners to support clients with title verification, documentation and regulatory processes before purchase.",
    },
  ];

  return (
    <div className="about-page">
      {/* HERO / INTRO */}
      <section className="about-hero">
        <div className="about-hero-grid">
          <motion.div
            className="about-hero-text"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="about-pill">About Legit Empire</span>
            <h1>Building trusted property wealth for modern Nigeria.</h1>
            <p>
              Legit Empire Real Estate designs and delivers communities where
              location, infrastructure and documentation are carefully aligned
              to protect your investment and everyday lifestyle.
            </p>
            <div className="about-hero-cta">
              <Link to="/projects" className="btn-brown">
                Explore our projects <ArrowRight size={16} />
              </Link>
              <Link to="/schedule" className="hero-secondary-link">
                Book an estate inspection
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="about-hero-media"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            <div className="hero-image-card">
              <img
                src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2000&auto=format&fit=crop"
                alt="Modern residential estate"
              />
              <div className="hero-badge">
                <span className="hero-badge-title">QC‑led delivery</span>
                <span className="hero-badge-sub">Design • Infrastructure • Documentation</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STORY + VISION / MISSION STRIP */}
      <section className="about-story">
        <div className="story-layout">
          <motion.div
            className="story-main"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="section-label">Our story</span>
            <h2>From scattered deals to structured developments.</h2>
            <p>
              Legit Empire started with a simple observation: many buyers were
              navigating real estate through informal channels, with little
              structure and limited transparency. Good locations existed, but
              the process was risky and documentation was often unclear.
            </p>
            <p>
              We set out to build a development company that behaves like an
              institutional partner—curating locations, designing livable
              estates and handling documentation with discipline, so clients can
              buy with confidence.
            </p>
          </motion.div>

          <motion.div
            className="vision-mission-stack"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
          >
            <div className="vm-pill-row">
              <button className="vm-pill active">Vision</button>
              <button className="vm-pill muted">Mission</button>
            </div>

            <div className="vm-card vision-card">
              <h3>Our Vision</h3>
              <p>
                To be the most trusted real estate development partner for
                modern communities across Africa.
              </p>
            </div>

            <div className="vm-card mission-card">
              <h3>Our Mission</h3>
              <p>
                To consistently deliver well‑documented, quality developments
                that blend strong locations, reliable infrastructure and
                lifestyle amenities for our clients.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS + VALUES */}
      <section className="about-stats-values">
        <motion.div
          className="stats-row"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {statsData.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <h3>
                  <Counter from={0} to={stat.value} duration={2.2} />
                  <span>{stat.suffix}</span>
                </h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="values-grid"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
        >
          {values.map((item, index) => (
            <div key={index} className="value-card">
              <div className="value-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* LEADERSHIP */}
      <section className="about-leadership">
        <motion.div
          className="leadership-header"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="section-label">Leadership</span>
          <h2>Stewarded by disciplined execution.</h2>
          <p>
            Legit Empire is led by operators who understand both the realities
            of construction and the expectations of today’s investors and
            homeowners.
          </p>
        </motion.div>

        <motion.div
          className="leader-layout"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
        >
          {team.map((person, index) => (
            <article key={index} className="leader-card">
              <div className="leader-photo">
                <img src={person.img} alt={person.name} />
              </div>
              <div className="leader-info">
                <h3>{person.name}</h3>
                <p className="leader-role">{person.role}</p>
                <p className="leader-bio">{person.bio}</p>
                <div className="leader-meta">
                  <div className="leader-meta-row">
                    <MapPin size={16} />
                    <span>Based in Abuja, Nigeria</span>
                  </div>
                  <div className="leader-socials">
                    <a href={person.linkedin}>
                      <Linkedin size={18} />
                    </a>
                    <a href={`mailto:${person.email}`}>
                      <Mail size={18} />
                    </a>
                    <a href={`tel:${person.phone}`}>
                      <Phone size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="about-faq">
        <motion.div
          className="faq-inner"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="faq-header">
            <span className="section-label">FAQs</span>
            <h2>Thinking about investing with us?</h2>
            <p>
              Here are quick answers to some of the questions buyers ask before
              reserving a unit.
            </p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${
                  openFaqIndex === index ? "open" : ""
                }`}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <h4>{faq.question}</h4>
                  {openFaqIndex === index ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                {openFaqIndex === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="faq-footer">
            <p>Ready to review a specific project?</p>
            <Link to="/contact" className="faq-cta">
              Talk to our team <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
