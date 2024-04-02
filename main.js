const {
    BrowserWindow,
    Menu,
    app,
    ipcMain
  } = require('electron');
  const {
    initPopupsConfigurationMain,
    getPopupTarget,
    RemoteControlMain,
    setupAlwaysOnTopMain,
    setupPowerMonitorMain,
    setupScreenSharingMain
  } = require('@jitsi/electron-sdk');
  const windowStateKeeper = require('electron-window-state');
  const path = require('path')
  const URL = require('url');
  
  
  app.commandLine.appendSwitch('disable-site-isolation-trials');
  app.commandLine.appendSwitch('force-fieldtrials', 'WebRTC-Audio-Red-For-Opus/Enabled/');
  if (!app.commandLine.hasSwitch('enable-features')) {
    app.commandLine.appendSwitch('enable-features', 'WebRTCPipeWireCapturer');
  }
  
  let mainWindow = null;
  
  function createWindow() {
    const indexURL = URL.format({
      pathname: path.resolve(__dirname, './src/index.html'),
      protocol: 'file:',
      slashes: true
    });
    const windowState = windowStateKeeper({
      defaultWidth: 800,
      defaultHeight: 600,
      fullScreen: false
    });
    const options = {
      x: windowState.x,
      y: windowState.y,
      width: windowState.width,
      height: windowState.height,
      minWidth: 800,
      minHeight: 600,
      show: false,
      webPreferences: {
        enableBlinkFeatures: 'WebAssemblyCSP',
        contextIsolation: true,
        nodeIntegration: false,
        preload: path.resolve(__dirname, 'preload.js'),
        sandbox: false
      }
    };
    const windowOpenHandler = ({ url, frameName }) => {
      const target = getPopupTarget(url, frameName);
  
      if (!target || target === 'browser') {
        // openExternalLink(url);
  
        return { action: 'deny' };
      }
  
      if (target === 'electron') {
        return { action: 'allow' };
      }
  
      return { action: 'deny' };
    };
    mainWindow = new BrowserWindow(options);
    windowState.manage(mainWindow);
    mainWindow.loadURL(indexURL);
  
    mainWindow.webContents.setWindowOpenHandler(windowOpenHandler);
    const fileFilter = {
      urls: ['file://*']
    };
  
    mainWindow.webContents.session.webRequest.onBeforeSendHeaders(fileFilter, (details, callback) => {
      const requestedPath = path.resolve(URL.fileURLToPath(details.url));
      const appBasePath = path.resolve(__dirname);
  
      if (!requestedPath.startsWith(appBasePath)) {
        callback({ cancel: true });
        console.warn(`Rejected file URL: ${details.url}`);
  
        return;
      }
  
      callback({ cancel: false });
    });
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      delete details.responseHeaders['x-frame-options'];
  
      if (details.responseHeaders['content-security-policy']) {
        const cspFiltered = details.responseHeaders['content-security-policy'][0]
          .split(';')
          .filter(x => x.indexOf('frame-ancestors') === -1)
          .join(';');
  
        details.responseHeaders['content-security-policy'] = [cspFiltered];
      }
  
      if (details.responseHeaders['Content-Security-Policy']) {
        const cspFiltered = details.responseHeaders['Content-Security-Policy'][0]
          .split(';')
          .filter(x => x.indexOf('frame-ancestors') === -1)
          .join(';');
  
        details.responseHeaders['Content-Security-Policy'] = [cspFiltered];
      }
  
      callback({
        responseHeaders: details.responseHeaders
      });
    });
  
    setupScreenSharingMain(mainWindow, 'App', 'org.jitsi.jitsi-meet');
    mainWindow.on('closed', () => {
      mainWindow = null;
    });
    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
    });
  
  }
  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
  app.on('ready', createWindow);
  
