from flask import Flask, request, render_template
from flask import redirect, url_for
from flask_minify import Minify
from functools import lru_cache
import os
import yaml

# Import the Blueprint using a relative import
from .api import api_bp
import importlib
import pathlib

app = Flask(__name__)
app.register_blueprint(api_bp)

DEFAULT_LOCALE = 'en'
SETTINGS_DIR = os.path.join(app.root_path, 'settings')
FLASK_ENV = os.environ.get('FLASK_ENV', 'development')

if app.debug:
    @app.before_request
    def clear_settings_cache_on_debug():
        load_settings.cache_clear()

Minify(app=app, html=False, js=True, cssless=True)

@lru_cache(maxsize=8)
def load_settings(locale):
    final_locale = locale
    settings_path = os.path.join(SETTINGS_DIR, f'{locale}.yml')
    if not os.path.exists(settings_path):
        settings_path = os.path.join(SETTINGS_DIR, f'{DEFAULT_LOCALE}.yml')
        final_locale = DEFAULT_LOCALE
    with open(settings_path, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)[final_locale]

def get_locale():
    locale = request.args.get('lang')
    if not locale:
        locale = request.accept_languages.best_match([DEFAULT_LOCALE])
    return locale or DEFAULT_LOCALE

@app.context_processor
def inject_globals():
    settings = load_settings(get_locale())
    site_data = settings.get('site', {})
    tools = settings.get('tools', {})
    return dict(flask_env=FLASK_ENV, tools=tools, **site_data)

@app.route('/')
def home():
    settings = load_settings(get_locale())
    tools = settings.get('tools', {})
    return render_template('home.html', tools=tools)

@app.route('/<path:tool>')
def tool_home(tool):
    template_file = f"tools/{tool}/index.html"
    template_full_path = os.path.join(app.root_path, app.template_folder, template_file)
    if os.path.exists(template_full_path):
        settings = load_settings(get_locale())
        page_data = settings.get('tools', {}).get(tool, {})

        return render_template(template_file, **page_data)

    return redirect(url_for('home'))

@app.route('/site.webmanifest')
def site_webmanifest():
    return app.send_static_file('site.webmanifest')

@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')

if __name__ == '__main__':
    app.run(debug=True)
