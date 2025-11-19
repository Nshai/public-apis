import React from 'react'
import './Summary.css'

function Summary({ summary }) {
  return (
    <div className="summary">
      <h2>Summary</h2>
      <div className="summary-grid">
        <div className="summary-item">
          <div className="summary-label">Total Public APIs</div>
          <div className="summary-value">{summary.totalApis}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">On Developer Portal</div>
          <div className="summary-value">{summary.onPortal}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Not on Portal</div>
          <div className="summary-value">{summary.notOnPortal}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">With OAuth Scopes</div>
          <div className="summary-value">{summary.withScopes}</div>
        </div>
      </div>
    </div>
  )
}

export default Summary
