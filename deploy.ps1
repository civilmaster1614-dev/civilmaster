# deploy.ps1 - Auto-commit and push changes to GitHub Pages (Windows PowerShell)

# Stage all changes (add, modify, delete)
git add -A

# Prompt for a commit message
$commitMsg = Read-Host "Enter commit message"

# Commit (if there are staged changes)
if (-not [string]::IsNullOrWhiteSpace($commitMsg)) {
    git commit -m "$commitMsg"
} else {
    Write-Host "No commit message entered. Aborting commit."
    exit 1
}

# Push to the current branch
git push

Write-Host "`n✅ Deployment complete! Check your GitHub Pages site in a few minutes."
