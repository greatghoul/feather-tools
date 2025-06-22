// Input Card Component for Batch URL Cleaner
import { html } from 'preact';

export function InputCard({ inputUrls, setInputUrls, loadExampleUrls }) {
    // Count URLs in input
    const inputUrlCount = inputUrls.trim() ? inputUrls.trim().split('\n').filter(line => line.trim()).length : 0;

    // Calculate dynamic rows for textarea (between 5 and 10)
    const calculateRows = () => {
        if (!inputUrls) return 5;
        const lineCount = inputUrls.split('\n').length;
        return Math.max(5, Math.min(10, lineCount));
    };

    return html`
        <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Input URLs</h5>
                <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick=${loadExampleUrls}
                >
                    Load Examples
                </button>
            </div>
            <div className="card-body">
                <div className="url-input-container">
                    <textarea
                        className="form-control url-input"
                        placeholder="Paste your URLs here, one per line..."
                        value=${inputUrls}
                        onInput=${(e) => setInputUrls(e.target.value)}
                        rows=${calculateRows()}
                    />
                    ${inputUrlCount > 0 && html`
                        <div className="url-count">
                            ${inputUrlCount} URL${inputUrlCount !== 1 ? 's' : ''}
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
}
