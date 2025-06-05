#!/bin/bash

# Run tests with pytest
echo "Running Feather Tools tests..."

# Set up PYTHONPATH to include the project directory
export PYTHONPATH="$PYTHONPATH:$(pwd)"

# Run pytest with any passed arguments
python -m pytest "$@"
