import React, { useEffect } from "react";
import "./ComingSoon.css";
import { motion } from "framer-motion";
import { Hammer, ArrowLeft, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const ComingSoon = () => {
  useEffect(() => {
    document.title = "Coming Soon | Legit Empire";
  }, []);

  return (
    <motion.div
      className="coming-soon-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className="coming-soon-wrapper">
        <motion.div
          className="coming-soon-card"
          initial={{ y: 30, opacity: 0, scale: 0.96 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          viewport={{ margin: "-80px" }} // replays on scroll
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="coming-icon-shell">
            <motion.div
              className="coming-main-icon"
              animate={{ rotate: [0, -8, 8, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            >
              <Hammer size={42} />
            </motion.div>

            <motion.div
              className="coming-accent-icon"
              initial={{ x: 12, y: -18, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
            >
              <Rocket size={28} />
            </motion.div>
          </div>

          <h1>Something new is coming.</h1>
          <p>
            This part of the Legit Empire experience is still being crafted.
            The page will go live soon with new features and project updates.
          </p>

          <div className="coming-tag-row">
            <span className="coming-tag">Secure by design</span>
            <span className="coming-tag">Real estate, done right</span>
          </div>

          <Link to="/" className="coming-back-link">
            <motion.button
              className="back-home-btn"
              whileHover={{
                y: -2,
                boxShadow: "0 16px 30px rgba(15,23,42,0.28)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft size={18} />
              Back to Home
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default ComingSoon;
