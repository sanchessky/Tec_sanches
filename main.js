//console.log("Processo Principal")



//----------------------------------------------------------------------
//Biblioteca do electron
const { app, BrowserWindow, nativeTheme, Menu, shell } = require('electron')

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
  })

  // menu personalizado
  Menu.setApplicationMenu(Menu.buildFromTemplate(templete))

  win.loadFile('./src/views/index.html')
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
// Janela Secundaria

const childwindow = () => {
    const father = BrowserWindow.getFocusedWindow()
    if(father){
      const child = new BrowserWindow ({
        width: 640,
        height:480,
        icon:"./src/public/img/xadrez.png",
        autoHideMenuBar: true,
        resizable: false,
        parent: father,
        modal: true /* essa função obriga o usuario focar em uma aplicação */
    })
    child.loadFile('./src/views/child.html')
    }
}

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
          label: 'Clientes'
        },
        {
            label: 'Os'
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
              label: 'Cliente',
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
            label: 'Docs',
            click: () => shell.openExternal('https://github.com/sanchessky/Desenvolvimento_Desktop')
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