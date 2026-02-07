#!/bin/bash

echo "🚀 Starting Vero DEVELOPMENT server..."
echo ""
echo "✅ Development site will be available at:"
echo "🌐 http://localhost:8080/dev-index.html"
echo ""
echo "📁 Serving files from: $(pwd)"
echo "🔧 DEV MODE: Make changes to dev-index.html"
echo "📤 When ready, copy changes to production files"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Try different server options
if command -v python3 &> /dev/null; then
    python3 -m http.server 8080
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer 8080
elif command -v php &> /dev/null; then
    php -S localhost:8080
else
    echo "❌ No suitable server found."
    echo "Please install Python 3 or PHP"
fi