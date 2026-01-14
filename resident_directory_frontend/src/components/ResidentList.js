import React from "react";
import ResidentListItem from "./ResidentListItem";

function LoadingList() {
  return (
    <div className="List" aria-label="Loading residents">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="SkeletonCard" aria-hidden="true">
          <div className="SkeletonRow">
            <div className="SkeletonAvatar" />
            <div className="SkeletonLines">
              <div className="SkeletonLine SkeletonLineLong" />
              <div className="SkeletonLine SkeletonLineShort" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
export default function ResidentList({ residents, loading, onSelectResident }) {
  /** Resident list (filtering is done upstream). */
  if (loading) return <LoadingList />;

  if (!residents.length) {
    return (
      <div className="EmptyList" role="status" aria-live="polite">
        <h3 className="EmptyListTitle">No matches</h3>
        <p className="EmptyListDescription">Try a different name, or clear the search.</p>
      </div>
    );
  }

  return (
    <div className="List" role="list">
      {residents.map((resident) => (
        <ResidentListItem
          key={resident.id}
          resident={resident}
          onSelect={() => onSelectResident(resident.id)}
        />
      ))}
    </div>
  );
}
