// Modules to control application life and create native browser window
const {app, protocol, BrowserWindow, Menu} = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // Hide main menu
  //Menu.setApplicationMenu(null);
  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:5000');
  if (os.platform() === 'darwin') {
    // Currently electron mac requires this reload
    setTimeout(function(){ mainWindow.reload(); }, 3000);
  }
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  //mainWindow.setMenuBarVisibility(false);
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', startBackEnd)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})




const os = require('os');
var backEndProcess = null;

function startBackEnd() {
  var proc = require('child_process').spawn;
  
  //  run server
  console.log("current dir is " + __dirname)
  var apiDir = path.join(__dirname, '.\\api\\win-x64');
  var apipath = path.join(__dirname, '.\\api\\win-x64\\SKS.exe')
  if (os.platform() === 'darwin') {
    apipath = path.join(__dirname, './/api//osx-x64//SKS')
    apiDir  = path.join(__dirname, './/api//osx-x64');
  }
  console.log("Starting");
 
  backEndProcess = proc(apipath,{cwd:apiDir});

  backEndProcess.stdout.on('data', (data) => {
    writeLog(`stdout: ${data}`);
    if (mainWindow == null) {
      createWindow();
    }
  });
}

//Kill process when electron exits
process.on('exit', function () {
  writeLog('exit');
  backEndProcess.kill();
});

function writeLog(msg){
  console.log(msg);
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
