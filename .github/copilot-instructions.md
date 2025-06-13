# Copilot Instructions for Feather Tools

## Project Overview
This is a Flask-based web application that provides various online tools, primarily focused on QR code generation. The project is deployed on Vercel and includes both simple and rich QR code generation features.

## Git Commit Message Guidelines

When generating commit messages, follow these conventions:

### Commit Message Format
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types
- **feat**: A new feature for the user
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Scopes
Based on the project structure, use these scopes:
- **api**: Changes to Flask API endpoints and backend logic
- **ui**: Changes to frontend components and templates
- **qrcode**: Changes specific to QR code generation features
- **rich-qrcode**: Changes to the rich QR code tool
- **simple-qrcode**: Changes to the simple QR code tool
- **config**: Configuration changes (Vercel, Flask, etc.)
- **deps**: Dependency updates
- **tests**: Test-related changes
- **docs**: Documentation changes

### Examples
- `feat(qrcode): add custom logo support for rich QR codes`
- `fix(api): resolve CORS issue for QR code generation endpoint`
- `style(ui): improve responsive design for mobile devices`
- `refactor(rich-qrcode): extract QR code generation logic into separate module`
- `docs(readme): update deployment instructions for Vercel`
- `test(api): add unit tests for QR code API endpoints`
- `chore(deps): update Flask to version 3.0.0`
- `build(vercel): optimize serverless function configuration`

### Description Guidelines
- Use imperative mood ("add" not "added" or "adds")
- Keep the first line under 50 characters
- Don't capitalize the first letter
- Don't end with a period
- Be specific about what changed

### Body Guidelines (when needed)
- Wrap at 72 characters
- Explain what and why, not how
- Use bullet points for multiple changes

### Footer Guidelines (when applicable)
- Reference issues: `Closes #123`
- Breaking changes: `BREAKING CHANGE: <description>`
- Co-authored commits: `Co-authored-by: Name <email>`

## File Change Patterns

### When working with different file types:
- **Python files** (`*.py`): Focus on functionality, API changes, bug fixes
- **JavaScript files** (`*.js`): Focus on frontend behavior, user interactions
- **HTML templates** (`*.html`): Focus on UI structure, layout changes
- **CSS files** (`*.css`): Focus on styling, responsive design
- **Config files** (`vercel.json`, `requirements.txt`): Focus on deployment, dependencies
- **Test files** (`test_*.py`): Focus on test coverage, bug fixes

### Common commit patterns for this project:
- QR code feature enhancements
- UI/UX improvements
- API endpoint modifications
- Performance optimizations
- Bug fixes for different browsers/devices
- Deployment configuration updates
- Documentation improvements

## Additional Guidelines
- Keep commits atomic (one logical change per commit)
- Test your changes before committing
- Update documentation when adding new features
- Consider backward compatibility when making API changes
- Use meaningful branch names that reflect the work being done
