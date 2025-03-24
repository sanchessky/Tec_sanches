const { contextBridge, ipcRenderer} = require('electron')
ipcRenderer.send('db-connect')
//expor (autorizar a cominicação entre processos)

contextBridge.exposeInMainWorld('api',{
    clientwindow: () => ipcRenderer.send('client-window'),
    oswindow: () => ipcRenderer.send('os-window'),
    dbStatus: (message) => ipcRenderer.on('db-status', message)
})



