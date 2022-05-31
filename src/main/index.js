import { app, BrowserWindow, Menu,Notification } from 'electron'
import pkg from '../../package.json'
import source from '../../videoSource.json'

require('@electron/remote/main').initialize()

const platform = source.platform
const crackSource = source.crackSource

// set app name
app.name = pkg.productName
// to hide deprecation message
app.allowRendererProcessReuse = true

// disable electron warning
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = false

const gotTheLock = app.requestSingleInstanceLock()
const isDev = process.env.NODE_ENV === 'development'
const isDebug = process.argv.includes('--debug')
let mainWindow

// only allow single instance of application
if (!isDev) {
  if (gotTheLock) {
    app.on('second-instance', () => {
      // Someone tried to run a second instance, we should focus our window.
      if (mainWindow && mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
    })
  } else {
    app.quit()
    process.exit(0)
  }
} else {
  // process.env.ELECTRON_ENABLE_LOGGING = true

  require('electron-debug')({
    showDevTools: false,
  })
}

async function installDevTools() {
  let installExtension = require('electron-devtools-installer')
  installExtension.default(installExtension.VUEJS_DEVTOOLS).catch((err) => {
    console.log('Unable to install `vue-devtools`: \n', err)
  })
}

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    backgroundColor: '#fff',
    width: 960,
    height: 540,
    minWidth: 960,
    minHeight: 540,
    useContentSize: true,
    skipTaskbarboolean:true,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: false,
      contextIsolation: false,
      webSecurity: false,
      webviewTag: true,
    },
    show: false,
  })

  // eslint-disable-next-line
  setMenu()

  // load root file/url
  if (isDev) {
    mainWindow.loadURL('http://localhost:9080')
  } else {
    mainWindow.loadFile(`${__dirname}/index.html`)

    global.__static = require('path')
      .join(__dirname, '/static')
      .replace(/\\/g, '\\\\')
  }

  // Show when loaded
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => {
    app.exit(0);
    console.log('\nApplication exiting...')
  })
}

app.on('ready', () => {
  createWindow()

  if (isDev) {
    installDevTools()
    mainWindow.webContents.openDevTools()
  }

  if (isDebug) {
    mainWindow.webContents.openDevTools()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

const sendMenuEvent = async (data) => {
  mainWindow.webContents.send('change-view', data)
}

// let win_list = [];//存储打开的窗口
// //主进程监听创建窗口事件
// ipcMain.on('createWindow',function(event, infor) {
//   const currentWindow = BrowserWindow.getFocusedWindow();　//获取当前活动的浏览器窗口。
//   if(currentWindow) { //如果上一步中有活动窗口，则根据当前活动窗口的右下方设置下一个窗口的坐标
//     const [ currentWindowX, currentWindowY ] = currentWindow.getPosition();
//     let x = currentWindowX + 20;
//   }
//   let oldWin = null;
//   for (const item of win_list) { //判断要创建的窗口是否已经打开，如果已经打开取出窗口
//     if(item.url === infor.url){
//       oldWin = item.mwin;
//       break;
//     }
//   }
//
//   if(oldWin){ //窗口存在直接打开
//     oldWin.show();
//   }else{ //否则创建新窗口
//     Menu.setApplicationMenu(null)
//     let newwin = new BrowserWindow({
//       x,
//       titleBarStyle: 'hidden',
//       minWidth:1024,
//       minHeight:768,
//       // parent: win, //win是主窗口
//     })
//     // newwin.webContents.openDevTools();
//     if(infor.type === 1){
//       newwin.loadURL(path.join('file:',__dirname,infor.url));
//     }else{
//       newwin.loadURL(infor.url);
//     }
//     newwin.on('closed',()=>{ //窗口关闭。删除win_list存储的数据
//       for (let [index, item] of win_list.entries()) {
//         if(item.mwin == newwin){
//           win_list.splice(index, 1);
//           newwin = null;
//           break;
//         }
//
//       }
//     });
//     win_list.push({url:infor.url,mwin:newwin});
//   }
// })


function setMenu() {
  const template = [
    {
      label: '视频平台',
      submenu: [
      ],
    },
    {
      label: '破解源',
      submenu: [
      ],
    },
    {
      label: "帮助",
      submenu: [
        {
          label:"使用说明",
          click(){
            const currentWindow = BrowserWindow.getFocusedWindow();　//获取当前活动的浏览器窗口。
            // load root file/url
            if (isDev) {
              currentWindow.loadURL('http://localhost:9080')
            } else {
              currentWindow.loadFile(`${__dirname}/index.html`)

              global.__static = require('path')
                .join(__dirname, '/static')
                .replace(/\\/g, '\\\\')
            }
          }
        }
      ],
    }
  ]
  for (const key in platform) {
    const item = platform[key]
    const menuItem = {
      label: item.name,
      click() {
        const allWindows =  BrowserWindow.getAllWindows();
        for (const win of allWindows) {
          if(win !== mainWindow){
            win.close();
          }
        }
        mainWindow.loadURL(item.url).then(r => {
          console.log(r);
        }).catch(e => {
          console.log(e);
        });
      },
    }
    template[0].submenu.push(menuItem)
  }
  for (const key in crackSource) {
    const item = crackSource[key]
    const menuItem = {
      label: item.name,
      click() {
        // 参数参考Notification文档
        const currentWindow = BrowserWindow.getFocusedWindow();　//获取当前活动的浏览器窗口。
        let currentUrl = currentWindow.webContents.getURL();
        console.log(currentUrl);
        if ((currentUrl.indexOf("?jx=") !== -1) || (currentUrl.indexOf("?url=") !== -1)){
           currentUrl = currentUrl.substring(currentUrl.indexOf("=")+1)
        }
        console.log(item.url + currentUrl);
        currentWindow.loadURL(item.url + currentUrl);
        const options = {
          title: "破解源",
          body: item.name
        };
        const myNotification = new Notification(options);
        myNotification.show();
      },
    }
    template[1].submenu.push(menuItem)
  }

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    })
  }


  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

