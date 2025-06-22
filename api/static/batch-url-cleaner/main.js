// Batch URL Cleaner Main JavaScript
import { html, render, useState, useEffect, useRef } from 'preact';
import { InputCard } from './InputCard.js';
import { SettingCard } from './SettingCard.js';

// Common tracking parameters to remove
const COMMON_TRACKING_PARAMS = [
    // Google Analytics
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    // Google Ads
    'gclid', 'gclsrc',
    // Facebook
    'fbclid', 'fb_action_ids', 'fb_action_types', 'fb_source',
    // Microsoft
    'msclkid',
    // Other common tracking
    'ref', 'source', 'campaign_id', 'ad_id', 'click_id'
];

function BatchUrlCleaner() {
    const [inputUrls, setInputUrls] = useState('');
    const [cleanedUrls, setCleanedUrls] = useState('');
    const [removeTracking, setRemoveTracking] = useState(true);
    const [customParams, setCustomParams] = useState('');
    const [removeAll, setRemoveAll] = useState(false);
    const [stats, setStats] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const copyButtonRef = useRef();

    // Count URLs in input
    const inputUrlCount = inputUrls.trim() ? inputUrls.trim().split('\n').filter(line => line.trim()).length : 0;

    // Clean a single URL
    const cleanUrl = (urlString) => {
        try {
            const url = new URL(urlString.trim());
            
            if (removeAll) {
                // Remove all query parameters
                url.search = '';
            } else {
                const paramsToRemove = new Set();
                
                // Add common tracking parameters if enabled
                if (removeTracking) {
                    COMMON_TRACKING_PARAMS.forEach(param => paramsToRemove.add(param));
                }
                
                // Add custom parameters
                if (customParams.trim()) {
                    customParams.split(',').forEach(param => {
                        const trimmed = param.trim();
                        if (trimmed) paramsToRemove.add(trimmed);
                    });
                }
                
                // Remove specified parameters
                paramsToRemove.forEach(param => {
                    url.searchParams.delete(param);
                });
            }
            
            return url.toString();
        } catch (error) {
            // Return original if URL is invalid
            return urlString;
        }
    };

    // Process all URLs
    const handleCleanUrls = () => {
        if (!inputUrls.trim()) return;
        
        setIsProcessing(true);
        
        // Simulate processing delay for better UX
        setTimeout(() => {
            const urls = inputUrls.trim().split('\n').filter(line => line.trim());
            const results = urls.map(url => cleanUrl(url));
            
            // Calculate stats
            const originalCount = urls.length;
            const cleanedCount = results.length;
            const modifiedCount = urls.filter((url, index) => url !== results[index]).length;
            
            setCleanedUrls(results.join('\n'));
            setStats({
                original: originalCount,
                cleaned: cleanedCount,
                modified: modifiedCount
            });
            setIsProcessing(false);
        }, 300);
    };

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

    // Clear all
    const handleClear = () => {
        setInputUrls('');
        setCleanedUrls('');
        setStats(null);
    };

    return html`
        <div className="batch-url-cleaner">
            <${InputCard} 
                inputUrls=${inputUrls}
                setInputUrls=${setInputUrls}
            />

            <${SettingCard}
                removeTracking=${removeTracking}
                setRemoveTracking=${setRemoveTracking}
                customParams=${customParams}
                setCustomParams=${setCustomParams}
                removeAll=${removeAll}
                setRemoveAll=${setRemoveAll}
                inputUrls=${inputUrls}
                isProcessing=${isProcessing}
                onClean=${handleCleanUrls}
                onClear=${handleClear}
            />

            <!-- Results Section -->
            ${(cleanedUrls || isProcessing) && html`
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
            `}
        </div>
    `;
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app');
    if (appContainer) {
        render(html`<${BatchUrlCleaner} />`, appContainer);
    }
});
