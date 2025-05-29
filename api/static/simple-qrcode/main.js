const urlInput = document.querySelector('#url');
const sizeSlider = document.querySelector('#size');
const sizeValue = document.querySelector('#size-value');
const foregroundInput = document.querySelector('#foreground');
const backgroundInput = document.querySelector('#background');
const qrcodeForm = document.querySelector('#qrcode-form');
const qrcodePreview = document.querySelector('#qrcode-preview');
const downloadPngBtn = document.querySelector('#download-png');
const downloadSvgBtn = document.querySelector('#download-svg');

function downloadPng() {
    const img = qrcodePreview.querySelector('img');
    if (img && img.src) {
        const link = document.createElement('a');
        link.href = img.src;
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function downloadSvg() {
    const qrImage = qrcodePreview.querySelector('img');
    if (!qrImage || !qrImage.src) return;
    
    // Create SVG
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    const size = parseInt(sizeSlider.value);
    
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svg.setAttribute("xmlns", svgNS);
    
    // Add background
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("width", size);
    rect.setAttribute("height", size);
    rect.setAttribute("fill", backgroundInput.value);
    svg.appendChild(rect);
    
    // Use the QR code image directly
    const canvas = qrcodePreview.querySelector('canvas');
    const ctx = canvas.getContext("2d");

    // Get the image data
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;
    const pixelSize = size / Math.sqrt(data.length / 4);
    
    // Create SVG content based on the image data
    for (let i = 0; i < data.length; i += 4) {
        // Only process black pixels (QR code dots)
        if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
            const pixelIndex = i / 4;
            const x = (pixelIndex % size) * pixelSize;
            const y = Math.floor(pixelIndex / size) * pixelSize;
            
            const pixel = document.createElementNS(svgNS, "rect");
            pixel.setAttribute("x", x);
            pixel.setAttribute("y", y);
            pixel.setAttribute("width", pixelSize);
            pixel.setAttribute("height", pixelSize);
            pixel.setAttribute("fill", foregroundInput.value);
            svg.appendChild(pixel);
        }
    }
    
    // Convert SVG to data URL and download
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const svgBlob = new Blob([svgString], {type: "image/svg+xml"});
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const link = document.createElement('a');
    link.href = svgUrl;
    link.download = 'qrcode.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(svgUrl);
}

function generateQRCode() {
    qrcodePreview.innerHTML = '';
    const url = urlInput.value.trim();
    const size = parseInt(sizeSlider.value);
    const foreground = foregroundInput.value.trim();
    const background = backgroundInput.value.trim();

    new QRCode(qrcodePreview, {
        text: url,
        width: size,
        height: size,
        colorDark: foreground,
        colorLight: background,
        correctLevel: QRCode.CorrectLevel.H
    });

    qrcodePreview.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function handleSubmit (e) {
    e.preventDefault();
    generateQRCode();
}

function handleSizeChange () {
    sizeValue.textContent = sizeSlider.value + 'px';
}

sizeSlider.addEventListener('input', handleSizeChange);
downloadPngBtn.addEventListener('click', downloadPng);
downloadSvgBtn.addEventListener('click', downloadSvg);
qrcodeForm.addEventListener('submit', handleSubmit);

generateQRCode();