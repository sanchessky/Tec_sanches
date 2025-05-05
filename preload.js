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
        newOS: (os) => ipcRenderer.send('new-OS', os),
        resetForm: (args) => ipcRenderer.on('reset-form', args),
        searchName: (name) => ipcRenderer.send('search-name',name),
        renderClient:(dataClient)=> ipcRenderer.on('render-client',dataClient),
        validateSearch: () => ipcRenderer.send('validate-search'),
        setClient: (args) => ipcRenderer.on('set-client',args ),
        deleteClient: (id) => ipcRenderer.send('delete-client', id),
        updateClient: (client)=> ipcRenderer.send('update-client',client),
        searchNameos: (nameos) => ipcRenderer.send('search-nameos',nameos),
        renderClientos:(dataClientos)=> ipcRenderer.on('render-clientos',dataClientos)

    })

