import React from "react";
import { Link, useLocation } from "react-router-dom";

function initials(firstName, lastName) {
  const a = (firstName || "").trim().slice(0, 1).toUpperCase();
  const b = (lastName || "").trim().slice(0, 1).toUpperCase();
  return `${a}${b}`.trim() || "R";
}

function fullName(resident) {
  return `${resident.firstName ?? ""} ${resident.lastName ?? ""}`.trim() || "Unnamed Resident";
}

// PUBLIC_INTERFACE
export default function ResidentListItem({ resident, onSelect }) {
  /** Single resident row used within the list; supports click and keyboard navigation. */
  const location = useLocation();
  const isActive = location.pathname === `/resident/${encodeURIComponent(resident.id)}`;

  return (
    <Link
      to={`/resident/${encodeURIComponent(resident.id)}`}
      onClick={onSelect}
      className={`ResidentItem ${isActive ? "ResidentItemActive" : ""}`}
      role="listitem"
      aria-label={`View details for ${fullName(resident)}`}
    >
      <div className="Avatar" aria-hidden="true">
        {initials(resident.firstName, resident.lastName)}
      </div>
      <div className="ResidentMeta">
        <div className="ResidentNameRow">
          <div className="ResidentName">{fullName(resident)}</div>
          <span className={`StatusPill Status${String(resident.status || "").replace(/\s+/g, "")}`}>
            {resident.status || "—"}
          </span>
        </div>
        <div className="ResidentSub">
          <span className="MetaLabel">Unit</span> <span className="MetaValue">{resident.unit || "—"}</span>
        </div>
      </div>

      <div className="Chevron" aria-hidden="true">
        ›
      </div>
    </Link>
  );
}
