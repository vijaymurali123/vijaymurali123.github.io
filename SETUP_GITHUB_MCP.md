# GitHub MCP Setup Guide

This project is configured with Model Context Protocol (MCP) for GitHub integration, allowing you to manage your repository using natural language prompts.

## Prerequisites

1. **GitHub Account**: You need a GitHub account
2. **GitHub Personal Access Token**: Required for authentication

## Setup Steps

### 1. Create a GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Or visit: https://github.com/settings/tokens

2. Click "Generate new token" → "Generate new token (classic)"

3. Give it a descriptive name (e.g., "Wedding Site MCP")

4. Select the following scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
   - ✅ `read:org` (Read org and team membership)
   - ✅ `user` (Read user profile data)

5. Click "Generate token" and **copy the token immediately** (you won't see it again!)

### 2. Set Up Environment Variable

Add your GitHub token to your environment:

**For macOS/Linux (bash/zsh):**
```bash
# Add to ~/.zshrc or ~/.bash_profile
export GITHUB_TOKEN="your_github_token_here"

# Then reload your shell
source ~/.zshrc
```

**For temporary use (current terminal session only):**
```bash
export GITHUB_TOKEN="your_github_token_here"
```

### 3. Verify VS Code MCP Configuration

The project already has MCP configured in `.vscode/settings.json`. The configuration uses:
- GitHub MCP Server via npx
- Your `GITHUB_TOKEN` environment variable for authentication

### 4. Install Node.js (if not already installed)

The GitHub MCP server requires Node.js. Check if you have it:
```bash
node --version
```

If not installed, download from: https://nodejs.org/

### 5. Restart VS Code

After setting up the environment variable, restart VS Code to load the new configuration.

## What You Can Do with GitHub MCP

Once configured, you can use natural language prompts to:

### Repository Management
- "Create a new GitHub repository for this project"
- "Push my code to GitHub"
- "Create a new branch called 'feature-gallery'"

### Issue Management
- "Create an issue about adding a countdown timer"
- "List all open issues"
- "Close issue #5"

### Pull Requests
- "Create a pull request for the current branch"
- "List all open pull requests"
- "Review PR #3"

### File Operations
- "Show the contents of index.html in the repository"
- "Commit and push all changes with message 'Update wedding details'"

### Collaboration
- "Add collaborator @username to the repository"
- "Create a new release v1.0.0"

## Quick Start Commands

After setup, try these commands in the terminal:

```bash
# Initialize git repository (if not done)
git init

# Create initial commit
git add .
git commit -m "Initial commit: Wedding website"

# Create GitHub repository and push (via MCP prompt)
# Just ask: "Create a new GitHub repository called 'vijay-wedding-site' and push my code"
```

## Troubleshooting

**MCP not working?**
- Ensure `GITHUB_TOKEN` environment variable is set
- Restart VS Code after setting the token
- Check that Node.js is installed (`node --version`)
- Verify token has correct permissions on GitHub

**Permission errors?**
- Check your GitHub token scopes
- Generate a new token if needed

**Token security:**
- Never commit your token to the repository
- The `.gitignore` file is configured to exclude `.env` files
- Store tokens in environment variables only

## Alternative: Using GitHub CLI

You can also use GitHub CLI for similar functionality:

```bash
# Install GitHub CLI
brew install gh  # macOS

# Authenticate
gh auth login

# Create repository
gh repo create vijay-wedding-site --public --source=. --push
```

## Need Help?

- GitHub Token Guide: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
- MCP Documentation: https://modelcontextprotocol.io/
- GitHub CLI: https://cli.github.com/

---

**Ready to use!** Once configured, simply use natural language in Copilot Chat to manage your GitHub repository.
