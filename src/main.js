
const { app, BrowserWindow } = require('electron');
const express = require('express');
//const installExtension = require('electron-devtools-installer');
let mainWindow;
var isminimized = false;

class ContextNavigator {
    constructor(contextWindow) {
        this.contextWindow = contextWindow;
        this.contextIndex = [0, 0];
    }
    moveContextIndex(deltaX, deltaY) {
        const newRowIndex = this.contextIndex[0] + deltaY;
        const newColIndex = this.contextIndex[1] + deltaX;

        // Check if the new indices are within bounds
        if (this.isValidIndex(newRowIndex, newColIndex)) {
            this.contextIndex[0] = newRowIndex;
            this.contextIndex[1] = newColIndex;
            this.updateMainWindow(this.getCurrentUrl());
        }
    }

    isValidIndex(row, col) {
        return (
            row >= 0 &&
            row < this.contextWindow.length &&
            col >= 0 &&
            col < this.contextWindow[row].length
        );
    }

    updateMainWindow(url) {
      mainWindow.loadURL(url);

    }
    addUrlPlus(url) {
        // Add the new URL to the current context or create a new context
        this.contextWindow[this.contextIndex[0]].push({ url });
        this.next();
    }
    addUrl(url) {
        // Add the new URL to the current context or create a new context
        this.contextWindow[this.contextIndex[0]].push({ url });
        this.updateMainWindow(url);
    }

    removeUrl() {
        // Remove the URL from the current context
        this.contextWindow[this.contextIndex[0]].splice(this.contextIndex[1], 1);

        // If the context becomes empty, remove the context
        if (this.contextWindow[this.contextIndex[0]].length === 0) {
            this.contextWindow.splice(this.contextIndex[0], 1);
            this.contextIndex[0] = Math.max(0, this.contextIndex[0] - 1);
            this.contextIndex[1] = 0;
        }

        // Update the main window with the new URL
        const newUrl = this.getCurrentUrl();
        this.updateMainWindow(newUrl);
    }

    updateContextWindow(contextWindow){
        this.contextWindow = contextWindow;
        this.contextIndex = [0, 0];
        this.updateMainWindow(this.getCurrentUrl());
    }


    next() {
      mainWindow.webContents.goForward();
      //  if (this.canMoveRight()) {
      //      this.contextIndex[1]++;
      //      this.updateMainWindow(this.getCurrentUrl());
      //  }
    }

    prev() {
      mainWindow.webContents.goBack();
    //    if (this.canMoveLeft()) {
    //        this.contextIndex[1]--;
    //        this.updateMainWindow(this.getCurrentUrl());
    //    }
    }

    up() {
        if (this.canMoveUp()) {
            this.contextIndex[0]++;
            this.updateMainWindow(this.getCurrentUrl());
        }
    }

    down() {
        if (this.canMoveDown()) {
            this.contextIndex[0]--;
            this.updateMainWindow(this.getCurrentUrl());
        }
    }

    getCurrentUrl() {
        return this.contextWindow[this.contextIndex[0]][this.contextIndex[1]].url;
    }

    canMoveRight() {
        return this.contextIndex[1] < this.contextWindow[this.contextIndex[0]].length - 1;
    }

    canMoveLeft() {
        return this.contextIndex[1] > 0;
    }

    canMoveUp() {
        return this.contextIndex[0] < this.contextWindow.length - 1;
    }

    canMoveDown() {
        return this.contextIndex[0] > 0;
    }
}


let contextWindow = [
  [{ url: 'http://google.com' }],
];

let contextNavigator = new ContextNavigator(contextWindow);
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(contextWindow[0][0].url);
  
  mainWindow.webContents.on('will-navigate', (event, url, isMainFrame) => {
    // Check if it's a link click (isMainFrame is true)
    if (event) {

    }else{


    }
    console.log(event, url, isMainFrame);
    // Prevent the default navigation behavior
   // event.preventDefault();
  });
}

function minimizeMainWindow() {
  if (!isminimized) {
    isminimized = true;
    mainWindow.minimize();
  }
}

function restoreMainWindow() {
  if (isminimized) {
    isminimized = false;
    mainWindow.restore();
  }
}



function moveFrameUp() {
  mainWindow.webContents.executeJavaScript('window.scrollBy(0, -100);');
}

function moveFrameDown() {
  mainWindow.webContents.executeJavaScript('window.scrollBy(0, 100);');
}


function startExpressServer() {
  const appServer = express();
  const port = 3000;

  appServer.use(express.json());

  appServer.get('/move-up', (req, res) => {
    moveFrameUp();
    res.json({ status: 'success' });
  });

  appServer.get('/move-down', (req, res) => {
    moveFrameDown();
    res.json({ status: 'success' });
  });

  appServer.get('/minimize', (req, res) => {
    minimizeMainWindow();
    res.json({ status: 'success' });
  });

  appServer.get('/restore', (req, res) => {
    restoreMainWindow();
    res.json({ status: 'success' });
  });

  appServer.get('/context-up', (req, res) => {
    contextNavigator.up()
    res.json({ status: 'success' });
  });

  appServer.get('/context-down', (req, res) => {
    contextNavigator.down()
    res.json({ status: 'success' });
  });

  appServer.get('/context-next', (req, res) => {
    
    contextNavigator.next()
    res.json({ status: 'success' });
  });

  appServer.get('/context-prev', (req, res) => {
    contextNavigator.prev()
    res.json({ status: 'success' });
  });

  appServer.post('/context_window', (req, res) => {
    let contextWindow = req.body.contextWindow;
    contextNavigator.updateContextWindow(contextWindow);
    res.json({ status: 'success' });
  });
  appServer.get('/dump', (req, res) => {
    res.json({ ...{ status: 'success', 'contextlink': contextNavigator.contextIndex }, ...contextNavigator.contextWindow });
  });


  appServer.post('/update-window', (req, res) => {
    const receivedUrl = req.body.url;
    updateMainWindow(receivedUrl);
    res.json({ status: 'success' });
  });

  appServer.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

app.whenReady().then(() => {
  createWindow();
 
  // Install DevTools extensions
//const installDevTools = async () => {
//    try {
//      const name = await installExtension.default(installExtension.VUEJS_DEVTOOLS);
//      console.log(`Added Extension: ${name}`);
//    } catch (err) {
//      console.log('An error occurred: ', err);
//    }
//  };
//
//  installDevTools();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  startExpressServer();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

