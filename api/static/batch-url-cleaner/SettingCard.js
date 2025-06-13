// Settings Card Component for Batch URL Cleaner
import { html } from 'preact';

export function SettingCard({ removeTracking, setRemoveTracking, customParams, setCustomParams, removeAll, setRemoveAll }) {
    return html`
        <div className="card">
            <div className="card-header">
                <h5 className="mb-0">Cleaning Options</h5>
            </div>
            <div className="card-body">
                <div className="cleaning-options">
                    <div className="option-group">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="removeTracking"
                                checked=${removeTracking}
                                onChange=${(e) => setRemoveTracking(e.target.checked)}
                                disabled=${removeAll}
                            />
                            <label className="form-check-label" htmlFor="removeTracking">
                                Remove common tracking parameters (utm_*, fbclid, gclid, etc.)
                            </label>
                        </div>
                    </div>
                    
                    <div className="option-group">
                        <label htmlFor="customParams" className="form-label">
                            Custom parameters to remove (comma-separated):
                        </label>
                        <input
                            type="text"
                            className="form-control custom-parameters-input"
                            id="customParams"
                            placeholder="param1, param2, param3"
                            value=${customParams}
                            onInput=${(e) => setCustomParams(e.target.value)}
                            disabled=${removeAll}
                        />
                    </div>
                    
                    <div className="option-group">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="removeAll"
                                checked=${removeAll}
                                onChange=${(e) => setRemoveAll(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="removeAll">
                                Remove ALL query parameters
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
