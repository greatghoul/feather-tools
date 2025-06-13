import { html, useState, useEffect, useRef } from 'preact';
import QRCode from 'qrcode';

const DEFAULT_URL = 'https://www.feather-tools.com/rich-qrcode';

// QR code card configuration
const config = {
    width: 860,
    height: 120,
    qrCodeSize: 90,
    padding: 15,
    titleFontSize: 24,
    titleFontFamily: '"Microsoft YaHei", sans-serif',
    titleFontColor: '#A0BDFE', // Light blue color for title
    urlFontSize: 20,
    urlFontFamily: 'Arial, sans-serif',
    urlFontColor: '#E0E0E0',
    textMaxWidth: 720, // Width available for text with QR on right
    backgroundColor: '#445271', // Rich navy blue background
    textColor: '#ffffff',
    accentColor: '#f0f0f0',
    borderRadius: 10
};

const PreviewCard = ({ linkInfo, generating, shouldGenerate, onGenerated }) => {
    const canvasRef = useRef(null);
    const [canvasReady, setCanvasReady] = useState(false);
    const [qrCodeData, setQrCodeData] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const url = linkInfo?.url || DEFAULT_URL;
    const title = linkInfo?.title || 'Enter a URL and click Generate';

    // Helper function to draw rounded rectangle
    const drawRoundedRect = (ctx, x, y, width, height, radius) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    };

    // Function to truncate text with ellipsis
    const truncateText = (ctx, text, maxWidth, fontSize) => {
        // Set the appropriate font for measurement
        if (fontSize === config.titleFontSize) {
            ctx.font = `bold ${config.titleFontSize}px ${config.titleFontFamily}`;
        } else {
            ctx.font = `${fontSize}px ${config.urlFontFamily}`;
        }
        
        if (ctx.measureText(text).width <= maxWidth) {
            return text;
        }
        
        let truncated = text;
        while (ctx.measureText(truncated + '...').width > maxWidth && truncated.length > 0) {
            truncated = truncated.slice(0, -1);
        }
        
        return truncated + '...';
    };

    // Function to draw empty card
    const drawEmptyCard = (ctx) => {
        // Clear canvas
        ctx.clearRect(0, 0, config.width, config.height);
        
        // Draw rounded rectangle background
        ctx.fillStyle = config.backgroundColor;
        drawRoundedRect(ctx, 0, 0, config.width, config.height, config.borderRadius);
        ctx.fill();
        
        // Calculate QR code position (right side)
        const qrCodeX = config.width - config.padding - config.qrCodeSize;
        
        // Draw QR code area placeholder with rounded corners
        ctx.fillStyle = config.accentColor;
        const qrRadius = 8;
        drawRoundedRect(ctx, qrCodeX, config.padding, config.qrCodeSize, config.qrCodeSize, qrRadius);
        ctx.fill();
        
        // Draw QR code placeholder icon
        ctx.fillStyle = '#bbbbbb';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('QR', qrCodeX + config.qrCodeSize/2, config.padding + config.qrCodeSize/2 + 8);
        ctx.textAlign = 'left';
        
        // Draw placeholder text
        ctx.fillStyle = config.titleFontColor;
        ctx.font = `bold ${config.titleFontSize}px ${config.titleFontFamily}`;
        const placeholderText = 'Enter a URL and click Generate';
        const truncatedPlaceholder = truncateText(ctx, placeholderText, config.textMaxWidth, config.titleFontSize);
        ctx.fillText(truncatedPlaceholder, config.padding, 50);
    };

    // Function to generate QR code card
    const generateQRCodeCard = (ctx) => {
        console.log('Generating QR code card for:', url, 'with title:', title);
        
        setIsGenerating(true);
        
        // Clear canvas
        ctx.clearRect(0, 0, config.width, config.height);
        
        // Draw rounded rectangle background
        ctx.fillStyle = config.backgroundColor;
        drawRoundedRect(ctx, 0, 0, config.width, config.height, config.borderRadius);
        ctx.fill();
        
        // Generate QR code
        QRCode.toDataURL(url, {
            width: config.qrCodeSize,
            margin: 0,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        })
        .then(qrDataUrl => {
            const qrImage = new Image();
            qrImage.onload = () => {
                // Calculate QR code position (right side)
                const qrCodeX = config.width - config.padding - config.qrCodeSize;
                
                // Create a rounded rectangle for the QR code background
                const qrRadius = 8;
                ctx.fillStyle = '#ffffff';
                drawRoundedRect(ctx, qrCodeX, config.padding, config.qrCodeSize, config.qrCodeSize, qrRadius);
                ctx.fill();
                
                // Draw QR code onto canvas
                ctx.drawImage(qrImage, qrCodeX, config.padding, config.qrCodeSize, config.qrCodeSize);
                
                // Draw title with truncation
                const truncatedTitle = truncateText(ctx, title, config.textMaxWidth, config.titleFontSize);
                ctx.fillStyle = config.titleFontColor;
                ctx.font = `bold ${config.titleFontSize}px ${config.titleFontFamily}`;
                ctx.fillText(truncatedTitle, config.padding, config.padding + 35);
                
                // Draw URL with truncation
                const truncatedUrl = truncateText(ctx, url, config.textMaxWidth, config.urlFontSize);
                ctx.font = `${config.urlFontSize}px ${config.urlFontFamily}`;
                ctx.fillStyle = config.urlFontColor;
                ctx.fillText(truncatedUrl, config.padding, config.padding + 75);
                
                // Store QR code data for downloads
                setQrCodeData({
                    dataUrl: qrDataUrl,
                    x: qrCodeX,
                    y: config.padding,
                    size: config.qrCodeSize
                });
                
                setCanvasReady(true);
                setIsGenerating(false);
                if (onGenerated) {
                    onGenerated();
                }
            };
            
            qrImage.src = qrDataUrl;
        })
        .catch(error => {
            console.error('Error generating QR code:', error);
            setIsGenerating(false);
        });
    };

    // Initialize canvas and draw
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Always draw empty card on component mount or when linkInfo changes
        drawEmptyCard(ctx);
        setCanvasReady(false);
        setQrCodeData(null);
    }, [linkInfo]);

    // Auto-generate when shouldGenerate is true
    useEffect(() => {
        if (shouldGenerate && linkInfo?.url) {
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                generateQRCodeCard(ctx);
            }
        }
    }, [shouldGenerate, linkInfo]);

    // Handle generate button click
    const handleGenerate = () => {
        const canvas = canvasRef.current;
        if (!canvas || !linkInfo?.url) return;

        const ctx = canvas.getContext('2d');
        generateQRCodeCard(ctx);
    };

    const handleDownloadPng = () => {
        if (!canvasRef.current || !qrCodeData) return;
        
        const link = document.createElement('a');
        link.download = 'rich-qrcode.png';
        link.href = canvasRef.current.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadSvg = () => {
        if (!qrCodeData) return;
        
        // Create SVG document
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", config.width);
        svg.setAttribute("height", config.height);
        svg.setAttribute("viewBox", `0 0 ${config.width} ${config.height}`);
        svg.setAttribute("xmlns", svgNS);
        
        // Add the card background with rounded corners
        const path = document.createElementNS(svgNS, "path");
        const r = config.borderRadius;
        const w = config.width;
        const h = config.height;
        const d = `M${r},0 H${w-r} C${w-r/2},0 ${w},${r/2} ${w},${r} V${h-r} C${w},${h-r/2} ${w-r/2},${h} ${w-r},${h} H${r} C${r/2},${h} 0,${h-r/2} 0,${h-r} V${r} C0,${r/2} ${r/2},0 ${r},0 Z`;
        path.setAttribute("d", d);
        path.setAttribute("fill", config.backgroundColor);
        svg.appendChild(path);
        
        // Add the title text
        const titleText = document.createElementNS(svgNS, "text");
        titleText.setAttribute("x", config.padding);
        titleText.setAttribute("y", config.padding + 35);
        titleText.setAttribute("fill", config.titleFontColor);
        titleText.setAttribute("font-family", config.titleFontFamily.replace(/"/g, ''));
        titleText.setAttribute("font-size", config.titleFontSize);
        titleText.setAttribute("font-weight", "bold");
        titleText.textContent = title;
        svg.appendChild(titleText);
        
        // Add the URL text
        const urlText = document.createElementNS(svgNS, "text");
        urlText.setAttribute("x", config.padding);
        urlText.setAttribute("y", config.padding + 75);
        urlText.setAttribute("fill", config.urlFontColor);
        urlText.setAttribute("font-family", config.urlFontFamily.replace(/"/g, ''));
        urlText.setAttribute("font-size", config.urlFontSize);
        urlText.textContent = url;
        svg.appendChild(urlText);
        
        // Add QR code background with rounded corners
        const qrBackground = document.createElementNS(svgNS, "rect");
        qrBackground.setAttribute("x", qrCodeData.x);
        qrBackground.setAttribute("y", qrCodeData.y);
        qrBackground.setAttribute("width", qrCodeData.size);
        qrBackground.setAttribute("height", qrCodeData.size);
        qrBackground.setAttribute("fill", "#ffffff");
        qrBackground.setAttribute("rx", "8");
        qrBackground.setAttribute("ry", "8");
        svg.appendChild(qrBackground);
        
        // Add QR code image
        const qrImage = document.createElementNS(svgNS, "image");
        qrImage.setAttribute("x", qrCodeData.x);
        qrImage.setAttribute("y", qrCodeData.y);
        qrImage.setAttribute("width", qrCodeData.size);
        qrImage.setAttribute("height", qrCodeData.size);
        qrImage.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", qrCodeData.dataUrl);
        svg.appendChild(qrImage);
        
        // Convert SVG to data URL and download
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        const svgBlob = new Blob([svgString], {type: "image/svg+xml"});
        const svgUrl = URL.createObjectURL(svgBlob);
        
        const link = document.createElement('a');
        link.href = svgUrl;
        link.download = 'rich-qrcode.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(svgUrl);
    };

    return html`
        <div class="card h-100">
            <div class="card-header bg-light">
                <h5 class="mb-0">Preview</h5>
            </div>
            <div class="card-body text-center">
                <div class="qrcode-card-container mb-3">
                    <canvas 
                        ref=${canvasRef}
                        width="860" 
                        height="120"
                        style="max-width: 100%; height: auto; border: 1px solid #dee2e6; border-radius: 8px;"
                    />
                </div>
                <div class="text-muted small mb-3">
                    <i class="bi bi-info-circle me-1"></i>
                    Right click to copy/save the image, or use the download buttons below.
                </div>
                
                <div class="d-flex justify-content-center mb-3">
                    <button 
                        class="btn btn-primary" 
                        disabled=${isGenerating || generating || !linkInfo?.url}
                        onClick=${handleGenerate}
                    >
                        ${(isGenerating || generating) ? html`
                            <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Generating...
                        ` : html`
                            <i class="bi bi-qr-code me-1"></i>
                            Generate QR Code Card
                        `}
                    </button>
                </div>
                
                <div class="d-flex justify-content-center mt-3">
                    <div class="btn-group">
                        <button 
                            class="btn btn-outline-success" 
                            disabled=${generating || !canvasReady}
                            onClick=${handleDownloadPng}
                        >
                            <i class="bi bi-download me-1"></i> Download PNG
                        </button>
                        <button 
                            class="btn btn-outline-success" 
                            disabled=${generating || !canvasReady}
                            onClick=${handleDownloadSvg}
                        >
                            <i class="bi bi-download me-1"></i> Download SVG
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

export default PreviewCard;
