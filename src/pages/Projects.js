import React, { useState } from "react";
import "./Projects.css";

// IMPORT LOCAL IMAGES FOR APO ABUJA
import FrontSidedView from "../projects/APO ABUJA/front sided view.JPG";
import FrontView from "../projects/APO ABUJA/FRONT VIEW.JPG";
import LeftView from "../projects/APO ABUJA/LEFT VIEW.JPG";
import SideView from "../projects/APO ABUJA/SIDE VIEW.JPG";
import Swimming from "../projects/APO ABUJA/Swimming.JPG";
import SiteLayout from "../projects/APO ABUJA/Site layout.jpeg";

const projects = [
  {
    id: 1,
    name: "Apo Abuja Estate",
    location: "Apo, Abuja",
    status: "Ongoing",
    type: "Residential Estate",
    coverImage: FrontView,
    units: "Fully detached, semi-detached & terraces",
    size: "Site development layout",
    description:
      "Premium gated residential community in Apo Abuja with fully detached, semi-detached and terrace units, mosque, recreational area and ample green spaces.",
    layouts: [
      { id: "layout", label: "Site development layout", image: SiteLayout },
      { id: "front", label: "Front view", image: FrontView },
      { id: "frontSide", label: "Front sided view", image: FrontSidedView },
      { id: "left", label: "Left view", image: LeftView },
      { id: "side", label: "Side view", image: SideView },
      { id: "pool", label: "Swimming / recreational", image: Swimming },
    ],
  },
];

const filterOptions = ["All", "Ongoing", "Completed", "Residential", "Commercial"];

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeProjectId, setActiveProjectId] = useState(projects[0]?.id || null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => {
          if (activeFilter === "Ongoing" || activeFilter === "Completed") {
            return p.status === activeFilter;
          }
          return p.type.toLowerCase().includes(activeFilter.toLowerCase());
        });

  const activeProject =
    filteredProjects.find((p) => p.id === activeProjectId) ||
    filteredProjects[0] ||
    null;

  const activeImage =
    activeProject && activeProject.layouts[activeImageIndex]
      ? activeProject.layouts[activeImageIndex]
      : null;

  return (
    <div className="le-projects-page">
      {/* HERO */}
      <header className="le-projects-hero">
        <div>
          <p className="le-badge">Projects</p>
          <h1>Apo Abuja estate development</h1>
          <p className="le-projects-sub">
            View the full site development layout and 3D perspectives for Legit
            Empire’s flagship Apo Abuja residential estate.
          </p>
        </div>
        <div className="le-projects-hero-meta">
          <div>
            <span className="le-meta-label">Current Project</span>
            <span className="le-meta-value">Apo Abuja</span>
          </div>
          <div>
            <span className="le-meta-label">Project Status</span>
            <span className="le-meta-value">{projects[0].status}</span>
          </div>
        </div>
      </header>

      {/* FILTERS */}
      <section className="le-projects-filters">
        {filterOptions.map((opt) => (
          <button
            key={opt}
            className={
              "le-filter-chip" +
              (activeFilter === opt ? " le-filter-chip-active" : "")
            }
            onClick={() => setActiveFilter(opt)}
          >
            {opt}
          </button>
        ))}
      </section>

      {/* MAIN LAYOUT: GALLERY + INFO */}
      {activeProject && (
        <section className="le-projects-layout">
          {/* LEFT: MAIN IMAGE + THUMBNAILS */}
          <div className="le-projects-gallery">
            {activeImage && (
              <div className="le-projects-main-image">
                <img
                  src={activeImage.image}
                  alt={activeImage.label}
                  className="le-projects-main-img"
                />
                <div className="le-projects-main-caption">
                  <span>{activeImage.label}</span>
                </div>
              </div>
            )}

            <div className="le-projects-thumbs">
              {activeProject.layouts.map((layout, index) => (
                <button
                  key={layout.id}
                  className={
                    "le-project-thumb-btn" +
                    (index === activeImageIndex ? " le-project-thumb-active" : "")
                  }
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img
                    src={layout.image}
                    alt={layout.label}
                    className="le-project-thumb-img"
                  />
                  <span>{layout.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: PROJECT DETAILS CARD */}
          <aside className="le-projects-side-card">
            <p className="le-project-pill">{activeProject.status}</p>
            <h2>{activeProject.name}</h2>
            <p className="le-project-side-location">{activeProject.location}</p>
            <p className="le-project-side-text">{activeProject.description}</p>

            <div className="le-project-side-meta">
              <div>
                <span className="le-side-label">Development type</span>
                <span className="le-side-value">{activeProject.type}</span>
              </div>
              <div>
                <span className="le-side-label">Configuration</span>
                <span className="le-side-value">{activeProject.units}</span>
              </div>
              <div>
                <span className="le-side-label">Layout</span>
                <span className="le-side-value">{activeProject.size}</span>
              </div>
            </div>

            <div className="le-project-side-footer">
              <p>
                For full brochure, pricing and allocation details, please speak
                with the Legit Empire sales team.
              </p>
              <a href="/schedule" className="le-projects-cta-btn">
                Book site inspection
              </a>
            </div>
          </aside>
        </section>
      )}
    </div>
  );
};

export default Projects;
