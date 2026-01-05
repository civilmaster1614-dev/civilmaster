const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  gitAdd: () => ipcRenderer.invoke('git-add'),
  gitCommit: (msg) => ipcRenderer.invoke('git-commit', msg),
  gitPush: () => ipcRenderer.invoke('git-push'),
  gitPull: () => ipcRenderer.invoke('git-pull'),
  gitStatus: () => ipcRenderer.invoke('git-status'),
  gitAddSelected: (files) => ipcRenderer.invoke('git-add-selected', files),
  selectProjectFolder: () => ipcRenderer.invoke('select-project-folder'),
  getRemoteInfo: () => ipcRenderer.invoke('git-remote-info'),
  getBranchInfo: () => ipcRenderer.invoke('git-branch-info'),
});
