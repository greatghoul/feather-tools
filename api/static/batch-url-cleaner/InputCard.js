// Input Card Component for Batch URL Cleaner
import { html } from 'preact';

export function InputCard({ inputUrls, setInputUrls }) {
    // Count URLs in input
    const inputUrlCount = inputUrls.trim() ? inputUrls.trim().split('\n').filter(line => line.trim()).length : 0;

    // Load example URLs
    const loadExampleUrls = () => {
        const examples = [
            'https://example.com/page?utm_source=google&utm_medium=cpc&utm_campaign=test',
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
        setInputUrls(examples.join('\n'));
    };

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
