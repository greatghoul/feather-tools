// Settings Card Component for Batch URL Cleaner
import { html } from 'preact';

export function SettingCard({ 
    removeTracking, 
    setRemoveTracking, 
    customParams, 
    setCustomParams, 
    removeAll, 
    setRemoveAll,
    inputUrls,
    isProcessing,
    onClean,
    onClear
}) {
    return html`
        <div class="card mb-4">
            <div class="card-header">
                <h5 class="mb-0">Cleaning Options</h5>
            </div>
            <div class="card-body">
                <div class="cleaning-options">
                    <div class="option-group">
                        <div class="form-check">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                id="removeTracking"
                                checked=${removeTracking}
                                onChange=${(e) => setRemoveTracking(e.target.checked)}
                                disabled=${removeAll}
                            />
                            <label class="form-check-label" htmlFor="removeTracking">
                                Remove common tracking parameters (utm_*, fbclid, gclid, etc.)
                            </label>
                        </div>
                    </div>
                    
                    <div class="option-group">
                        <label htmlFor="customParams" class="form-label">
                            Custom parameters to remove (comma-separated):
                        </label>
                        <input
                            type="text"
                            class="form-control custom-parameters-input"
                            id="customParams"
                            placeholder="param1, param2, param3"
                            value=${customParams}
                            onInput=${(e) => setCustomParams(e.target.value)}
                            disabled=${removeAll}
                        />
                    </div>
                    
                    <div class="option-group">
                        <div class="form-check">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                id="removeAll"
                                checked=${removeAll}
                                onChange=${(e) => setRemoveAll(e.target.checked)}
                            />
                            <label class="form-check-label" htmlFor="removeAll">
                                Remove ALL query parameters
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="d-flex gap-2">
                    <button
                        class="btn btn-primary"
                        onClick=${onClean}
                        disabled=${!inputUrls.trim() || isProcessing}
                    >
                        ${isProcessing ? 'Processing...' : 'Clean URLs'}
                    </button>
                    <button
                        class="btn btn-outline-secondary"
                        onClick=${onClear}
                    >
                        Clear All
                    </button>
                </div>
            </div>
        </div>
    `;
}
