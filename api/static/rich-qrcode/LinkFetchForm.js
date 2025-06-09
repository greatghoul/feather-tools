import { html, render, useState, useContext } from 'preact';
import { useStore } from '../_shared/StoreContext.js';

const LinkFetchForm = ({ url }) =>  {
    const { busy, setBusy } = useStore();
    const [fetching, setFetching] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setBusy(true);
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
