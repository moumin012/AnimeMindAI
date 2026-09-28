// StudentOS Electron Desktop Main Process for Windows 10/11 x64
const { app, BrowserWindow, ipcMain, shell, Notification, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

// Ensure single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

let mainWindow = null;

function getIconPath() {
  const possiblePaths = [
    path.join(__dirname, '../build/icon.ico'),
    path.join(__dirname, '../public/icon.ico'),
    path.join(__dirname, 'icon.ico'),
    path.join(process.resourcesPath, 'icon.ico'),
    path.join(__dirname, '../public/pwa-512x512.png'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

function createWindow() {
  // Hide default menu bar
  Menu.setApplicationMenu(null);

  const icon = getIconPath();

  mainWindow = new BrowserWindow({
    width: 1366,
    height: 800,
    minWidth: 1100,
    minHeight: 650,
    title: 'StudentOS | خطط. ادرس. ركّز. تذكّر. تطوّر',
    icon: icon,
    backgroundColor: '#0b1120',
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
  });

  // Ready-to-show event to avoid white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Load production dist bundle or dev server
  const distIndexPath = path.join(__dirname, '../dist/index.html');
  const isDev = process.env.STUDENTOS_DEV === '1';

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000').catch(() => {
      mainWindow.loadFile(distIndexPath);
    });
  } else {
    mainWindow.loadFile(distIndexPath).catch((err) => {
      console.error('Failed to load local HTML file:', err);
    });
  }

  // Handle external links safely
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      // If it's a regular external link, open in default browser
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers for Safe Windows Desktop Features
ipcMain.handle('desktop:get-platform-info', () => {
  return {
    isElectron: true,
    platform: process.platform,
    arch: process.arch,
    version: app.getVersion(),
  };
});

ipcMain.handle('desktop:toggle-fullscreen', () => {
  if (mainWindow) {
    const isFull = mainWindow.isFullScreen();
    mainWindow.setFullScreen(!isFull);
    return !isFull;
  }
  return false;
});

ipcMain.handle('desktop:is-fullscreen', () => {
  return mainWindow ? mainWindow.isFullScreen() : false;
});

ipcMain.handle('desktop:minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('desktop:maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
    return mainWindow.isMaximized();
  }
  return false;
});

ipcMain.handle('desktop:close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('desktop:show-notification', (event, { title, body, icon }) => {
  if (Notification.isSupported()) {
    const notif = new Notification({
      title: title || 'StudentOS',
      body: body || '',
      icon: icon || getIconPath(),
    });
    notif.show();
    return true;
  }
  return false;
});

ipcMain.handle('desktop:open-external', (event, url) => {
  if (typeof url === 'string' && (url.startsWith('https://') || url.startsWith('http://') || url.startsWith('mailto:'))) {
    shell.openExternal(url);
    return true;
  }
  return false;
});
