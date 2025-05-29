const urlInput = document.querySelector('#url');
const sizeSlider = document.querySelector('#size');
const sizeValue = document.querySelector('#size-value');
const foregroundInput = document.querySelector('#foreground');
const backgroundInput = document.querySelector('#background');
const qrcodePreview = document.querySelector('#qrcode-preview');
const qrcodeForm = document.querySelector('#qrcode-form');


const downloadPngBtn = document.querySelector('#download-png');

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


sizeSlider.addEventListener('input', function() {
    sizeValue.textContent = this.value + 'px';
});
downloadPngBtn.addEventListener('click', downloadPng);

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
}

// Form submission would be handled in a complete implementation
qrcodeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    generateQRCode();
});

generateQRCode();