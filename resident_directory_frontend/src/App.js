import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import ResidentList from "./components/ResidentList";
import ResidentDetail from "./components/ResidentDetail";
import { getResidents } from "./services/residentsApi";

/**
 * Internal routed app (kept separate so BrowserRouter is only created once).
 */
function RoutedApp() {
  const navigate = useNavigate();

  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setLoadError("");
        const data = await getResidents();
        if (!cancelled) setResidents(data);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : "Failed to load residents");
          setResidents([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredResidents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return residents;

    return residents.filter((r) => {
      const fullName = `${r.firstName ?? ""} ${r.lastName ?? ""}`.trim().toLowerCase();
      return fullName.includes(normalized);
    });
  }, [query, residents]);

  const onSelectResident = (id) => {
    navigate(`/resident/${encodeURIComponent(id)}`);
  };

  return (
    <div className="App">
      <Header query={query} onQueryChange={setQuery} />
      <main className="Main" aria-busy={loading ? "true" : "false"}>
        <section className="ListPane" aria-label="Resident list">
          <div className="PaneHeader">
            <div className="PaneTitleRow">
              <h2 className="PaneTitle">Residents</h2>
              <span className="Badge" aria-label="Resident count">
                {filteredResidents.length}
              </span>
            </div>

            {loadError ? (
              <div className="Alert AlertError" role="alert">
                <strong>Could not load residents.</strong> {loadError}
                <div className="AlertHint">
                  Tip: set <code>REACT_APP_API_BASE</code> to a server that responds to{" "}
                  <code>/residents</code>, or use mock data (default).
                </div>
              </div>
            ) : null}
          </div>

          <ResidentList
            residents={filteredResidents}
            loading={loading}
            onSelectResident={onSelectResident}
          />
        </section>

        <section className="DetailPane" aria-label="Resident details">
          <Routes>
            <Route path="/" element={<EmptyState />} />
            <Route
              path="/resident/:residentId"
              element={<ResidentDetailRoute residents={residents} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </section>
      </main>

      <footer className="Footer">
        <span className="FooterText">
          Resident Directory • Light theme • Accents: <span className="Swatch SwatchPrimary" />{" "}
          <span className="Swatch SwatchSuccess" />
        </span>
      </footer>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="EmptyState" role="status" aria-live="polite">
      <div className="EmptyIcon" aria-hidden="true">
        ⌁
      </div>
      <h3 className="EmptyTitle">Select a resident</h3>
      <p className="EmptyDescription">
        Choose a resident from the list to view details. Use the search bar to filter by name.
      </p>
    </div>
  );
}

function ResidentDetailRoute({ residents }) {
  const { residentId } = useParams();

  const resident = useMemo(() => {
    if (!residentId) return null;
    return residents.find((r) => String(r.id) === String(residentId)) ?? null;
  }, [residentId, residents]);

  return <ResidentDetail resident={resident} />;
}

// PUBLIC_INTERFACE
function App() {
  /** Root app entrypoint for Resident Directory (frontend-only). */
  return (
    <BrowserRouter>
      <RoutedApp />
    </BrowserRouter>
  );
}

export default App;
