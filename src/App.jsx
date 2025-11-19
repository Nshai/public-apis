import { useState, useEffect, useMemo } from 'react'
import './App.css'
import ApiTable from './components/ApiTable'
import Summary from './components/Summary'
import FilterBar from './components/FilterBar'
import DownloadSwagger from './components/DownloadSwagger'

function App() {
  const [apiData, setApiData] = useState(null)
  const [filterText, setFilterText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load API data
    fetch('./data/api-data.json')
      .then(response => response.json())
      .then(data => {
        setApiData(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading API data:', error)
        setLoading(false)
      })
  }, [])

  // Filter APIs based on search text
  const filteredApis = useMemo(() => {
    if (!apiData || !apiData.apis) return []
    if (!filterText.trim()) return apiData.apis

    const searchLower = filterText.toLowerCase()
    return apiData.apis.filter(api => {
      return (
        api.tags.toLowerCase().includes(searchLower) ||
        api.operationId.toLowerCase().includes(searchLower) ||
        api.endpoint.toLowerCase().includes(searchLower) ||
        api.description.toLowerCase().includes(searchLower) ||
        api.service.toLowerCase().includes(searchLower) ||
        api.method.toLowerCase().includes(searchLower)
      )
    })
  }, [apiData, filterText])

  if (loading) {
    return <div className="loading">Loading API data...</div>
  }

  if (!apiData) {
    return <div className="error">Failed to load API data</div>
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Public API Report</h1>
        <p className="generated-at">
          Generated: {new Date(apiData.generatedAt).toLocaleString()}
        </p>
      </header>

      <main className="app-main">
        <Summary summary={apiData.summary} />

        <DownloadSwagger />

        <FilterBar
          filterText={filterText}
          onFilterChange={setFilterText}
          resultCount={filteredApis.length}
          totalCount={apiData.apis.length}
        />

        <ApiTable apis={filteredApis} />
      </main>
    </div>
  )
}

export default App
