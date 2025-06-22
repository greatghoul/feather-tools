// Batch URL Cleaner Main JavaScript
import { html, render, useState, useEffect, useRef } from 'preact';
import { InputCard } from './InputCard.js';
import { SettingCard } from './SettingCard.js';
import { OutputCard } from './OutputCard.js';

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
    const [isProcessing, setIsProcessing] = useState(false);
    
    const copyButtonRef = useRef();

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
            const urls = inputUrls.trim().split('\n');
            const results = urls.map(url => cleanUrl(url));
            
            setCleanedUrls(results.join('\n'));
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
                onUrlsChange=${setInputUrls}
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

            <${OutputCard}
                cleanedUrls=${cleanedUrls}
                copyButtonRef=${copyButtonRef}
                onCopy=${handleCopy}
                onDownload=${handleDownload}
            />
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
