const urlInput = document.querySelector('#url');
const sizeSlider = document.querySelector('#size');
const sizeValue = document.querySelector('#size-value');
const foregroundInput = document.querySelector('#foreground');
const backgroundInput = document.querySelector('#background');
const qrcodePreview = document.querySelector('#qrcode-preview');
const qrcodeForm = document.querySelector('#qrcode-form');

sizeSlider.addEventListener('input', function() {
    sizeValue.textContent = this.value + 'px';
});

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