# Tests for Feather Tools

This directory contains tests for the Feather Tools application.

## Running Tests

To run the tests, make sure you have installed the requirements, then run:

```bash
pytest
```

Or to run with verbose output:

```bash
pytest -v
```

To run a specific test file:

```bash
pytest tests/test_api.py
```

## Test Structure

- `conftest.py`: Contains shared fixtures and pytest configuration
- `test_api.py`: Tests for the API endpoints

## Adding New Tests

When adding new tests:

1. Create new test files with the prefix `test_`.
2. Use descriptive test function names with the prefix `test_`.
3. Consider using the existing fixtures in `conftest.py`.
4. Use the `responses` library to mock HTTP requests.
