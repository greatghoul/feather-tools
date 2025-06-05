// Get form elements
const form = document.getElementById('rich-qrcode-form');
const urlInput = document.getElementById('url-input');
const titleInput = document.getElementById('title-input');
const fetchMetadataBtn = document.getElementById('fetch-metadata-btn');
const canvas = document.getElementById('qrcode-card');
const downloadBtn = document.getElementById('download-card-btn');

// Handle form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();

    let url = urlInput.value.trim()
    console.log('Form submitted with URL:', url);
    if (!url) {
        url = urlInput.placeholder;
    }

    fetchMetadataBtn.disabled = true;
    fetchMetadataBtn.textContent = 'Fetching...';

    fetchUrlMetadata(url);
});

// Function to fetch URL metadata
function fetchUrlMetadata(url) {
    fetch(`/api/link-meta?url=${encodeURIComponent(url)}`)
        .then(response => response.json())
        .then(data => {
            console.log('Metadata received:', data);
            if (data.title) {
                titleInput.value = data.title;
            }
        })
        .catch(error => {
            console.error('Error fetching metadata:', error);
        })
        .finally(() => {
            fetchMetadataBtn.disabled = false;
            fetchMetadataBtn.textContent = 'Fetch Title';
        });
}

// Function to generate QR code card
function generateQRCodeCard() {
    // We'll implement this later
    console.log('Generating QR code card for:', urlInput.value, 'with title:', titleInput.value);
    
    // Enable download button when card is generated
    downloadBtn.disabled = false;
}
