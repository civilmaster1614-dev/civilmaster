# Electron GitHub Pages Deployer

A simple Electron app to deploy your GitHub Pages website with a modern UI. Features:
- Buttons for 'Add All', 'Commit', 'Push', and 'Deploy All' (all three in sequence)
- Text input for commit message
- Status area for git output/errors
- Runs git commands in the background and displays results

## Getting Started

1. Run `npm install` in this folder.
2. Run `npm start` to launch the app.

## Build a Windows .exe

1. Run `npm install --save-dev @electron/packager`
2. Then run:
   ```
   npx @electron/packager . deployer --platform=win32 --arch=x64 --out=dist --overwrite
   ```
3. Or, just run:
   ```
   npm run build-win
   ```
   (This will do both steps above automatically.)
4. Your deployer.exe will be in the `dist/deployer-win32-x64/` folder.

---

This app is for local use. You must have git installed and your project must be a git repository connected to GitHub.
