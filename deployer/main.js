const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let projectDir = process.cwd();

function createWindow() {
  const win = new BrowserWindow({
    width: 500,
    height: 520,
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

// IPC handler to select project folder
ipcMain.handle('select-project-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  if (!result.canceled && result.filePaths.length > 0) {
    projectDir = result.filePaths[0];
    return projectDir;
  }
  return null;
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
ipcMain.handle('git-status', async () => {
  return new Promise((resolve) => {
    exec('git status --porcelain', { cwd: projectDir }, (err, stdout, stderr) => {
      if (err) resolve([]);
      else {
        // Parse output: lines like ' M file.txt' or '?? newfile.txt'
        const files = stdout.split('\n').filter(Boolean).map(line => {
          const status = line.slice(0, 2);
          const file = line.slice(3);
          if (status === '??') return { file, status: 'untracked' };
          else return { file, status: 'tracked' };
        });
        resolve(files);
      }
    });
  });
});
ipcMain.handle('git-add-selected', async (e, files) => {
  if (!Array.isArray(files) || files.length === 0) return 'No files selected.';
  const cmd = `git add ${files.map(f => `"${f}"`).join(' ')}`;
  return runGit(cmd);
});
ipcMain.handle('git-remote-info', async () => {
  return new Promise((resolve) => {
    exec('git remote -v', { cwd: projectDir }, (err, stdout, stderr) => {
      if (err) resolve('No remote found.');
      else resolve(stdout.trim());
    });
  });
});
ipcMain.handle('git-branch-info', async () => {
  return new Promise((resolve) => {
    exec('git rev-parse --abbrev-ref HEAD', { cwd: projectDir }, (err, stdout, stderr) => {
      if (err) resolve('Unknown branch');
      else resolve(stdout.trim());
    });
  });
});

function runGit(cmd) {
  return new Promise((resolve) => {
    exec(cmd, { cwd: projectDir }, (err, stdout, stderr) => {
      if (err) resolve(stderr || err.message);
      else resolve(stdout || 'Done.');
    });
  });
}
