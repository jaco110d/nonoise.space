#!/bin/bash

# Deployment script til landing page
# Dette script pusher ændringer til GitHub

set -e  # Exit ved fejl

echo "🚀 Deploying landing page til nonoise.space..."
echo ""

# Check om vi er i landing-page directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Skal køres fra landing-page/ directory"
    exit 1
fi

# Check om der er ændringer
if git diff --quiet && git diff --staged --quiet; then
    echo "✅ Ingen ændringer at deploye"
    exit 0
fi

# Vis ændringer
echo "📝 Ændringer:"
git status --short

echo ""
read -p "Commit message: " message

if [ -z "$message" ]; then
    message="Update landing page"
fi

# Git operations
echo ""
echo "📦 Committing..."
git add .
git commit -m "$message"

echo "⬆️  Pushing til GitHub..."
git push origin main

echo ""
echo "✨ Done! Ændringer er pushed til GitHub."
echo ""
echo "🌐 Hvis auto-deploy er aktiveret på Hostinger, vil siden opdatere automatisk."
echo "📍 Check https://nonoise.space om et øjeblik."
echo ""

