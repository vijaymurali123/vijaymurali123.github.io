#!/bin/bash

# Script to connect local project to existing GitHub repository
# Usage: ./connect-repo.sh <your-github-repo-url>

if [ -z "$1" ]; then
    echo "❌ Error: Please provide your GitHub repository URL"
    echo "Usage: ./connect-repo.sh https://github.com/username/repo-name.git"
    exit 1
fi

REPO_URL=$1

echo "🔗 Connecting to GitHub repository..."
echo "Repository: $REPO_URL"
echo ""

# Check if .git directory exists
if [ -d ".git" ]; then
    echo "✅ Git repository already initialized"
else
    echo "📦 Initializing git repository..."
    git init
fi

# Add all files
echo "📝 Staging all files..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Wedding website"

# Add remote origin
echo "🌐 Adding remote repository..."
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"

# Pull existing content (if any) with rebase
echo "⬇️  Pulling existing content from remote..."
git pull origin main --rebase --allow-unrelated-histories 2>/dev/null || \
git pull origin master --rebase --allow-unrelated-histories 2>/dev/null || \
echo "No existing content to pull or using new branch"

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✨ Done! Your local project is now connected to GitHub"
echo "🔗 Repository: $REPO_URL"
