/**
 * Arquivo de pré carregamento e reforço de segurança na comunicação entre processos (IPC)
 */
//importação dos recursos electron
// segurança e cominicação
const { contextBridge, ipcRenderer } = require('electron')

// Eviar ao main um pedido para conexão com o banco de dados e trocar o icone no processo de renderização
ipcRenderer.send('db-connect')

//expor (autorizar a cominicação entre processos)
contextBridge.exposeInMainWorld('api',
    {
        clientWindow: () => ipcRenderer.send('client-window'),
        osWindow: () => ipcRenderer.send('os-window'),
        dbStatus: (message) => ipcRenderer.on('db-status', message),
        newClient: (client) => ipcRenderer.send('new-client', client),
        resetForm: (args) => ipcRenderer.on('reset-form',args),
        
    })