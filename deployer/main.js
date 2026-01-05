const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 500,
    height: 420,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  win.setMenuBarVisibility(false);
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers for git commands
ipcMain.handle('git-add', async () => {
  return runGit('git add -A');
});
ipcMain.handle('git-commit', async (e, msg) => {
  return runGit(`git commit -m "${msg.replace(/"/g, '\"')}"`);
});
ipcMain.handle('git-push', async () => {
  return runGit('git push');
});
ipcMain.handle('git-pull', async () => {
  return runGit('git pull');
});

function runGit(cmd) {
  return new Promise((resolve) => {
    exec(cmd, { cwd: process.cwd() }, (err, stdout, stderr) => {
      if (err) resolve(stderr || err.message);
      else resolve(stdout || 'Done.');
    });
  });
}
