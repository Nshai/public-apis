import React from 'react'
import './DownloadSwagger.css'

function DownloadSwagger() {
  const swaggerFiles = [
    {
      name: 'Consolidated Public Swagger',
      filename: 'consolidated-public-swagger.json',
      description: 'Complete public API specification'
    },
    {
      name: 'Consolidated Public Swagger V1',
      filename: 'consolidated-public-swagger-v1.json',
      description: 'Public API specification (V1 only)'
    },
    {
      name: 'Consolidated Public Swagger V2',
      filename: 'consolidated-public-swagger-v2.json',
      description: 'Public API specification (V2 only)'
    }
  ]

  const handleDownload = (filename) => {
    const link = document.createElement('a')
    link.href = `./swaggers/${filename}`
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="download-swagger">
      <h2>Download Swagger Specifications</h2>
      <div className="swagger-grid">
        {swaggerFiles.map((file) => (
          <div key={file.filename} className="swagger-card">
            <div className="swagger-info">
              <h3>{file.name}</h3>
              <p>{file.description}</p>
            </div>
            <button
              className="download-button"
              onClick={() => handleDownload(file.filename)}
              title={`Download ${file.name}`}
            >
              Download JSON
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DownloadSwagger
