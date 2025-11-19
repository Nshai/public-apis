import React, { useState } from 'react'
import './ApiTable.css'

function ApiTable({ apis }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

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

  return (
    <div className="api-table-container">
      <div className="table-wrapper">
        <table className="api-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('tags')} className="sortable">
                Tags{getSortIndicator('tags')}
              </th>
              <th onClick={() => handleSort('operationId')} className="sortable">
                Operation ID{getSortIndicator('operationId')}
              </th>
              <th onClick={() => handleSort('method')} className="sortable">
                Method{getSortIndicator('method')}
              </th>
              <th onClick={() => handleSort('endpoint')} className="sortable">
                Endpoint{getSortIndicator('endpoint')}
              </th>
              <th onClick={() => handleSort('description')} className="sortable">
                Description{getSortIndicator('description')}
              </th>
              <th>Scopes</th>
              <th onClick={() => handleSort('onPortal')} className="sortable">
                On Portal{getSortIndicator('onPortal')}
              </th>
              <th onClick={() => handleSort('service')} className="sortable">
                Service{getSortIndicator('service')}
              </th>
              <th onClick={() => handleSort('source')} className="sortable">
                Source{getSortIndicator('source')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedApis.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-results">
                  No APIs found matching your filter
                </td>
              </tr>
            ) : (
              sortedApis.map((api, index) => (
                <tr key={index}>
                  <td className="tags-cell">{api.tags}</td>
                  <td className="operation-cell">{api.operationId}</td>
                  <td className="method-cell">
                    <span className={getMethodClass(api.method)}>
                      {api.method}
                    </span>
                  </td>
                  <td className="endpoint-cell">
                    <code>{api.endpoint}</code>
                  </td>
                  <td className="description-cell">{api.description}</td>
                  <td className="scopes-cell">{api.scopes}</td>
                  <td className="portal-cell">
                    <span className={`portal-badge ${api.onPortal === 'Yes' ? 'portal-yes' : 'portal-no'}`}>
                      {api.onPortal}
                    </span>
                  </td>
                  <td className="service-cell">{api.service}</td>
                  <td className="source-cell">{api.source}</td>
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
