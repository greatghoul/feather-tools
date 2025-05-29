from flask import Flask, render_template
from flask import redirect, url_for
from flask_minify import Minify
import os

app = Flask(__name__)

Minify(app=app, html=False, js=True, cssless=True)

# Define global variables for template context
SITE_NAME = "Feather Tools"

@app.context_processor
def inject_globals():
    return dict(site_name=SITE_NAME)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/<path:tool>')
def tool_home(tool):
    template_file = f"tools/{tool}/index.html"
    template_full_path = os.path.join(app.root_path, app.template_folder, template_file)
    if os.path.exists(template_full_path):
        return render_template(template_file)
    return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(debug=True)
