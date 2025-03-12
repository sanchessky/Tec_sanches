//console.log("Processo Principal")



//----------------------------------------------------------------------
//Biblioteca do electron
const { app, BrowserWindow, nativeTheme, Menu, ipcMain } = require('electron')

const path = require('node:path')

//----------------------------------------------------------------------
//janela principal
let win
const createWindow = () => {
    nativeTheme.themeSource = 'dark'
   win = new BrowserWindow({
    width: 800,
    height: 600,
    icon:"./src/public/img/xadrez.png",
    /*minimizable: false,  remover a ação de minimizar a tela */
    resizable: false, /* remover a ação de maximizar a tela */
    /*autoHideMenuBar: true,  remover a ação de menu tela */
    /*titleBarStyle: 'hidden'  remover a a barra de titulo e menu */
    webPreferences: {
      preload: path.join(__dirname, 'preload.js') 
    }
  })

  // menu personalizado
  Menu.setApplicationMenu(Menu.buildFromTemplate(templete))

  win.loadFile('./src/views/index.html')
  ipcMain.on('client-window', ()=> {
    clientwindow()
  })
  ipcMain.on('os-window', ()=> {
    oswindow()
  })
  ipcMain.on('imei-window', ()=> {
    imeiwindow()
  })
}
//Fechamento da janela principal
//--------------------------------------------------------------------------------------
//janela Sobre
const aboutwindow = () => {
    const about = new BrowserWindow ({
        width: 360,
        height:220,
        icon:"./src/public/img/xadrez.png",
        autoHideMenuBar: true,
        resizable: false,
    })
    about.loadFile('./src/views/sobre.html')
}
//-------------------------------------------------------------------------------------
// Janela clientes
let client
function clientwindow () {
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    if(main) {
        client = new BrowserWindow({
            width: 1010,
            height: 720,
            autoHideMenuBar: true,
            resizable: false,
            parent: main,
            modal: true
        })
    }
    client.loadFile('./src/views/cliente.html')
    client.center()    
}
// Janela OS
let os
function oswindow() {
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    if(main) {
        os = new BrowserWindow({
            width: 1010,
            height: 720,
            autoHideMenuBar: true,
            resizable: false,
            parent: main,
            modal: true
        })
    }
    os.loadFile('./src/views/os.html') 
    os.center()   
}
// Janela imei
let imei
function imeiwindow() {
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    if(main) {
        imei = new BrowserWindow({
            width: 1010,
            height: 720,
            autoHideMenuBar: true,
            resizable: false,
            parent: main,
            modal: true
        })
    }
    imei.loadFile('./src/views/imei.html')   
    imei.center() 
}
// janela imei fim
//--------------------------------------------------------------------------------------
// iniciar a aplicação
app.whenReady().then(() => {
  createWindow()
  //aboutwindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

// Reduzir logs não criticos

app.commandLine.appendSwitch('log-level', '3')

// Templete do MENU
const templete =[
  {
    label:'Cadastrar',
    submenu: [
        {
          label: 'Clientes',
          click: () => clientwindow()
        },
        {
            label: 'Os',
            click: () => oswindow()
        },
        {
          label: 'Imei',
          click: () => imeiwindow()
        },
        {
          type:'separator' 
        },
        {
            label: 'Sair',
            click: () => app.quit(),
            accelerator: 'ALT+F4'
        }

    ]      
    },

    {
      label:'Relatorios',
      submenu: [
          {
              label: 'Cliente'
          },
          {
              type:'separator'
          },
          {
              label: 'OS Aberta',
          },
          {
              label: 'OS Fechada',
          }
      ]      
  },


 /*   {
        label:'Simulação',
        submenu: [
            {
              label: 'Janela Secundaria',
              click: () => childwindow()
            },
            {
                label: 'Sair',
                click: () => app.quit(),
                accelerator: 'ALT+F4'
            }
        ]      
    }, */
    {
        label: 'Exibir',
        submenu: [
            {
                label:'Recarregar',
                role:'reload'
            },
            {
                label:'Ferramentas do desenvolvedor',
                role:'toggleDevTools' /* Exbir a tela de desenvolvimento */
            },
            {
                type:'separator' /* crua uma linha para separar grupos do submenu */
            },
            {
                label: 'Aplicar zoom',
                role: 'zoomIn'
            },
            {
                label: 'Reduzir',
                role: 'zoomOut'
            },
            {
                label: 'Restaurar o zoom padrão',
                role: 'ResetZoom'
            }
        ]      
    },
    {
        label: 'Ajuda',
        submenu: [
          {
            label: 'Documentação',
            click: () => shell.openExternal('https://github.com/sanchessky/Tec_sanches')
          },
          {
            type:'separator'
          },
          {
            label: 'Imei',
            click: () => aboutwindow ()
          } 
        ]
    }
]