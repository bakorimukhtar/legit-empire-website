import React, { useEffect, useMemo, useState } from "react";
import "./Projects.css";
import SEO from "../components/SEO";

const ADMIN_ORIGIN = "https://admin.legitempirerealestate.com";

// Map your existing filter chips to API filters
const filterOptions = ["All", "Ongoing", "Completed", "Residential", "Commercial"];

function typeFromChip(chip) {
  if (chip === "Residential") return "Residential Estate";
  if (chip === "Commercial") return "Commercial";
  return "";
}

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;

    if (activeFilter === "Ongoing" || activeFilter === "Completed") {
      return projects.filter((p) => p.status === activeFilter);
    }

    // Residential/Commercial chip -> match by type text
    const t = activeFilter.toLowerCase();
    return projects.filter((p) => String(p.type || "").toLowerCase().includes(t));
  }, [projects, activeFilter]);

  const activeProject = useMemo(() => {
    const found = filteredProjects.find((p) => p.id === activeProjectId);
    return found || filteredProjects[0] || null;
  }, [filteredProjects, activeProjectId]);

  const activeImage = useMemo(() => {
    if (!activeProject) return null;
    const layouts = Array.isArray(activeProject.layouts) ? activeProject.layouts : [];

    // if no layouts, show coverImage as a pseudo-layout
    if (!layouts.length && activeProject.coverImage) {
      return { id: "cover", label: "Cover", image: activeProject.coverImage };
    }

    return layouts[activeImageIndex] || layouts[0] || null;
  }, [activeProject, activeImageIndex]);

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

        // If you want API-side filtering instead of client filtering, uncomment:
        // if (activeFilter === "Ongoing" || activeFilter === "Completed") url.searchParams.set("status", activeFilter);
        // const t = typeFromChip(activeFilter); if (t) url.searchParams.set("type", t);

        const res = await fetch(url.toString(), {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        const data = await readJsonSafe(res);
        if (!res.ok || !data?.ok) throw new Error(data?.message || "Could not load projects.");

        const rows = Array.isArray(data.projects) ? data.projects : [];
        if (!alive) return;

        setProjects(rows);

        // set default active project
        setActiveProjectId(rows[0]?.id ?? null);
        setActiveImageIndex(0);
      } catch (err) {
        if (!alive) return;
        setProjects([]);
        setActiveProjectId(null);
        setError(String(err?.message || "Could not load projects."));
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // Reset active image when project or filter changes
  useEffect(() => {
    setActiveImageIndex(0);
    if (filteredProjects.length && !filteredProjects.find((p) => p.id === activeProjectId)) {
      setActiveProjectId(filteredProjects[0].id);
    }
  }, [activeFilter, filteredProjects, activeProjectId]);

  return (
    <div className="le-projects-page">
      <SEO
        title="Luxury Residential Estates & Gated Communities | Legit Empire"
        description="Explore Legit Empire's premium portfolio of residential estates, high-rise towers, and commercial properties. Secure high-yield property investment opportunities in Abuja and Lagos."
        keywords="nigerian property developments, gated community lagos, buy house abuja, property investment nigeria, legit empire projects"
      />
      {/* HERO */}
      <header className="le-projects-hero">
        <div>
          <p className="le-badge">Projects</p>
          <h1>Our real estate developments</h1>
          <p className="le-projects-sub">
            Explore our published projects, layouts and perspectives.
          </p>
        </div>

        <div className="le-projects-hero-meta">
          <div>
            <span className="le-meta-label">Current Project</span>
            <span className="le-meta-value">{activeProject ? activeProject.name : "—"}</span>
          </div>
          <div>
            <span className="le-meta-label">Project Status</span>
            <span className="le-meta-value">{activeProject ? activeProject.status : "—"}</span>
          </div>
        </div>
      </header>

      {/* FILTERS */}
      <section className="le-projects-filters">
        {filterOptions.map((opt) => (
          <button
            key={opt}
            className={"le-filter-chip" + (activeFilter === opt ? " le-filter-chip-active" : "")}
            onClick={() => setActiveFilter(opt)}
          >
            {opt}
          </button>
        ))}
      </section>

      {loading ? (
        <p style={{ padding: "12px 0" }}>Loading projects…</p>
      ) : error ? (
        <p style={{ padding: "12px 0", color: "#b42318" }}>{error}</p>
      ) : !activeProject ? (
        <p style={{ padding: "12px 0" }}>No published projects available.</p>
      ) : (
        <section className="le-projects-layout">
          {/* LEFT: MAIN IMAGE + THUMBNAILS */}
          <div className="le-projects-gallery">
            {activeImage && (
              <div className="le-projects-main-image">
                <img src={activeImage.image} alt={activeImage.label} className="le-projects-main-img" />
                <div className="le-projects-main-caption">
                  <span>{activeImage.label}</span>
                </div>
              </div>
            )}

            <div className="le-projects-thumbs">
              {(activeProject.layouts?.length ? activeProject.layouts : activeProject.coverImage ? [{ id: "cover", label: "Cover", image: activeProject.coverImage }] : [])
                .map((layout, index) => (
                  <button
                    key={layout.id}
                    className={"le-project-thumb-btn" + (index === activeImageIndex ? " le-project-thumb-active" : "")}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={layout.image} alt={layout.label} className="le-project-thumb-img" />
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
              <p>For full brochure, pricing and allocation details, please speak with the Legit Empire sales team.</p>
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
