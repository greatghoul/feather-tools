// Settings Card Component for Batch URL Cleaner
import { html, useState } from 'preact';

export function SettingCard({ 
    inputUrls,
    isProcessing,
    onClean,
    onClear
}) {
    const [removeCommonTrackings, setRemoveCommonTrackings] = useState(true);
    const [removeAllTrackings, setRemoveAllTrackings] = useState(false);
    const [removeCustomTrackings, setRemoveCustomTrackings] = useState('');
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
                                id="removeCommonTrackings"
                                checked=${removeCommonTrackings}
                                onChange=${(e) => setRemoveCommonTrackings(e.target.checked)}
                                disabled=${removeAllTrackings}
                            />
                            <label class="form-check-label" htmlFor="removeCommonTrackings">
                                Remove common tracking parameters (utm_*, fbclid, gclid, etc.)
                            </label>
                        </div>
                    </div>
                    
                    <div class="option-group">
                        <label htmlFor="removeCustomTrackings" class="form-label">
                            Custom parameters to remove (comma-separated):
                        </label>
                        <input
                            type="text"
                            class="form-control custom-parameters-input"
                            id="removeCustomTrackings"
                            placeholder="param1, param2, param3"
                            value=${removeCustomTrackings}
                            onInput=${(e) => setRemoveCustomTrackings(e.target.value)}
                            disabled=${removeAllTrackings}
                        />
                    </div>
                    
                    <div class="option-group">
                        <div class="form-check">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                id="removeAllTrackings"
                                checked=${removeAllTrackings}
                                onChange=${(e) => setRemoveAllTrackings(e.target.checked)}
                            />
                            <label class="form-check-label" htmlFor="removeAllTrackings">
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
