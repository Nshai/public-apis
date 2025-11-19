import React, { useState, useEffect } from 'react'
import './ApiTable.css'

function ApiTable({ apis }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [showColumnCustomizer, setShowColumnCustomizer] = useState(false)

  // Define all available columns
  const allColumns = [
    { key: 'tags', label: 'Tags', sortable: true },
    { key: 'operationId', label: 'Operation ID', sortable: true },
    { key: 'method', label: 'Method', sortable: true },
    { key: 'endpoint', label: 'Endpoint', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'scopes', label: 'Scopes', sortable: false },
    { key: 'onPortal', label: 'On Portal', sortable: true },
    { key: 'service', label: 'Service', sortable: true },
    { key: 'source', label: 'Source', sortable: true }
  ]

  // Load visible columns from localStorage or use defaults
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem('apiTableVisibleColumns')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return allColumns.map(col => col.key)
      }
    }
    return allColumns.map(col => col.key)
  })

  // Save visible columns to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('apiTableVisibleColumns', JSON.stringify(visibleColumns))
  }, [visibleColumns])

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedApis = React.useMemo(() => {
    if (!sortConfig.key) return apis

    return [...apis].sort((a, b) => {
      const aVal = a[sortConfig.key].toLowerCase()
      const bVal = b[sortConfig.key].toLowerCase()

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [apis, sortConfig])

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return ''
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼'
  }

  const getMethodClass = (method) => {
    return `method-badge method-${method.toLowerCase()}`
  }

  const toggleColumn = (columnKey) => {
    setVisibleColumns(prev => {
      if (prev.includes(columnKey)) {
        // Don't allow hiding all columns
        if (prev.length === 1) return prev
        return prev.filter(key => key !== columnKey)
      } else {
        return [...prev, columnKey]
      }
    })
  }

  const toggleAllColumns = (show) => {
    if (show) {
      setVisibleColumns(allColumns.map(col => col.key))
    } else {
      // Keep at least one column visible
      setVisibleColumns([allColumns[0].key])
    }
  }

  const isColumnVisible = (columnKey) => visibleColumns.includes(columnKey)

  const renderCellContent = (api, columnKey) => {
    switch (columnKey) {
      case 'tags':
        return api.tags
      case 'operationId':
        return api.operationId
      case 'method':
        return (
          <span className={getMethodClass(api.method)}>
            {api.method}
          </span>
        )
      case 'endpoint':
        return <code>{api.endpoint}</code>
      case 'description':
        return api.description
      case 'scopes':
        return api.scopes
      case 'onPortal':
        return (
          <span className={`portal-badge ${api.onPortal === 'Yes' ? 'portal-yes' : 'portal-no'}`}>
            {api.onPortal}
          </span>
        )
      case 'service':
        return api.service
      case 'source':
        return api.source
      default:
        return null
    }
  }

  const getCellClassName = (columnKey) => {
    switch (columnKey) {
      case 'tags':
        return 'tags-cell'
      case 'operationId':
        return 'operation-cell'
      case 'method':
        return 'method-cell'
      case 'endpoint':
        return 'endpoint-cell'
      case 'description':
        return 'description-cell'
      case 'scopes':
        return 'scopes-cell'
      case 'onPortal':
        return 'portal-cell'
      case 'service':
        return 'service-cell'
      case 'source':
        return 'source-cell'
      default:
        return ''
    }
  }

  const visibleColumnCount = visibleColumns.length

  return (
    <div className="api-table-container">
      <div className="table-controls">
        <button
          className="customize-columns-btn"
          onClick={() => setShowColumnCustomizer(!showColumnCustomizer)}
        >
          Customize Columns
        </button>

        {showColumnCustomizer && (
          <div className="column-customizer">
            <div className="customizer-header">
              <h3>Select Columns to Display</h3>
              <button
                className="close-customizer"
                onClick={() => setShowColumnCustomizer(false)}
              >
                ×
              </button>
            </div>
            <div className="customizer-actions">
              <button
                className="action-btn"
                onClick={() => toggleAllColumns(true)}
              >
                Show All
              </button>
              <button
                className="action-btn"
                onClick={() => toggleAllColumns(false)}
              >
                Hide All
              </button>
            </div>
            <div className="column-list">
              {allColumns.map(column => (
                <label key={column.key} className="column-item">
                  <input
                    type="checkbox"
                    checked={isColumnVisible(column.key)}
                    onChange={() => toggleColumn(column.key)}
                    disabled={visibleColumns.length === 1 && isColumnVisible(column.key)}
                  />
                  <span>{column.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="table-wrapper">
        <table className="api-table">
          <thead>
            <tr>
              {allColumns.map(column =>
                isColumnVisible(column.key) && (
                  <th
                    key={column.key}
                    onClick={column.sortable ? () => handleSort(column.key) : undefined}
                    className={column.sortable ? 'sortable' : ''}
                  >
                    {column.label}{column.sortable && getSortIndicator(column.key)}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {sortedApis.length === 0 ? (
              <tr>
                <td colSpan={visibleColumnCount} className="no-results">
                  No APIs found matching your filter
                </td>
              </tr>
            ) : (
              sortedApis.map((api, index) => (
                <tr key={index}>
                  {allColumns.map(column =>
                    isColumnVisible(column.key) && (
                      <td
                        key={column.key}
                        className={getCellClassName(column.key)}
                        data-tooltip={column.key === 'endpoint' ? api.endpoint : undefined}
                      >
                        {renderCellContent(api, column.key)}
                      </td>
                    )
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ApiTable
