import { html } from 'preact';

const SettingCard = ({ settings, creating, onSubmit }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newSettings = Object.fromEntries(formData);
        onSubmit(newSettings);
    };

    return html`
        <div class="card h-100">
            <div class="card-header">
                <h5 class="mb-0">Settings</h5>
            </div>
            <div class="card-body">
                <form id="qrcode-form" onSubmit=${handleSubmit}>
                    <div class="form-group">
                        <label for="url">URL</label>
                        <input type="url" class="form-control" id="url" name="url" placeholder="https://feather-tools.com/simple-qrcode" value=${settings.url} />
                    </div>
                    
                    <div class="form-group">
                        <label for="foreground">Foreground Color</label>
                        <input type="color" class="form-control form-control-color" id="foreground" name="foreground" value=${settings.foreground} />
                    </div>

                    <div class="form-group">
                        <label for="background">Background Color</label>
                        <input type="color" class="form-control form-control-color" id="background" name="background" value=${settings.background} />
                    </div>

                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary mt-3" disabled=${creating}>Generate QR Code</button>
                    </div>
                </form>
            </div>
        </div>
    `;
};

export default SettingCard;
