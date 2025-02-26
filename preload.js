const { contextBridge, ipcRenderer} = require('electron')
//expor (autorizar a cominicação entre processos)
contextBridge.exposeInMainWorld('api',{
    clientwindow: () => ipcRenderer.send('client-window'),
    oswindow: () => ipcRenderer.send('os-window'),
    imeiwindow: () => ipcRenderer.send('imei-window'),
})