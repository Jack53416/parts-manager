import { app, BrowserWindow, dialog, ipcMain, screen } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { readExcel } from './excel-parser/read-report';
import { saveParts } from './excel-parser/save-report';

export interface PartToSave {
  machine: string;
  name: string;
  articleNo: string;
  tool: string;
  totalPartsProduced: string;
  shortShot: string;
  startupParts: string;
  burns: string;
  contaminated: string;
  oilContaminations: string;
  smudges: string;
  deformations: string;
  damagedInTransport: string;
  mechanicalDamages: string;
  scratches: string;
  flashes: string;
  silvering: string;
  removedByRobot: string;
  airBubbles: string;
  others: string;
}

let win: BrowserWindow = null;
const args = process.argv.slice(1);
const serve = args.some((val) => val === '--serve');

function getIndexURL(): URL {
  let pathIndex = './index.html';

  if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
    // Path when running electron in local folder
    pathIndex = '../dist/index.html';
  }

  return new URL(path.join('file:', __dirname, pathIndex));
}

function createWindow(): BrowserWindow {
  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve,
      contextIsolation: false, // false if you want to run e2e test with Spectron
    },
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(getIndexURL().href);
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  win.webContents.on('did-fail-load', () => {
    console.log('did-fail-load');
    win.loadURL(getIndexURL().href);
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using
  // transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.commandLine.appendSwitch('--no-sandbox');
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

  handleIPCEvents();
} catch (e) {
  // Catch Error
  throw e;
}

function handleIPCEvents() {
  ipcMain.handle('openExcel', async (_, dateNumber: number) => {
    const date = new Date(dateNumber);
    const result = await dialog.showOpenDialog(win, {
      title: 'Select a file',
      filters: [
        {
          name: 'Spreadsheets',
          extensions: ['xlsx', 'xls', 'xlsb'],
        },
      ],
    });
    /* result.filePaths is an array of selected files */
    if (result.filePaths.length === 0) {
      throw new Error('No file was selected!');
    }

    return await readExcel(result.filePaths[0], date);
  });

  ipcMain.handle('saveParts', async (_, parts: PartToSave[], reportDate: Date) => {
    await saveParts(parts, reportDate);
    }
  );
}
