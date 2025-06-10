import QRCode from 'qrcode';
import axios from 'axios';
import { html, render, useState, useEffect } from 'preact';
import { StoreContext } from '../_shared/StoreContext.js';
import LinkFetchForm from './LinkFetchForm.js';

// Get form elements
const form = document.getElementById('rich-qrcode-form');
const urlInput = document.getElementById('url-input');
const titleInput = document.getElementById('title-input');
const urlDisplay = document.getElementById('url-display');
const fetchMetadataBtn = document.getElementById('fetch-metadata-btn');
const fetchSpinner = document.getElementById('fetch-spinner');
const fetchBtnText = document.querySelector('.fetch-btn-text');
const generateBtn = document.getElementById('generate-btn');
const generateSpinner = document.getElementById('generate-spinner');
const generateBtnText = document.querySelector('.generate-btn-text');
const canvas = document.getElementById('qrcode-card');
const ctx = canvas.getContext('2d');
const downloadPngBtn = document.getElementById('download-png-btn');
const downloadSvgBtn = document.getElementById('download-svg-btn');

// QR code card configuration
const config = {
    width: 860,
    height: 120,
    qrCodeSize: 90,
    padding: 15,
    titleFontSize: 24,
    titleFontFamily: '"Microsoft YaHei", sans-serif',
    titleFontColor: '#A0BDFE', // Light blue color for title
    urlFontSize: 20, // Increased from 12px to 20px as requested
    urlFontFamily: 'Arial, sans-serif',
    urlFontColor: '#E0E0E0', // Changed from #cccccc to #E0E0E0 as requested
    textMaxWidth: 720, // Width available for text with QR on right (width - qrCodeSize - 2*padding - extra margin)
    backgroundColor: '#445271', // Rich navy blue background
    textColor: '#ffffff', // White text for better contrast on dark background
    accentColor: '#f0f0f0', // Background for QR code area
    borderRadius: 10 // Add round corner setting for the card
};

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    // Set the URL display when the page loads
    if (urlInput.value) {
        urlDisplay.value = urlInput.value;
        fetchUrlMetadata(urlInput.value);
    }
    
    // Draw empty card
    drawEmptyCard();
});

// Form elements to disable during fetching
const formElements = [urlInput, titleInput, urlDisplay, generateBtn, fetchMetadataBtn];

// Handle form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();

    let url = urlInput.value.trim();
    console.log('Form submitted with URL:', url);
    if (!url) {
        url = urlInput.placeholder;
    }

    fetchUrlMetadata(url);
});

// Function to enable/disable all form elements
function setFormDisabled(disabled) {
    formElements.forEach(element => {
        element.disabled = disabled;
    });
    
    // Add loading state to settings card if disabled
    const settingsCard = document.querySelector('.card:first-of-type');
    if (settingsCard) {
        if (disabled) {
            settingsCard.classList.add('opacity-50');
        } else {
            settingsCard.classList.remove('opacity-50');
        }
    }
}

// Function to fetch URL metadata
function fetchUrlMetadata(url) {
    // Disable all form elements during fetch
    setFormDisabled(true);
    fetchBtnText.textContent = 'Fetching...';
    fetchSpinner.classList.remove('d-none');

    axios.get(`/api/link-meta?url=${encodeURIComponent(url)}`)
        .then(response => {
            const data = response.data;
            console.log('Metadata received:', data);
            // Update title if available
            if (data.title) {
                titleInput.value = data.title;
            }
            
            // Always update URL display field to match the fetched URL
            urlDisplay.value = url;
            
            // Show success message
            notify('Fetched successfully', '', 'success');
            
            generateQRCodeCard();
        })
        .catch(error => {
            console.error('Error fetching metadata:', error);
            
            // Show error message
            notify('Failed to fetch', 'Please check the URL and try again.', 'error');

            // Use URL as title if metadata fetch fails
            if (!titleInput.value) {
                titleInput.value = urlInput.value;
            }
        })
        .finally(() => {
            // Re-enable all form elements
            setFormDisabled(false);
            fetchBtnText.textContent = 'Fetch';
            fetchSpinner.classList.add('d-none');
        });
}

/**
 * Displays a notification message using the global Notify class.
 *
 * @param {string} title - The title of the notification.
 * @param {string} message - The message content of the notification.
 * @param {'info'|'success'|'warning'|'error'} [status='info'] - The status type of the notification.
 */
function notify(title, message, status = 'info') {
    new window.Notify({
        status: status,
        title: title,
        text: message,
        effect: 'fade',
        speed: 300,
        autoclose: true,
        autotimeout: 3000,
        position: 'x-center top'
    });
}

