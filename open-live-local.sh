#!/bin/bash

echo "🌐 Opening your live site locally..."
echo ""
echo "📄 File: live-site-local.html"
echo "🎯 This matches exactly what's on veroenergy.se"
echo ""

# Try to open directly in browser
if command -v open &> /dev/null; then
    echo "✅ Opening in your default browser..."
    open live-site-local.html
else
    echo "❌ Could not open automatically"
    echo "📂 Please double-click 'live-site-local.html' in Finder"
fi

echo ""
echo "🔗 Or start a server with:"
echo "   python3 -m http.server 8080"
echo "   Then go to: http://localhost:8080/live-site-local.html"