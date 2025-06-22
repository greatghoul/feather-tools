// Output Card Component for Batch URL Cleaner
import { html } from 'preact';

export function OutputCard({ 
    cleanedUrls, 
    isProcessing, 
    copyButtonRef,
    onCopy,
    onDownload 
}) {
    return html`
        ${(cleanedUrls) && html`
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Cleaned URLs</h5>
                    ${cleanedUrls && html`
                        <div class="btn-group">
                            <button
                                ref=${copyButtonRef}
                                class="btn btn-outline-primary btn-sm btn-copy"
                                onClick=${onCopy}
                            >
                                <i class="bi bi-clipboard"></i> Copy
                            </button>
                            <button
                                class="btn btn-outline-success btn-sm"
                                onClick=${onDownload}
                            >
                                <i class="bi bi-download"></i> Download
                            </button>
                        </div>
                    `}
                </div>
                <div class="card-body">
                    
                    ${cleanedUrls && html`
                        <div class="results" id="output">
                            <textarea 
                                class="form-control font-monospace" 
                                rows="5"
                                readonly
                                value=${cleanedUrls}
                            ></textarea>
                        </div>
                    `}
                </div>
            </div>
        `}
    `;
}