// Generate button click handler
generateBtn.addEventListener('click', function() {
    // Show loading state
    generateSpinner.classList.remove('d-none');
    generateBtnText.textContent = 'Generating...';
    generateBtn.disabled = true;
    
    // Small delay to ensure UI updates
    setTimeout(() => {
        generateQRCodeCard();
        
        // Reset button state
        generateSpinner.classList.add('d-none');
        generateBtnText.textContent = 'Generate QR Code Card';
        generateBtn.disabled = false;
    }, 100);
});

// No automatic generation on title changes
// Title input no longer triggers automatic QR code generation

// Function to draw empty card
function drawEmptyCard() {
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
    const qrRadius = 8; // Smaller radius for the QR code
    drawRoundedRect(ctx, qrCodeX, config.padding, config.qrCodeSize, config.qrCodeSize, qrRadius);
    ctx.fill();
    
    // Draw QR code placeholder icon or pattern
    ctx.fillStyle = '#bbbbbb';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('QR', qrCodeX + config.qrCodeSize/2, config.padding + config.qrCodeSize/2 + 8);
    ctx.textAlign = 'left'; // Reset text alignment
    
    // Draw placeholder text with higher contrast against dark background
    ctx.fillStyle = config.titleFontColor;
    ctx.font = `bold ${config.titleFontSize}px ${config.titleFontFamily}`;
    const placeholderText = 'Enter a URL and click Generate';
    const truncatedPlaceholder = truncateText(placeholderText, config.textMaxWidth, config.titleFontSize);
    ctx.fillText(truncatedPlaceholder, config.padding, 50);
}

// Function to truncate text with ellipsis
function truncateText(text, maxWidth, fontSize) {
    // Set the appropriate font for measurement based on whether it's the title or URL
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
}

// Function to generate QR code card
function generateQRCodeCard() {
    // Use the value from URL display if available (since it's now editable), 
    // otherwise fall back to the input field
    const url = urlDisplay.value.trim() || urlInput.value.trim() || urlInput.placeholder;
    const title = titleInput.value.trim() || 'Untitled Link';
    
    // Make sure URL display is synced
    urlDisplay.value = url;
    
    console.log('Generating QR code card for:', url, 'with title:', title);
    
    // Clear canvas
    ctx.clearRect(0, 0, config.width, config.height);
    
    // Draw rounded rectangle background
    ctx.fillStyle = config.backgroundColor;
    drawRoundedRect(ctx, 0, 0, config.width, config.height, config.borderRadius);
    ctx.fill();
    
    // Generate QR code using Promise-based approach
    QRCode.toDataURL(url, {
        width: config.qrCodeSize,
        margin: 0,
        color: {
            dark: '#000000', // QR code color
            light: '#ffffff' // Background color
        }
    })
    .then(qrDataUrl => {
        // Create an image from the QR code data URL
        const qrImage = new Image();
        qrImage.onload = () => {
            // Calculate QR code position (right side)
            const qrCodeX = config.width - config.padding - config.qrCodeSize;
            
            // Create a rounded rectangle for the QR code background
            const qrRadius = 8; // Smaller radius for the QR code
            ctx.fillStyle = '#ffffff';
            drawRoundedRect(ctx, qrCodeX, config.padding, config.qrCodeSize, config.qrCodeSize, qrRadius);
            ctx.fill();
            
            // Draw QR code onto our card canvas
            ctx.drawImage(qrImage, qrCodeX, config.padding, config.qrCodeSize, config.qrCodeSize);
            
            // Draw title with truncation
            const truncatedTitle = truncateText(title, config.textMaxWidth, config.titleFontSize);
            ctx.fillStyle = config.titleFontColor;
            ctx.font = `bold ${config.titleFontSize}px ${config.titleFontFamily}`;
            ctx.fillText(truncatedTitle, config.padding, config.padding + 35);
            
            // Draw URL with truncation (adjusted Y position to account for larger font)
            const truncatedUrl = truncateText(url, config.textMaxWidth, config.urlFontSize);
            ctx.font = `${config.urlFontSize}px ${config.urlFontFamily}`;
            ctx.fillStyle = config.urlFontColor;
            ctx.fillText(truncatedUrl, config.padding, config.padding + 75);
            
            // Enable download buttons
            downloadPngBtn.disabled = false;
            downloadSvgBtn.disabled = false;
            
            // Store QR code data URL for SVG generation
            canvas.dataset.qrCodeUrl = qrDataUrl;
            canvas.dataset.qrCodeX = qrCodeX;
            canvas.dataset.qrCodeY = config.padding;
            canvas.dataset.qrCodeSize = config.qrCodeSize;
        };
        
        // Set the image source after defining the onload handler
        qrImage.src = qrDataUrl;
    })
    .catch(error => {
        console.error('Error generating QR code:', error);
        notify('Failed to generate.', 'Please try again later.', 'error');
    });
}

