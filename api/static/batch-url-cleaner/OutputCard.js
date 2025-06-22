// Output Card Component for Batch URL Cleaner
import { html } from 'preact';

export function OutputCard({ 
    cleanedUrls, 
    isProcessing, 
    stats, 
    copyButtonRef,
    onCopy,
    onDownload 
}) {
    return html`
        ${(cleanedUrls || isProcessing) && html`
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Cleaned URLs</h5>
                    ${cleanedUrls && html`
                        <div className="btn-group">
                            <button
                                ref=${copyButtonRef}
                                className="btn btn-outline-primary btn-sm btn-copy"
                                onClick=${onCopy}
                            >
                                <i className="bi bi-clipboard"></i> Copy
                            </button>
                            <button
                                className="btn btn-outline-success btn-sm"
                                onClick=${onDownload}
                            >
                                <i className="bi bi-download"></i> Download
                            </button>
                        </div>
                    `}
                </div>
                <div className="card-body">
                    ${stats && html`
                        <div className="results-stats">
                            <div className="stat-item">
                                <span>Original URLs:</span>
                                <strong>${stats.original}</strong>
                            </div>
                            <div className="stat-item">
                                <span>Cleaned URLs:</span>
                                <strong>${stats.cleaned}</strong>
                            </div>
                            <div className="stat-item">
                                <span>Modified URLs:</span>
                                <strong>${stats.modified}</strong>
                            </div>
                        </div>
                    `}
                    
                    <div className=${`processing-indicator ${isProcessing ? 'show' : ''}`}>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        Processing URLs...
                    </div>
                    
                    ${cleanedUrls && html`
                        <div className="url-output">${cleanedUrls}</div>
                    `}
                </div>
            </div>
        `}
    `;
}
