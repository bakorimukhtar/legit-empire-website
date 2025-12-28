import React from "react";
import "./Services.css";
import { motion } from "framer-motion";
import {
  Building2,
  Home,
  FileCheck2,
  LineChart,
  Handshake,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = {
  initial: { y: 30, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { margin: "-100px" }, // no once:true so it replays
  transition: { duration: 0.6, ease: "easeOut" },
};

const Services = () => {
  const coreServices = [
    {
      icon: <Building2 size={26} />,
      label: "Estate Development",
      title: "From site acquisition to handover.",
      text: "We acquire and structure prime locations, deliver layouts, infrastructure, and finished units that meet both lifestyle and investment expectations.",
      tags: ["Site acquisition", "Master planning", "Construction oversight"],
    },
    {
      icon: <Home size={26} />,
      label: "Project Sales & Allocation",
      title: "Curated units with clear documentation.",
      text: "Our sales team matches buyers to units, manages allocations, and keeps all paperwork transparent from first inspection to closing.",
      tags: ["Sales strategy", "Allocation", "Client onboarding"],
    },
    {
      icon: <FileCheck2 size={26} />,
      label: "Title & Documentation Support",
      title: "Reducing friction around paperwork.",
      text: "We work with trusted legal partners to support due diligence, title perfection and regulatory approvals on each development.",
      tags: ["Due diligence", "Title perfection", "Regulatory liaison"],
    },
  ];

  const advisoryServices = [
    {
      icon: <LineChart size={24} />,
      title: "Investment advisory",
      text: "Helping individual and institutional investors structure entries into growth corridors and off‑plan opportunities.",
    },
    {
      icon: <Handshake size={24} />,
      title: "Joint‑venture structuring",
      text: "Partnering with landowners and capital partners to unlock high‑value projects with clear risk‑sharing frameworks.",
    },
    {
      icon: <MapPin size={24} />,
      title: "Location strategy",
      text: "Identifying micro‑locations where infrastructure, demand and long‑term value align for sustainable projects.",
    },
  ];

  return (
    <div className="services-page">
      {/* HERO */}
      <section className="services-hero">
        <motion.div
          className="services-hero-text"
          initial={fadeUp.initial}
          whileInView={fadeUp.whileInView}
          viewport={fadeUp.viewport}
          transition={fadeUp.transition}
        >
          <span className="services-pill">What we do</span>
          <h1>Development, sales, and advisory for modern estates.</h1>
          <p>
            Legit Empire Real Estate provides end‑to‑end support for buyers,
            investors and partners—from the first feasibility study to final
            handover and after‑sales support.
          </p>
          <div className="services-hero-cta">
            <Link to="/projects" className="btn-brown">
              View sample projects <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="hero-secondary-link">
              Discuss a new brief
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="services-hero-panel"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
        >
          <div className="hero-panel-grid">
            <div className="hero-panel-item">
              <h3>For home buyers</h3>
              <p>
                Transparent off‑plan and ready units with clear payment plans
                and documentation.
              </p>
            </div>
            <div className="hero-panel-item">
              <h3>For investors</h3>
              <p>
                Structured opportunities in growth locations, backed by
                disciplined execution.
              </p>
            </div>
            <div className="hero-panel-item">
              <h3>For landowners</h3>
              <p>
                Joint‑venture models that turn under‑used land into bankable
                developments.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CORE SERVICES */}
      <section className="services-core">
        <motion.div
          className="section-head"
          initial={fadeUp.initial}
          whileInView={fadeUp.whileInView}
          viewport={fadeUp.viewport}
          transition={fadeUp.transition}
        >
          <span className="section-label">Core services</span>
          <h2>How we turn land into livable communities.</h2>
          <p>
            Each project is managed as a complete life‑cycle—from concept and
            approvals, through construction, sales and after‑sales support.
          </p>
        </motion.div>

        <motion.div
          className="core-grid"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ margin: "-120px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
        >
          {coreServices.map((service, index) => (
            <motion.article
              key={index}
              className="service-card"
              whileHover={{
                y: -6,
                boxShadow: "0 22px 50px rgba(15,23,42,0.25)",
              }}
              transition={{ duration: 0.25 }}
            >
              <div className="service-label-row">
                <div className="service-icon">{service.icon}</div>
                <span>{service.label}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <div className="service-tags">
                {service.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* ADVISORY STRIP */}
      <section className="services-advisory">
        <motion.div
          className="advisory-inner"
          initial={fadeUp.initial}
          whileInView={fadeUp.whileInView}
          viewport={fadeUp.viewport}
          transition={fadeUp.transition}
        >
          <div className="advisory-copy">
            <span className="section-label light">Advisory</span>
            <h2>Strategic support for serious investors.</h2>
            <p>
              Beyond individual projects, we help clients think through
              portfolio mix, timing and entry strategy so that each acquisition
              fits into a clear plan.
            </p>
          </div>
          <div className="advisory-grid">
            {advisoryServices.map((item, index) => (
              <div key={index} className="advisory-card">
                <div className="advisory-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* PROCESS TIMELINE */}
      <section className="services-process">
        <motion.div
          className="section-head"
          initial={fadeUp.initial}
          whileInView={fadeUp.whileInView}
          viewport={fadeUp.viewport}
          transition={fadeUp.transition}
        >
          <span className="section-label">Our process</span>
          <h2>A clear path from idea to keys‑in‑hand.</h2>
          <p>
            Every engagement follows a structured process so you always know
            what has been completed and what comes next.
          </p>
        </motion.div>

        <motion.ol
          className="process-steps"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
        >
          <li>
            <h3>01 — Discovery & feasibility</h3>
            <p>
              We align on goals, review the site or brief, and conduct initial
              feasibility and costings.
            </p>
          </li>
          <li>
            <h3>02 — Structuring & design</h3>
            <p>
              We define the product mix, layouts, and partnership or payment
              structures best suited to the project.
            </p>
          </li>
          <li>
            <h3>03 — Approvals & launch</h3>
            <p>
              Regulatory approvals are secured, marketing materials prepared,
              and sales or investment launch is executed.
            </p>
          </li>
          <li>
            <h3>04 — Delivery & after‑sales</h3>
            <p>
              Construction, finishing and documentation handover are completed,
              followed by ongoing client support.
            </p>
          </li>
        </motion.ol>
      </section>

      {/* CTA */}
      <section className="services-cta">
        <motion.div
          className="services-cta-inner"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="cta-copy">
            <h2>Have a site or project you&apos;d like us to look at?</h2>
            <p>
              Share the basics of your brief and the team will respond with
              timelines and next steps for a structured engagement.
            </p>
          </div>
          <div className="cta-actions">
            <Link to="/contact" className="btn-brown">
              Start a conversation <ArrowRight size={16} />
            </Link>
            <Link to="/projects" className="hero-secondary-link">
              Review completed work
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Services;
