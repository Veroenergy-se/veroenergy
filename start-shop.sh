#!/bin/bash

echo "🛍️  Starting Vero Shop Local Server (LATEST DESIGN)..."
echo ""
echo "✅ Your latest shop will be available at:"
echo "🌐 http://localhost:3000/latest-shop.html"
echo ""
echo "📁 Serving from: $(pwd)"
echo "🛒 Latest shop page: latest-shop.html"
echo "🎨 Updated with new design from complete.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 -m http.server 3000