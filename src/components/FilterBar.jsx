import React from 'react'
import './FilterBar.css'

function FilterBar({ filterText, onFilterChange, resultCount, totalCount }) {
  return (
    <div className="filter-bar">
      <div className="filter-input-container">
        <input
          type="text"
          className="filter-input"
          placeholder="Filter by tags, operation ID, endpoint, description, or service..."
          value={filterText}
          onChange={(e) => onFilterChange(e.target.value)}
        />
        {filterText && (
          <button
            className="clear-button"
            onClick={() => onFilterChange('')}
            title="Clear filter"
          >
            ✕
          </button>
        )}
      </div>
      <div className="filter-results">
        Showing {resultCount} of {totalCount} APIs
      </div>
    </div>
  )
}

export default FilterBar
