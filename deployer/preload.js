const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  gitAdd: () => ipcRenderer.invoke('git-add'),
  gitCommit: (msg) => ipcRenderer.invoke('git-commit', msg),
  gitPush: () => ipcRenderer.invoke('git-push'),
  gitPull: () => ipcRenderer.invoke('git-pull')
});
