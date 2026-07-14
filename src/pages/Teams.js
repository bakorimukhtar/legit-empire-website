import React, { useState, useEffect } from "react";
import "./Teams.css";
import SEO from "../components/SEO";
import { motion } from "framer-motion";
import {
  MapPin,
  Users,
  ArrowLeft,
  Mail,
  Linkedin,
  Phone,
  Instagram,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

// Admin API origin (without trailing slash)
const ADMIN_ORIGIN = "https://admin.legitempirerealestate.com";

const Teams = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Our Team | Legit Empire";
    window.scrollTo(0, 0);

    // Fetch the ordered team roster from the live database API
    fetch(`${ADMIN_ORIGIN}/api/website/get_teams.php`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load team roster");
        return res.json();
      })
      .then((data) => {
        if (data.ok && data.members) {
          setTeamMembers(data.members);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching teams:", err);
        setLoading(false);
      });
  }, []);

  // Helper to extract initials for placeholder cards
  const getInitials = (name) => {
    if (!name) return "LE";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="teams-roster-page">
      <SEO
        title="Meet the Legit Empire Team | Professional Property Operators"
        description="Meet the directors, construction specialists, and real estate professionals behind our premium Nigerian developments."
        keywords="legit empire team, real estate experts abuja, property developers nigeria, salisu mamman team"
      />
      {/* HERO / HEADER SECTION */}
      <section className="teams-roster-hero">
        <motion.div
          className="teams-hero-inner"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="teams-pill">The Legit Empire Team</span>
          <h1>Stewarded by disciplined execution</h1>
          <p>
            Meet the developers, legal compliance experts, construction engineers, and client coordinators 
            who build trusted property wealth for modern Nigeria.
          </p>
        </motion.div>
      </section>

      {/* ROSTER SECTION */}
      <section className="teams-roster-section">
        {loading ? (
          <div className="teams-loading-spinner">
            <div className="spinner-ring"></div>
            <p>Loading Legit Empire roster...</p>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="teams-empty-state">
            <Users size={48} className="empty-state-icon" />
            <h3>No team members listed</h3>
            <p>
              Please log in to your admin dashboard to upload and publish team profiles.
            </p>
            <Link to="/" className="btn-back-home">
              <ArrowLeft size={16} /> Back to Home
            </Link>
          </div>
        ) : (
          <div className="roster-grid">
            {teamMembers.map((member, idx) => {
              const isExecutive = idx === 0 || idx === 1; // CEO and MD
              return (
                <motion.article
                  key={member.id}
                  className={`roster-card ${isExecutive ? "executive-featured" : ""}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                >
                  {/* Photo Frame */}
                  <div className="roster-photo-frame">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={`${member.name} - ${member.role}`}
                        loading="lazy"
                      />
                    ) : (
                      <div className="roster-photo-placeholder">
                        <span className="roster-placeholder-initials">
                          {getInitials(member.name)}
                        </span>
                        <span className="roster-placeholder-label">Legit Empire</span>
                      </div>
                    )}
                    {isExecutive && (
                      <div className="roster-overlay-badge">
                        <span className="featured-badge">
                          <ShieldCheck size={12} /> Executive
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info Details */}
                  <div className="roster-card-info">
                    <div className="roster-meta-row">
                      <h3>{member.name}</h3>
                      <p className="roster-role">{member.role}</p>
                    </div>

                    <p className="roster-bio">
                      {member.description || 
                        `Dedicated specialist committed to helping Legit Empire deliver high-value, secure real estate investments across primary growth hubs.`}
                    </p>

                    <div className="roster-card-footer">
                      <div className="roster-location">
                        <MapPin size={14} />
                        <span>Based in Abuja</span>
                      </div>

                      <div className="roster-socials-group">
                        <a
                          href="mailto:info@legitempire.com"
                          aria-label={`Email ${member.name}`}
                          title="Email"
                        >
                          <Mail size={16} />
                        </a>
                        <a
                          href="https://linkedin.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`LinkedIn of ${member.name}`}
                          title="LinkedIn"
                        >
                          <Linkedin size={16} />
                        </a>
                        <a
                          href="https://instagram.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Instagram of ${member.name}`}
                          title="Instagram"
                        >
                          <Instagram size={16} />
                        </a>
                        <a
                          href="tel:+2348100789541"
                          aria-label={`Call ${member.name}`}
                          title="Call"
                        >
                          <Phone size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Teams;