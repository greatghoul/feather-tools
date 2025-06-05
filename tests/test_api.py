import os
import sys
import pytest
import json
import requests
import responses
from unittest import mock
from urllib.parse import urlparse

# Import the app
from api.index import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['DEBUG'] = False
    with app.test_client() as client:
        yield client

@responses.activate
def test_link_meta_html_response(client):
    """Test the link-meta endpoint with an HTML response."""
    test_url = 'https://example.com/'
    test_title = 'Example Domain'
    html_content = f'<html><head><title>{test_title}</title></head><body>Test content</body></html>'
    
    # No need to mock HEAD request anymore, using GET only
    
    # Mock the GET request
    responses.add(
        responses.GET,
        test_url,
        body=html_content,
        status=200,
        content_type='text/html'
    )
    
    response = client.get(f'/api/link-meta?url={test_url}')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['title'] == test_title
    # URLs often get normalized with trailing slashes, so we'll use the response URL in our test
    assert data['url'] == test_url

@responses.activate
def test_link_meta_missing_url(client):
    """Test the link-meta endpoint with missing URL parameter."""
    response = client.get('/api/link-meta')
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data

@responses.activate
def test_link_meta_non_html_response(client):
    """Test the link-meta endpoint with a non-HTML response."""
    test_url = 'https://example.com/file.pdf'
    
    # Mock the GET request with non-HTML content type
    responses.add(
        responses.GET,
        test_url,
        headers={'Content-Type': 'application/pdf'},
        status=200,
        body=b'PDF content'
    )
    
    response = client.get(f'/api/link-meta?url={test_url}')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['title'] == 'file.pdf'  # Should keep full filename with extension
    # URLs often get normalized with trailing slashes
    assert data['url'] in (test_url, f"{test_url}/")

@responses.activate
def test_link_meta_request_error(client):
    """Test the link-meta endpoint with a request error."""
    test_url = 'https://nonexistent-domain.example'
    
    # Mock a connection error
    responses.add(
        responses.GET,
        test_url,
        body=requests.RequestException('Connection error')
    )
    
    response = client.get(f'/api/link-meta?url={test_url}')
    
    assert response.status_code == 500
    data = json.loads(response.data)
    assert 'error' in data

@responses.activate
def test_link_meta_partial_html(client):
    """Test the link-meta endpoint with partial HTML that contains the title."""
    test_url = 'https://example.com/'
    test_title = 'Partial HTML Example'
    
    # Simulate a large HTML page where we only need to read part of it
    html_content = f'''
    <html>
    <head>
        <meta charset="utf-8">
        <title>{test_title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
        <!-- Imagine lots of content here -->
    </body>
    </html>
    '''
    
    # No need to mock HEAD request anymore, using GET only
    
    # Mock the GET request with chunked response
    responses.add(
        responses.GET,
        test_url,
        body=html_content,
        status=200,
        content_type='text/html'
    )
    
    response = client.get(f'/api/link-meta?url={test_url}')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['title'] == test_title
    # URLs often get normalized with trailing slashes
    assert data['url'] == test_url

@responses.activate
def test_link_meta_no_scheme_url(client):
    """Test the link-meta endpoint with a URL that has no scheme."""
    test_url = 'example.com'
    expected_url = 'http://example.com/'
    test_title = 'Example Domain'
    html_content = f'<html><head><title>{test_title}</title></head><body>Test content</body></html>'
    
    # No need to mock HEAD request anymore, using GET only
    
    # Mock the GET request
    responses.add(
        responses.GET,
        expected_url,
        body=html_content,
        status=200,
        content_type='text/html'
    )
    
    response = client.get(f'/api/link-meta?url={test_url}')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['title'] == test_title
    # URLs often get normalized with trailing slashes
    assert data['url'] == expected_url
