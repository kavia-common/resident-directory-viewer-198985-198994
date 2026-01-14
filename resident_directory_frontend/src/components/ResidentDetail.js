import React from "react";
import { Link, useLocation } from "react-router-dom";

function fullName(resident) {
  return `${resident.firstName ?? ""} ${resident.lastName ?? ""}`.trim() || "Unnamed Resident";
}

function Field({ label, value }) {
  return (
    <div className="DetailField">
      <div className="DetailLabel">{label}</div>
      <div className="DetailValue">{value || "—"}</div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function ResidentDetail({ resident }) {
  /** Detail panel for a selected resident. */
  const location = useLocation();

  if (!resident) {
    return (
      <div className="DetailCard" role="status" aria-live="polite">
        <div className="DetailTop">
          <h2 className="DetailTitle">Resident not found</h2>
          <Link to="/" className="BackLink" aria-label="Back to resident list">
            Back
          </Link>
        </div>
        <p className="DetailMuted">
          The selected resident could not be found in the current list. If you are using an API,
          the data may have changed.
        </p>
      </div>
    );
  }

  return (
    <div className="DetailCard">
      <div className="DetailTop">
        <div>
          <div className="DetailKicker">Resident Profile</div>
          <h2 className="DetailTitle">{fullName(resident)}</h2>
          <div className="DetailSubtitle">
            Unit <strong>{resident.unit || "—"}</strong>
          </div>
        </div>

        {location.pathname !== "/" ? (
          <Link to="/" className="BackLink" aria-label="Back to resident list">
            Back
          </Link>
        ) : null}
      </div>

      <div className="DetailGrid" role="group" aria-label="Resident contact and status">
        <Field label="Status" value={resident.status} />
        <Field label="Move-in date" value={resident.moveInDate} />
        <Field label="Phone" value={resident.phone} />
        <Field label="Email" value={resident.email} />
      </div>

      <div className="Divider" role="separator" />

      <div className="DetailSection">
        <h3 className="SectionTitle">Emergency Contact</h3>
        {resident.emergencyContact ? (
          <div className="DetailGrid">
            <Field label="Name" value={resident.emergencyContact.name} />
            <Field label="Relationship" value={resident.emergencyContact.relationship} />
            <Field label="Phone" value={resident.emergencyContact.phone} />
          </div>
        ) : (
          <p className="DetailMuted">No emergency contact on file.</p>
        )}
      </div>

      <div className="Divider" role="separator" />

      <div className="DetailSection">
        <h3 className="SectionTitle">Notes</h3>
        <p className="NotesBox">{resident.notes || "No notes."}</p>
      </div>
    </div>
  );
}
