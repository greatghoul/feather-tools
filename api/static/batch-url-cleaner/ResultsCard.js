// Results Card Component for Batch URL Cleaner
import { html, useRef } from 'preact';

export function ResultsCard({ cleanedUrls, stats, isProcessing }) {
    const copyButtonRef = useRef();

    // Copy to clipboard
    const handleCopy = async () => {
        if (!cleanedUrls) return;
        
        try {
            await navigator.clipboard.writeText(cleanedUrls);
            
            // Show copied feedback
            const btn = copyButtonRef.current;
            if (btn) {
                btn.classList.add('copied');
                setTimeout(() => btn.classList.remove('copied'), 2000);
            }
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
        }
    };

    // Download as text file
    const handleDownload = () => {
        if (!cleanedUrls) return;
        
        const blob = new Blob([cleanedUrls], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cleaned-urls-${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!cleanedUrls && !isProcessing) return null;

    return html`
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Cleaned URLs</h5>
                ${cleanedUrls && html`
                    <div className="btn-group">
                        <button
                            ref=${copyButtonRef}
                            className="btn btn-outline-primary btn-sm btn-copy"
                            onClick=${handleCopy}
                        >
                            <i className="bi bi-clipboard"></i> Copy
                        </button>
                        <button
                            className="btn btn-outline-success btn-sm"
                            onClick=${handleDownload}
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
    `;
}
