import { html, render, useState } from 'preact';
import { StoreContext } from '../_shared/StoreContext.js';
import LinkFetchForm from './LinkFetchForm.js';
import SettingCard from './SettingCard.js';
import PreviewCard from './PreviewCard.js';

function App() {
    const [busy, setBusy] = useState(false);
    const [linkInfo, setLinkInfo] = useState({ title: '', url: '' });

    const store = {
        busy,
        setBusy,
    };

    const handleGenerate = (info) => {
        setLinkInfo(info);
    };

    return html`
        <${StoreContext.Provider} value=${store}>
            <div>
                <${LinkFetchForm} onFetched=${setLinkInfo} />
                <div class="row row-gap-4 mb-4">
                    <div class="col-lg-6">
                        <${SettingCard} linkInfo=${linkInfo} onGenerate=${handleGenerate} />
                    </div>
                    <div class="col-lg-6">
                        <${PreviewCard} 
                            linkInfo=${linkInfo} 
                        />
                    </div>
                </div>
            </div>
        <//>
    `;
}

render(html`<${App} />`, document.getElementById('app'));