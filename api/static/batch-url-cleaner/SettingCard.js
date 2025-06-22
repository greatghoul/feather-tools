// URL Cleaner Component
import { html, useState } from 'preact';

// Example URLs for testing URL cleaning
const exampleUrls = [
    'https://example.com/page?utm_source=google&utm_medium=cpc&utm_campaign=test&_ts=122331321321',
    'https://shop.example.com/product/123?fbclid=abc123&ref=facebook',
    'https://news.example.com/article?gclid=xyz789&source=newsletter',
    'https://blog.example.com/post?utm_source=twitter&utm_content=social',
    'https://store.example.com/item?id=456&utm_term=shoes&utm_content=ad',
    'https://forum.example.com/thread/789?msclkid=def456&campaign_id=summer',
    'https://music.example.com/track/321?ad_id=ad789&click_id=clk123',
    'https://travel.example.com/deal?utm_campaign=holiday&ref=partner',
    'https://video.example.com/watch?v=abc123&gclsrc=aw.ds',
    'https://food.example.com/recipe?source=instagram&fb_source=feed',
    'https://app.example.com/download?utm_medium=email&fb_action_ids=12345',
    'https://events.example.com/register?utm_source=linkedin&fb_action_types=like',
    'https://news.example.com/article/456?utm_content=footer&gclid=xyz123',
    'https://shop.example.com/cart?ref=affiliate&utm_term=discount'
];

export function SettingCard({ 
    isProcessing,
    onSubmit,
    onClear
}) {
    const [inputUrls, setInputUrls] = useState('');
    const [removeCommonTrackings, setRemoveCommonTrackings] = useState(true);
    const [removeAllTrackings, setRemoveAllTrackings] = useState(false);
    const [removeCustomTrackings, setRemoveCustomTrackings] = useState('');

    // Load example URLs
    const loadExampleUrls = () => {
        const urls = exampleUrls.join('\n');
        setInputUrls(urls);
    };

    // Calculate dynamic rows for textarea (between 5 and 10)
    const calculateRows = () => {
        if (!inputUrls) return 5;
        const lineCount = inputUrls.split('\n').length;
        return Math.max(5, Math.min(10, lineCount));
    };

    const handleSubmit = () => {
        onSubmit({
            inputUrls,
            settings: {
                removeCommonTrackings,
                removeAllTrackings,
                removeCustomTrackings
            }
        });
    };

    return html`
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Input URLs</h5>
                <button 
                    class="btn btn-outline-secondary btn-sm"
                    onClick=${loadExampleUrls}
                >
                    Load Examples
                </button>
            </div>

            <div class="card-body">
                <div class="url-input-container mb-3">
                    <textarea
                        class="form-control url-input"
                        placeholder="Paste your URLs here, one per line..."
                        value=${inputUrls}
                        onInput=${(e) => {
                            const newValue = e.target.value;
                            setInputUrls(newValue);
                        }}
                        rows=${calculateRows()}
                    />
                </div>

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
                        onClick=${handleSubmit}
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
