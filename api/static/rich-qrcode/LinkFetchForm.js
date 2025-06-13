import { html, useState, useEffect } from 'preact';
import { useStore } from '../_shared/StoreContext.js';
import { notify, defaultText } from '../_shared/utils.js';
import axios from 'axios';

const LinkFetchForm = ({ onFetched }) =>  {
    const { busy, setBusy } = useStore();
    const [fetching, setFetching] = useState(false);
    const [url, setUrl] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setUrl(params.get('url'));
    }, []);

    // Monitor busy state and sync fetching state
    useEffect(() => {
        if (!busy) {
            setFetching(false);
        }
    }, [busy]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Disable all form elements during fetch
        setBusy(true);
        setFetching(true);

        const params = {
            url: defaultText(url, 'https://feather-tools.com/rich-qrcode'),
        };

        axios.get('/api/link-meta', { params })
            .then(response => {
                const data = response.data;
                console.log('Metadata received:', data);
                
                // Show success message
                notify('Fetched successfully', '', 'success');
                
                onFetched(data);
            })
            .catch(error => {
                console.error('Error fetching metadata:', error);
                
                // Show error message
                notify('Failed to fetch link title', 'You can provide it by yourself.', 'error');
                onFetched({
                    title: 'Untitled Page',
                    url: url
                })
            })
            .finally(() => {
                setBusy(false);
                setFetching(false);
            });
    };

    return html`
        <form id="rich-qrcode-form" class="mb-4" onSubmit=${handleSubmit}>
            <div class="url-input-container">
                <div class="input-group input-group-lg">
                    <input
                        type="url"
                        class="form-control form-control-lg"
                        id="url-input"
                        placeholder="https://example.com/"
                        value=${url}
                        onInput=${e => setUrl(e.target.value)}
                        aria-label="URL to create Rich QR code for"
                        disabled=${busy}
                    />
                    <button
                        type="submit"
                        class="btn btn-primary"
                        id="fetch-metadata-btn"
                        disabled=${busy}
                    >
                        <span class="fetch-btn-text">${fetching ? 'Fetching...' : 'Fetch'}</span>
                        <span
                            class="spinner-border spinner-border-sm ms-1${fetching ? '' : ' d-none'}"
                            role="status"
                            aria-hidden="true"
                            id="fetch-spinner"
                        ></span>
                    </button>
                </div>
            </div>
        </form>
    `;
}

export default LinkFetchForm;
