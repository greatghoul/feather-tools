import { html, useState, useEffect } from 'preact';
import QRCode from 'qrcode';

const DEFAULT_URL = 'https://www.feather-tools.com/simple-qrcode';

const PreviewCard = ({ settings, creating, onCreated }) => {
    const [image, setImage] = useState(null);

    const url = settings.url || DEFAULT_URL;
    const options = {
        width: 256,
        margin: 0,
        color: {
            dark: settings.foreground,
            light: settings.background
        }
    };

    useEffect(() => {
        QRCode.toCanvas(url, options).then(canvas => {
            setImage(canvas.toDataURL());
            onCreated();
        });
    }, [settings]);

    const handleDownload = (filename, url) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleDownloadPng = () => {
        handleDownload('qrcode.png', image);
    }

    const handleDownloadSvg = () => {
        QRCode.toString(url, { ...options, type: 'svg' }).then(svgString => {
            const blob = new Blob([svgString], { type: 'image/svg+xml' });
            handleDownload('qrcode.svg', URL.createObjectURL(blob));
        });
    }

    return html`
        <div class="card h-100">
            <div class="card-header">
                <h5 class="mb-0">Preview</h5>
            </div>
            <div class="card-body text-center">
                <div class="d-flex justify-content-center mb-4">
                    <div id="qrcode-preview">
                        ${image && html`<img src=${image} />`}
                    </div>
                </div>
                <div class="btn-group">
                    <button class="btn btn-outline-success" disabled=${creating} onClick=${handleDownloadPng}>
                        <i class="bi bi-download me-1"></i> Download PNG
                    </button>
                    <button class="btn btn-outline-success" disabled=${creating} onClick=${handleDownloadSvg}>
                        <i class="bi bi-download me-1"></i> Download SVG
                    </button>
                </div>
            </div>
        </div>
    `;
};

export default PreviewCard;