// Handle PNG download button click
downloadPngBtn.addEventListener('click', function() {
    if (!canvas.dataset.qrCodeUrl) {
        notify('Failed to download.', 'Please generate the QR code first', 'error');
        return;
    }

    // Create a temporary link element
    const link = document.createElement('a');
    link.download = 'rich-qrcode.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Handle SVG download button click
downloadSvgBtn.addEventListener('click', function() {
    if (!canvas.dataset.qrCodeUrl) {
        notify('Failed to download.', 'Please generate the QR code first', 'error');
        return;
    }
    
    // Create SVG document
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", config.width);
    svg.setAttribute("height", config.height);
    svg.setAttribute("viewBox", `0 0 ${config.width} ${config.height}`);
    svg.setAttribute("xmlns", svgNS);
    
    // Add the card background with rounded corners
    const path = document.createElementNS(svgNS, "path");
    // Create a rounded rectangle path
    const r = config.borderRadius;
    const w = config.width;
    const h = config.height;
    const d = `M${r},0 H${w-r} C${w-r/2},0 ${w},${r/2} ${w},${r} V${h-r} C${w},${h-r/2} ${w-r/2},${h} ${w-r},${h} H${r} C${r/2},${h} 0,${h-r/2} 0,${h-r} V${r} C0,${r/2} ${r/2},0 ${r},0 Z`;
    path.setAttribute("d", d);
    path.setAttribute("fill", config.backgroundColor);
    svg.appendChild(path);
    
    // Get the URL and title from the canvas
    const url = urlDisplay.value;
    const title = titleInput.value || 'Untitled Link';
    
    // Add the title text
    const titleText = document.createElementNS(svgNS, "text");
    titleText.setAttribute("x", config.padding);
    titleText.setAttribute("y", config.padding + 35);
    titleText.setAttribute("fill", config.titleFontColor);
    titleText.setAttribute("font-family", config.titleFontFamily.replace(/"/g, ''));
    titleText.setAttribute("font-size", config.titleFontSize);
    titleText.setAttribute("font-weight", "bold");
    titleText.textContent = truncateText(title, config.textMaxWidth, config.titleFontSize);
    svg.appendChild(titleText);
    
    // Add the URL text
    const urlText = document.createElementNS(svgNS, "text");
    urlText.setAttribute("x", config.padding);
    urlText.setAttribute("y", config.padding + 75);
    urlText.setAttribute("fill", config.urlFontColor);
    urlText.setAttribute("font-family", config.urlFontFamily.replace(/"/g, ''));
    urlText.setAttribute("font-size", config.urlFontSize);
    urlText.textContent = truncateText(url, config.textMaxWidth, config.urlFontSize);
    svg.appendChild(urlText);
    
    // Add the QR code as an image (embedded base64)
    const qrCodeX = parseInt(canvas.dataset.qrCodeX);
    const qrCodeY = parseInt(canvas.dataset.qrCodeY);
    const qrCodeSize = parseInt(canvas.dataset.qrCodeSize);
    
    // Add QR code background with rounded corners
    const qrBackground = document.createElementNS(svgNS, "rect");
    qrBackground.setAttribute("x", qrCodeX);
    qrBackground.setAttribute("y", qrCodeY);
    qrBackground.setAttribute("width", qrCodeSize);
    qrBackground.setAttribute("height", qrCodeSize);
    qrBackground.setAttribute("fill", "#ffffff");
    qrBackground.setAttribute("rx", "8");
    qrBackground.setAttribute("ry", "8");
    svg.appendChild(qrBackground);
    
    // Add QR code image
    const qrImage = document.createElementNS(svgNS, "image");
    qrImage.setAttribute("x", qrCodeX);
    qrImage.setAttribute("y", qrCodeY);
    qrImage.setAttribute("width", qrCodeSize);
    qrImage.setAttribute("height", qrCodeSize);
    qrImage.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", canvas.dataset.qrCodeUrl);
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
});

// Helper function to draw rounded rectangle
function drawRoundedRect(ctx, x, y, width, height, radius) {
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
}

function App() {
    const [busy, setBusy] = useState(false);
    const [linkInfo, setLinkInfo] = useState({ title: '', url: '' });

    const store = {
        busy,
        setBusy,
    };

    return html`
        <${StoreContext.Provider} value=${store}>
            <div>
                <${LinkFetchForm} onFetched=${setLinkInfo} />
                <pre>${JSON.stringify(linkInfo, '', 2)}</pre>
            </div>
        <//>
    `;
}

render(html`<${App} />`, document.getElementById('app'));