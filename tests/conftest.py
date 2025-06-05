# This file contains pytest configuration and shared fixtures
import os
import sys

# Add the parent directory to sys.path to import the application
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Add api directory specifically for importing modules from there
api_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../api'))
sys.path.insert(0, api_path)
