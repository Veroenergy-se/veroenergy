# Vero Development Workflow

## Quick Start

1. **Start Development Server:**
   ```bash
   ./dev-server.sh
   ```

2. **Open Development Site:**
   - Go to: http://localhost:8080/dev-index.html
   - You'll see a red banner indicating DEV MODE

3. **Make Changes:**
   - Edit `dev-index.html` for testing
   - Changes appear immediately on refresh

4. **Deploy to Production:**
   - When happy with changes, copy them to production files
   - Push to main branch to update live site

## File Structure

- `dev-index.html` - Your development version (with red dev banner)
- `new-site/complete.html` - Your new production version
- `index.html` - Current live production version
- `dev-server.sh` - Development server script

## Development Process

1. **Local Development:**
   - Make changes to `dev-index.html`
   - Test at http://localhost:8080/dev-index.html

2. **Ready for Production:**
   - Copy changes from `dev-index.html` to appropriate production files
   - Remove dev banner styles
   - Test production version locally

3. **Deploy:**
   - Commit and push to main branch
   - Live site updates automatically

## URLs

- **Development:** http://localhost:8080/dev-index.html
- **Production:** https://veroenergy.se

## Tips

- The red dev banner reminds you you're in development mode
- All CSS and JavaScript work the same as production
- Purchase links work normally for testing checkout flow
- Use browser dev tools for debugging