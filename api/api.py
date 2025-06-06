from flask import Blueprint, request, jsonify
import requests
import re
import os
from urllib.parse import urlparse, unquote

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/link-meta', methods=['GET'])
def get_link_metadata():
    url = request.args.get('url')
    
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    
    try:
        # Ensure URL has a scheme
        parsed_url = urlparse(url)
        if not parsed_url.scheme:
            url = f'http://{url}'
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        title = None
        
        # Directly use GET with streaming to efficiently fetch headers and content
        with requests.get(url, headers=headers, stream=True, timeout=5, allow_redirects=True) as response:
            response.raise_for_status()
            
            final_url = response.url
            content_type = response.headers.get('Content-Type', '').lower()
            
            # Only process HTML content for title extraction
            if 'text/html' in content_type:
                chunk_size = 8192  # 8KB
                max_size = 1024 * 1024  # 1MB max to read
                total_read = 0
                html_chunks = []
                
                for chunk in response.iter_content(chunk_size=chunk_size):
                    if not chunk:
                        break
                    
                    html_chunks.append(chunk)
                    total_read += len(chunk)
                    
                    # Try to find the title in what we've read so far
                    html_so_far = b''.join(html_chunks).decode('utf-8', errors='ignore')
                    title_match = re.search(r'<title[^>]*>(.*?)</title>', html_so_far, re.IGNORECASE | re.DOTALL)
                    
                    if title_match:
                        title = title_match.group(1).strip()
                        break
                    
                    # Stop after reading max_size
                    if total_read >= max_size:
                        break
        
        # If we couldn't find a title or it's not HTML, use the URL's filename
        if not title:
            path = urlparse(final_url).path
            filename = os.path.basename(unquote(path))
            
            # Use the full filename if it exists (including extension), otherwise use domain
            if filename:
                # Keep the full filename with extension
                title = filename
            else:
                # Use domain name if no filename
                title = urlparse(final_url).netloc
        
        # Return metadata
        return jsonify({
            'title': title,
            'url': final_url  # This will show the final URL after any redirects
        })
    
    except requests.RequestException as e:
        return jsonify({'error': f'Failed to fetch URL: {str(e)}'}), 400
    except UnicodeDecodeError:
        # If decoding fails, use filename as fallback
        path = urlparse(url).path
        filename = os.path.basename(unquote(path)) or urlparse(url).netloc
        return jsonify({
            'title': filename or url,  # Keep the full filename with extension
            'url': url
        })
    except Exception as e:
        return jsonify({'error': f'Error processing request: {str(e)}'}), 400
