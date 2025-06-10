import { html, useState, useEffect } from 'preact';

// SettingCard component for QR code settings panel
// Props:
//   linkInfo: { title: string, url: string }
//   onGenerate: function - callback for generate button click
//   loading: boolean - loading state
const SettingCard = ({ linkInfo, onGenerate, loading }) => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        setTitle(linkInfo?.title || '');
        setUrl(linkInfo?.url || '');
    }, [linkInfo]);

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
                        disabled=${loading}
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
                        disabled=${loading}
                    />
                </div>
                <div class="d-grid gap-2">
                    <button
                        type="button"
                        class="btn btn-primary"
                        id="generate-btn"
                        onClick=${onGenerate}
                        disabled=${loading}
                    >
                        <span class="generate-btn-text">Generate QR Code Card</span>
                        <span
                            class="spinner-border spinner-border-sm ms-1${loading ? '' : ' d-none'}"
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
