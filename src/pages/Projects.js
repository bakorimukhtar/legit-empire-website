import React, { useEffect, useMemo, useState } from "react";
import "./Projects.css";
import SEO from "../components/SEO";
import {
  Building,
  Layers,
  MapPin,
  Compass,
  SlidersHorizontal,
  ChevronRight,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  ArrowUpRight
} from "lucide-react";

const ADMIN_ORIGIN = "https://admin.legitempirerealestate.com";

const filterOptions = ["All", "Ongoing", "Completed", "Residential", "Commercial"];

// Fallback high-end projects if API returns empty array
const MOCK_PROJECTS = [
  {
    id: 101,
    name: "Legit Gardens Estate",
    location: "Lekki Phase 1, Lagos",
    status: "Ongoing",
    type: "Residential Estate",
    units: "The layout accommodates a total of 30 residential units distributed across three typologies, including 12 detached/duplex units (F1 to F12) positioned in the upper enclave, 10 terrace units (T1 to T10) on the lower-left wing, and 8 semi-detached or villa units (V1 to V8) arranged along the lower-right cluster.",
    size: "The master plan is organized around a tree-lined central boulevard entering from the access road, leading into an open vehicular turnaround and branching into dedicated residential courts with designated surface parking, private plot footprints, and landscaped garden perimeters for each home.",
    description: "A premier gated residential enclave in Lekki Phase 1, engineered for families and forward-thinking property investors seeking maximum wealth preservation and title security.",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    layouts: [
      { id: "l1", label: "Master Site Plan", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" },
      { id: "l2", label: "4-Bed Detached Villa", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80" },
      { id: "l3", label: "3-Bed Terrace Unit", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80" }
    ]
  },
  {
    id: 102,
    name: "Legit Prime Heights",
    location: "Gwarinpa District, Abuja",
    status: "Ongoing",
    type: "Mixed-Use Development",
    units: "24 luxury 3-bedroom apartments, 4 duplex penthouses with private sky terraces, and 12 ground-floor high-street commercial retail suites.",
    size: "14-storey architectural landmark featuring double-height marble lobby, smart biometric elevator access, solar auxiliary power grid, and 2-level basement parking.",
    description: "Iconic mixed-use development combining modern urban apartment living with ground-level luxury commercial retail in the heart of Abuja.",
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    layouts: [
      { id: "l4", label: "Tower Blueprint", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80" },
      { id: "l5", label: "Penthouse Sky Suite", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80" }
    ]
  },
  {
    id: 103,
    name: "Legit Commercial Plaza",
    location: "Central Business District, Abuja",
    status: "Completed",
    type: "Commercial",
    units: "45 grade-A executive office suites, 2 conference auditoriums, and dedicated banking hall facilities.",
    size: "Multi-level corporate headquarters with solar integration, fiber-optic networking, and high-speed elevators.",
    description: "Institutional-grade commercial workspace tailored for multinational corporations, law firms, and tech hubs in Abuja CBD.",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    layouts: [
      { id: "l6", label: "Exterior Elevation", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80" }
    ]
  }
];

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  async function readJsonSafe(res) {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Server returned non-JSON (HTTP ${res.status}).`);
    }
  }

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setError("");

      try {
        const url = new URL("/api/website/listprojects.php", ADMIN_ORIGIN);

        const res = await fetch(url.toString(), {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        const data = await readJsonSafe(res);
        if (!res.ok || !data?.ok) throw new Error(data?.message || "Could not load projects.");

        const rows = Array.isArray(data.projects) && data.projects.length > 0 ? data.projects : MOCK_PROJECTS;
        if (!alive) return;

        setProjects(rows);
        setActiveProjectId(rows[0]?.id ?? null);
        setActiveImageIndex(0);
      } catch (err) {
        if (!alive) return;
        console.warn("Using fallback mock projects due to fetch error:", err);
        setProjects(MOCK_PROJECTS);
        setActiveProjectId(MOCK_PROJECTS[0].id);
        setError("");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;

    if (activeFilter === "Ongoing" || activeFilter === "Completed") {
      return projects.filter((p) => p.status === activeFilter);
    }

    const t = activeFilter.toLowerCase();
    return projects.filter((p) => String(p.type || "").toLowerCase().includes(t));
  }, [projects, activeFilter]);

  const activeProject = useMemo(() => {
    const found = filteredProjects.find((p) => p.id === activeProjectId);
    return found || filteredProjects[0] || projects[0] || null;
  }, [filteredProjects, activeProjectId, projects]);

  const activeImage = useMemo(() => {
    if (!activeProject) return null;
    const layouts = Array.isArray(activeProject.layouts) ? activeProject.layouts : [];

    if (!layouts.length && activeProject.coverImage) {
      return { id: "cover", label: "Cover Perspective", image: activeProject.coverImage };
    }

    return layouts[activeImageIndex] || layouts[0] || null;
  }, [activeProject, activeImageIndex]);

  // Reset active image index when project or filter changes
  useEffect(() => {
    setActiveImageIndex(0);
    if (filteredProjects.length && !filteredProjects.find((p) => p.id === activeProjectId)) {
      setActiveProjectId(filteredProjects[0].id);
    }
  }, [activeFilter, filteredProjects, activeProjectId]);

  return (
    <div className="le-projects-page">
      <SEO
        title="Luxury Real Estate Developments & Estates | Legit Empire"
        description="Explore Legit Empire's published portfolio of residential estates, luxury high-rises, and commercial centers across Lagos and Abuja. Secure high-yield property wealth today."
        keywords="nigerian property developments, gated community lagos, buy house abuja, property investment nigeria, legit empire projects"
      />

      {/* HERO SECTION */}
      <header className="le-projects-hero">
        <div className="le-projects-hero-left">
          <span className="le-badge">Architectural Portfolio</span>
          <h1>Our Real Estate Developments</h1>
          <p className="le-projects-sub">
            Explore published master plans, layout schematics, and estate perspectives delivered by Legit Empire.
          </p>
        </div>

        <div className="le-projects-hero-meta">
          <div className="le-hero-meta-item">
            <span className="le-meta-label">Active Portfolio</span>
            <span className="le-meta-value">{projects.length} Published Developments</span>
          </div>
          <div className="le-hero-meta-item">
            <span className="le-meta-label">Selected Property</span>
            <span className="le-meta-value">{activeProject ? activeProject.name : "—"}</span>
          </div>
        </div>
      </header>

      {/* FILTER CHIPS */}
      <section className="le-projects-filters-bar">
        <div className="le-filters-label">
          <SlidersHorizontal size={14} /> Filter by Category:
        </div>
        <div className="le-filters-list">
          {filterOptions.map((opt) => {
            const count = opt === "All"
              ? projects.length
              : opt === "Ongoing" || opt === "Completed"
              ? projects.filter((p) => p.status === opt).length
              : projects.filter((p) => String(p.type || "").toLowerCase().includes(opt.toLowerCase())).length;

            return (
              <button
                key={opt}
                className={"le-filter-chip" + (activeFilter === opt ? " le-filter-chip-active" : "")}
                onClick={() => setActiveFilter(opt)}
              >
                {opt} <span className="le-filter-count">{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {loading ? (
        <div className="le-projects-loading">
          <div className="le-spinner" />
          <p>Retrieving portfolio developments...</p>
        </div>
      ) : error ? (
        <div className="le-projects-error">{error}</div>
      ) : !activeProject ? (
        <div className="le-projects-empty">
          <p>No published developments match the selected filter criteria.</p>
        </div>
      ) : (
        <>
          {/* MULTI-PROJECT SWITCHER TOOLBAR */}
          {filteredProjects.length > 0 && (
            <section className="le-switcher-section">
              <div className="le-switcher-header">
                <div className="le-switcher-title">
                  <Building size={16} className="le-brass-icon" />
                  <span>Select Property to Inspect ({filteredProjects.length} Available)</span>
                </div>
                <span className="le-switcher-hint">Click any development below to dynamically inspect its layout & specs</span>
              </div>

              <div className="le-switcher-cards-row">
                {filteredProjects.map((p) => {
                  const isSelected = activeProject && activeProject.id === p.id;
                  const thumbSrc = p.coverImage || (p.layouts?.[0]?.image);

                  return (
                    <button
                      key={p.id}
                      className={`le-switcher-card ${isSelected ? "le-switcher-card-active" : ""}`}
                      onClick={() => {
                        setActiveProjectId(p.id);
                        setActiveImageIndex(0);
                      }}
                    >
                      <div className="le-switcher-img-wrap">
                        {thumbSrc ? (
                          <img src={thumbSrc} alt={p.name} className="le-switcher-img" />
                        ) : (
                          <div className="le-switcher-img-fallback"><Building size={24} /></div>
                        )}
                        <span className={`le-switcher-status ${p.status === "Completed" ? "status-completed" : "status-ongoing"}`}>
                          {p.status}
                        </span>
                      </div>
                      <div className="le-switcher-details">
                        <span className="le-switcher-type">{p.type}</span>
                        <h4 className="le-switcher-name">{p.name}</h4>
                        <p className="le-switcher-loc"><MapPin size={12} /> {p.location}</p>
                      </div>
                      {isSelected && <div className="le-switcher-active-indicator" />}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* MAIN FEATURED INSPECTOR LAYOUT */}
          <section className="le-projects-layout">
            {/* LEFT: GALLERY / BLUEPRINT VIEWER */}
            <div className="le-projects-gallery">
              {activeImage && (
                <div className="le-projects-main-image">
                  <img src={activeImage.image} alt={activeImage.label} className="le-projects-main-img" />
                  <div className="le-projects-main-caption">
                    <span className="le-caption-badge">Layout Schematic</span>
                    <span className="le-caption-title">{activeImage.label}</span>
                  </div>
                </div>
              )}

              {/* THUMBNAILS */}
              <div className="le-projects-thumbs">
                {(activeProject.layouts?.length
                  ? activeProject.layouts
                  : activeProject.coverImage
                  ? [{ id: "cover", label: "Cover Perspective", image: activeProject.coverImage }]
                  : []
                ).map((layout, index) => (
                  <button
                    key={layout.id || index}
                    className={"le-project-thumb-btn" + (index === activeImageIndex ? " le-project-thumb-active" : "")}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={layout.image} alt={layout.label} className="le-project-thumb-img" />
                    <span>{layout.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: DETAILS & ARCHITECTURAL SPECIFICATION SHEET */}
            <aside className="le-projects-side-card">
              <div className="le-side-card-top">
                <span className={`le-project-pill ${activeProject.status === "Completed" ? "pill-completed" : "pill-ongoing"}`}>
                  {activeProject.status === "Completed" ? <CheckCircle size={12} /> : <Clock size={12} />}
                  {activeProject.status}
                </span>
                <span className="le-project-id-tag">REF-{String(activeProject.id).padStart(4, "0")}</span>
              </div>

              <h2>{activeProject.name}</h2>
              <p className="le-project-side-location"><MapPin size={14} /> {activeProject.location}</p>
              <p className="le-project-side-text">{activeProject.description}</p>

              {/* CLEAN ARCHITECTURAL SPECIFICATIONS SHEET */}
              <div className="le-project-specs-sheet">
                <div className="le-specs-header">
                  <FileText size={15} />
                  <span>Architectural Specifications & Master Plan</span>
                </div>

                <div className="le-spec-card">
                  <div className="le-spec-top">
                    <div className="le-spec-icon"><Building size={15} /></div>
                    <span className="le-spec-label">Development Type</span>
                  </div>
                  <div className="le-spec-value-main">{activeProject.type || "Residential Estate"}</div>
                </div>

                <div className="le-spec-card">
                  <div className="le-spec-top">
                    <div className="le-spec-icon"><Layers size={15} /></div>
                    <span className="le-spec-label">Configuration & Typology</span>
                  </div>
                  <div className="le-spec-value-text">
                    {activeProject.units || "Detailed layout configuration available upon request."}
                  </div>
                </div>

                <div className="le-spec-card">
                  <div className="le-spec-top">
                    <div className="le-spec-icon"><Compass size={15} /></div>
                    <span className="le-spec-label">Master Plan & Layout</span>
                  </div>
                  <div className="le-spec-value-text">
                    {activeProject.size || "Master plan schematic available in official sales dossier."}
                  </div>
                </div>
              </div>

              <div className="le-project-side-footer">
                <p>For pricing, payment structures, and legal title allocation, speak with our sales advisors.</p>
                <a href="/schedule" className="le-projects-cta-btn">
                  Book Site Inspection <ArrowUpRight size={16} />
                </a>
              </div>
            </aside>
          </section>

          {/* ALL DEVELOPMENTS DIRECTORY CATALOG GRID */}
          <section className="le-projects-catalog-section">
            <div className="le-catalog-head">
              <div>
                <span className="le-badge">Full Directory</span>
                <h2>Master Portfolio Catalog ({filteredProjects.length})</h2>
                <p>Browse all published estates, mixed-use towers, and commercial developments.</p>
              </div>
            </div>

            <div className="le-catalog-grid">
              {filteredProjects.map((p) => {
                const isSelected = activeProject && activeProject.id === p.id;
                const cover = p.coverImage || p.layouts?.[0]?.image;

                return (
                  <div key={p.id} className={`le-catalog-card ${isSelected ? "is-selected-card" : ""}`}>
                    <div className="le-catalog-thumb-wrap">
                      {cover ? (
                        <img src={cover} alt={p.name} className="le-catalog-img" />
                      ) : (
                        <div className="le-catalog-img-fallback"><Building size={32} /></div>
                      )}
                      <span className={`le-catalog-status ${p.status === "Completed" ? "status-completed" : "status-ongoing"}`}>
                        {p.status}
                      </span>
                    </div>

                    <div className="le-catalog-body">
                      <span className="le-catalog-type">{p.type}</span>
                      <h3>{p.name}</h3>
                      <p className="le-catalog-loc"><MapPin size={14} /> {p.location}</p>
                      <p className="le-catalog-desc">{p.description}</p>

                      <div className="le-catalog-footer">
                        <button
                          className="le-catalog-btn"
                          onClick={() => {
                            setActiveProjectId(p.id);
                            setActiveImageIndex(0);
                            window.scrollTo({ top: 350, behavior: "smooth" });
                          }}
                        >
                          {isSelected ? "Currently Inspecting" : "Inspect Specifications"} <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Projects;
