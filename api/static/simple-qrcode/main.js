import { html, render, useState, useEffect } from 'preact';
import SettingCard from './SettingCard.js';
import PreviewCard from './PreviewCard.js';

const DEFAULT_SETTINGS = {
    url: '',
    foreground: '#000000',
    background: '#FFFFFF'
};

const App = () => {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const url = params.get('url');
        if (url) {
            setSettings(prev => ({ ...prev, url }));
        }
    }, []);

    const handleCreate = (settings) => {
        setCreating(true);
        setSettings(settings);
    }

    const handleCreated = () => setCreating(false);

    return html`
        <div class="row row-gap-4 mb-4">
            <div class="col-lg-6">
                <${SettingCard} settings=${settings} onSubmit=${handleCreate} creating=${creating} />
            </div>

            <div class="col-lg-6">
                <${PreviewCard} settings=${settings} creating=${creating} onCreated=${handleCreated} />
            </div>
        </div>
    `;
}

render(html`<${App} />`, document.getElementById('app'));
