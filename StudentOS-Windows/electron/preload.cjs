// StudentOS Secure Context Bridge Preload Script
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('studentOSDesktop', {
  isDesktop: true,
  platform: 'win32',
  getPlatformInfo: () => ipcRenderer.invoke('desktop:get-platform-info'),
  toggleFullscreen: () => ipcRenderer.invoke('desktop:toggle-fullscreen'),
  isFullscreen: () => ipcRenderer.invoke('desktop:is-fullscreen'),
  minimize: () => ipcRenderer.invoke('desktop:minimize'),
  maximize: () => ipcRenderer.invoke('desktop:maximize'),
  close: () => ipcRenderer.invoke('desktop:close'),
  showNotification: (options) => ipcRenderer.invoke('desktop:show-notification', options),
  openExternal: (url) => ipcRenderer.invoke('desktop:open-external', url),
});
