// Get form elements
import QRCode from 'qrcode';

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
const downloadBtn = document.getElementById('download-card-btn');

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
    titleMaxWidth: 720, // Total available width before adjustments
    textMaxWidth: 615, // Width available for text with QR on right (width - qrCodeSize - 2*padding - extra margin)
    backgroundColor: '#445271', // Rich navy blue background
    textColor: '#ffffff', // White text for better contrast on dark background
    accentColor: '#f0f0f0' // Background for QR code area
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
const formElements = [urlInput, titleInput, generateBtn, fetchMetadataBtn];

// Handle form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();

    let url = urlInput.value.trim();
    console.log('Form submitted with URL:', url);
    if (!url) {
        url = urlInput.placeholder;
    }
    
    // Update URL display
    urlDisplay.value = url;

    // Disable all form elements during fetch
    setFormDisabled(true);
    fetchBtnText.textContent = 'Fetching...';
    fetchSpinner.classList.remove('d-none');

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
    fetch(`/api/link-meta?url=${encodeURIComponent(url)}`)
        .then(response => response.json())
        .then(data => {
            console.log('Metadata received:', data);
            if (data.title) {
                titleInput.value = data.title;
            }
            // Generate QR code after fetching metadata
            generateQRCodeCard();
        })
        .catch(error => {
            console.error('Error fetching metadata:', error);
            
            // Show error message
            showAlert('Failed to fetch metadata. Please check the URL and try again.', 'danger');
            
            // Use URL as title if metadata fetch fails
            if (!titleInput.value) {
                titleInput.value = urlInput.value;
            }
        })
        .finally(() => {
            // Re-enable all form elements
            setFormDisabled(false);
            fetchBtnText.textContent = 'Fetch Metadata';
            fetchSpinner.classList.add('d-none');
        });
}

// Function to show an alert message
function showAlert(message, type = 'info') {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Insert after the form
    form.parentNode.insertBefore(alertDiv, form.nextSibling);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const bsAlert = bootstrap.Alert.getOrCreateInstance(alertDiv);
        bsAlert.close();
    }, 5000);
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

// Title input change handler
titleInput.addEventListener('input', function() {
    // Generate new QR code when title changes, but no loading state needed
    generateQRCodeCard();
});

// Function to draw empty card
function drawEmptyCard() {
    // Clear canvas
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, config.width, config.height);
    
    // Calculate QR code position (right side)
    const qrCodeX = config.width - config.padding - config.qrCodeSize;
    
    // Draw QR code area placeholder
    ctx.fillStyle = config.accentColor;
    ctx.fillRect(qrCodeX, config.padding, 
                 config.qrCodeSize, config.qrCodeSize);
    
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
    const url = urlInput.value.trim() || urlInput.placeholder;
    const title = titleInput.value.trim() || 'Untitled Link';
    
    // Update URL display
    urlDisplay.value = url;
    
    console.log('Generating QR code card for:', url, 'with title:', title);
    
    // Clear canvas
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, config.width, config.height);
    
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
            
            // Enable download button
            downloadBtn.disabled = false;
            
            // Show success message if triggered from button (not from automatic title changes)
            if (generateSpinner.classList.contains('d-none') === false) {
                showAlert('QR code card generated successfully! You can now download it.', 'success');
            }
        };
        
        // Set the image source after defining the onload handler
        qrImage.src = qrDataUrl;
    })
    .catch(error => {
        console.error('Error generating QR code:', error);
        showAlert('Failed to generate QR code. Please try again.', 'danger');
    });
}

// Handle download button click
downloadBtn.addEventListener('click', function() {
    // Create a temporary link element
    const link = document.createElement('a');
    link.download = 'rich-qrcode.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});
