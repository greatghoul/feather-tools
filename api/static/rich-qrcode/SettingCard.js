import { html, useState, useEffect, useContext } from 'preact';
import { useStore } from '../_shared/StoreContext.js';

// SettingCard component for QR code settings panel
// Props:
//   linkInfo: { title: string, url: string }
//   onGenerate: function - callback for generate button click
//   loading: boolean - loading state
const SettingCard = ({ linkInfo, onGenerate }) => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { busy, setBusy } = useStore();

    const handleSubmit = () => {
        setSubmitting(true);
        setBusy(true);
        onGenerate({ title, url });
    };

    useEffect(() => {
        setTitle(linkInfo?.title || '');
        setUrl(linkInfo?.url || '');
    }, [linkInfo]);

    // Monitor busy state and reset submitting when busy becomes false
    useEffect(() => {
        if (!busy) {
            setSubmitting(false);
        }
    }, [busy]);

    return html`
        <div class="card h-100">
            <div class="card-header bg-light">
                <h5 class="mb-0">Settings</h5>
            </div>
            <div class="card-body">
                <div class="form-group mb-3">
                    <label for="title-input">Title:</label>
                    <input
                        type="text"
                        class="form-control"
                        id="title-input"
                        placeholder="Title will appear here"
                        value=${title}
                        onInput=${e => setTitle(e.target.value)}
                        disabled=${busy}
                    />
                </div>
                <div class="form-group mb-3">
                    <label for="url-display">URL:</label>
                    <input
                        type="text"
                        class="form-control"
                        id="url-display"
                        placeholder="https://example.com/"
                        value=${url}
                        onInput=${e => setUrl(e.target.value)}
                        disabled=${busy}
                    />
                </div>
                <div class="d-grid gap-2">
                    <button
                        type="button"
                        class="btn btn-primary"
                        id="generate-btn"
                        onClick=${handleSubmit}
                        disabled=${busy}
                    >
                        <span class="generate-btn-text">${submitting ? 'Generating...' : 'Generate QR Code Card'}</span>
                        <span
                            class="spinner-border spinner-border-sm ms-1${submitting ? '' : ' d-none'}"
                            role="status"
                            aria-hidden="true"
                            id="generate-spinner"
                        ></span>
                    </button>
                </div>
            </div>
        </div>
    `;
};

export default SettingCard;
