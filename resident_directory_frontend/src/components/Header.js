import React from "react";

// PUBLIC_INTERFACE
export default function Header({ query, onQueryChange }) {
  /** App header with title and search input. */
  return (
    <header className="Header">
      <div className="HeaderInner">
        <div className="Brand" aria-label="Application title">
          <div className="LogoMark" aria-hidden="true">
            RD
          </div>
          <div className="BrandText">
            <div className="BrandTitle">Resident Directory</div>
            <div className="BrandSubtitle">Search and view resident details</div>
          </div>
        </div>

        <div className="SearchWrap">
          <label className="SrOnly" htmlFor="resident-search">
            Search residents by name
          </label>
          <div className="SearchField">
            <span className="SearchIcon" aria-hidden="true">
              ⌕
            </span>
            <input
              id="resident-search"
              className="SearchInput"
              type="search"
              inputMode="search"
              placeholder="Search by name…"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              aria-label="Search residents by name"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
