#!/usr/bin/env zsh

# Set up Python path
export PYTHONPATH="$PWD:$PYTHONPATH"

# Run tests with pytest
echo "Running Feather Tools tests..."
python -m pytest "$@" -v
