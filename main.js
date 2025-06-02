console.log("Processo principal")

const { app, BrowserWindow, nativeTheme, Menu, ipcMain, dialog, shell } = require('electron')

const path = require('node:path')

const { conectar, desconectar } = require('./database.js')

const mongoose = require('mongoose')

const clientModel = require('./src/models/Clientes.js')

const osModel = require('./src/models/OS.js')

const { jspdf, default: jsPDF } = require('jspdf')

const fs = require('fs')

const prompt = require('electron-prompt')

let win
const createWindow = () => {
    nativeTheme.themeSource = 'light'
    win = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')
}

function aboutWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    let about
    if (main) {
        about = new BrowserWindow({
            width: 360,
            height: 220,
            autoHideMenuBar: true,
            resizable: false,
            minimizable: false,
            parent: main,
            modal: true
        })
    }
    about.loadFile('./src/views/sobre.html')
}

let client
function clientWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        client = new BrowserWindow({
            width: 1010,
            height: 680,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    client.loadFile('./src/views/cliente.html')
    client.center()
}

let os
function osWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        os = new BrowserWindow({
            width: 1010,
            height: 720,
            resizable: false,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    os.loadFile('./src/views/os.html')
    os.center()
}

app.whenReady().then(() => {
    createWindow()

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

app.commandLine.appendSwitch('log-level', '3')

ipcMain.on('db-connect', async (event) => {
    let conectado = await conectar()
    if (conectado) {
        setTimeout(() => {
            event.reply('db-status', "conectado")
        }, 500)
    }
})

app.on('before-quit', () => {
    desconectar()
})

const template = [
    {
        label: 'Cadastro',
        submenu: [
            {
                label: 'Clientes',
                click: () => clientWindow()
            },
            {
                label: 'OS',
                click: () => osWindow()
            },
            {
                type: 'separator'
            },
            {
                label: 'Sair',
                click: () => app.quit(),
                accelerator: 'Alt+F4'
            }
        ]
    },
    {
        label: 'Relatórios',
        submenu: [
            {
                label: 'Clientes',
                click: () => relatorioClientes()
            },
            {
                label: 'OS abertas',
                click: () => relatorioOsAberta()
            },
            {
                label: 'OS concluídas',
                click: () => relatorioOsConcluida()
            }
        ]
    },
    {
        label: 'Ferramentas',
        submenu: [
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
                role: 'resetZoom'
            },
            {
                type: 'separator'
            },
            {
                label: 'Recarregar',
                role: 'reload'
            },
            {
                label: 'Ferramentas do desenvolvedor',
                role: 'toggleDevTools'
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Sobre',
                click: () => aboutWindow()
            }
        ]
    }
]

ipcMain.on('client-window', () => {
    clientWindow()
})

ipcMain.on('os-window', () => {
    osWindow()
})


ipcMain.on('new-client', async (event, client) => {
    try {
        const newClient = new clientModel({
            nomeCliente: client.nameCli,
            cpfCliente: client.cpfCli,
            emailCliente: client.emailCli,
            foneCliente: client.phoneCli,
            cepCliente: client.cepCli,
            logradouroCliente: client.addressCli,
            numeroCliente: client.numberCli,
            complementoCliente: client.complementCli,
            bairroCliente: client.neighborhoodCli,
            cidadeCliente: client.cityCli,
            ufCliente: client.ufCli
        })
        await newClient.save()
        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Cliente adicionado com sucesso",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }
        })
    } catch (error) {
        if (error.code === 11000) {
            dialog.showMessageBox({
                type: 'error',
                title: "Atenção!",
                message: "CPF já está cadastrado\nVerifique se digitou corretamente",
                buttons: ['OK']
            }).then((result) => {
                if (result.response === 0) {
                }
            })
        }
        console.log(error)
    }
})



async function relatorioClientes() {
    try {
        const clientes = await clientModel.find().sort({ nomeCliente: 1 })

        const doc = new jsPDF('p', 'mm', 'a4')
        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.png')
        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
        doc.addImage(imageBase64, 'PNG', 5, 8)
        doc.setFontSize(18)
        doc.text("Relatório de clientes", 14, 45)
        const dataAtual = new Date().toLocaleDateString('pt-BR')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 165, 10)
        let y = 60
        doc.text("Nome", 14, y)
        doc.text("Telefone", 80, y)
        doc.text("E-mail", 130, y)
        y += 5
        doc.setLineWidth(0.5)
        doc.line(10, y, 200, y)

        y += 10
        clientes.forEach((c) => {
            if (y > 280) {
                doc.addPage()
                y = 20
                doc.text("Nome", 14, y)
                doc.text("Telefone", 80, y)
                doc.text("E-mail", 130, y)
                y += 5
                doc.setLineWidth(0.5)
                doc.line(10, y, 200, y)
                y += 10
            }
            doc.text(c.nomeCliente, 14, y),
                doc.text(c.foneCliente, 80, y),
                doc.text(c.emailCliente || "N/A", 130, y)
            y += 10
        })

        const paginas = doc.internal.getNumberOfPages()
        for (let i = 1; i <= paginas; i++) {
            doc.setPage(i)
            doc.setFontSize(10)
            doc.text(`Página ${i} de ${paginas}`, 105, 290, { align: 'center' })
        }

        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'clientes.pdf')
        doc.save(filePath)
        shell.openPath(filePath)
    } catch (error) {
        console.log(error)
    }
}


ipcMain.on('validate-search', () => {
    dialog.showMessageBox({
        type: 'warning',
        title: "Atenção!",
        message: "Preencha o campo de busca",
        buttons: ['OK']
    })
})

ipcMain.on('search-name', async (event, name) => {

    try {
        const dataClient = await clientModel.find({
            $or: [
                { nomeCliente: new RegExp(name, 'i') },
                { cpfCliente: new RegExp(name, 'i') }
            ]
        })


        if (dataClient.length === 0) {
            dialog.showMessageBox({
                type: 'warning',
                title: "Aviso",
                message: "Cliente não cadastrado.\nDeseja cadastrar este cliente?",
                defaultId: 0,
                buttons: ['Sim', 'Não']
            }).then((result) => {
                if (result.response === 0) {
                    event.reply('set-client')
                } else {
                    event.reply('reset-form')
                }
            })

        }

        event.reply('render-client', JSON.stringify(dataClient))

    } catch (error) {
        console.log(error)
    }
})

ipcMain.on('delete-client', async (event, id) => {
    try {
        const { response } = await dialog.showMessageBox(client, {
            type: 'warning',
            title: "Atenção!",
            message: "Deseja excluir este cliente?\nEsta ação não poderá ser desfeita.",
            buttons: ['Cancelar', 'Excluir']
        })
        if (response === 1) {

            const delClient = await clientModel.findByIdAndDelete(id)
            event.reply('reset-form')
        }
    } catch (error) {
        console.log(error)
    }
})

ipcMain.on('update-client', async (event, client) => {
    try {
        const updateClient = await clientModel.findByIdAndUpdate(
            client.idCli,
            {
                nomeCliente: client.nameCli,
                cpfCliente: client.cpfCli,
                emailCliente: client.emailCli,
                foneCliente: client.phoneCli,
                cepCliente: client.cepCli,
                logradouroCliente: client.addressCli,
                numeroCliente: client.numberCli,
                complementoCliente: client.complementCli,
                bairroCliente: client.neighborhoodCli,
                cidadeCliente: client.cityCli,
                ufCliente: client.ufCli
            },
            {
                new: true
            }
        )
        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Dados do cliente alterados com sucesso",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }
        })
    } catch (error) {
        console.log(error)
    }
})

ipcMain.on('search-clients', async (event) => {
    try {
        const clients = await clientModel.find().sort({ nomeCliente: 1 })

        event.reply('list-clients', JSON.stringify(clients))
    } catch (error) {
        console.log(error)
    }
})

ipcMain.on('validate-client', (event) => {
    dialog.showMessageBox({
        type: 'warning',
        title: "Aviso!",
        message: "É obrigatório vincular o cliente na Ordem de Serviço",
        buttons: ['OK']
    }).then((result) => {
        if (result.response === 0) {
            event.reply('set-search')
        }
    })
})

ipcMain.on('new-os', async (event, os) => {
    console.log(os)
    try {
        const newOS = new osModel({
            idCliente: os.idClient_OS,
            statusOS: os.stat_OS,
            celular: os.smart_OS,
            serie: os.serial_OS,
            problema: os.problem_OS,
            tecnico: os.specialist_OS,
            diagnostico: os.diagnosis_OS,
            pecas: os.parts_OS,
            valor: os.total_OS
        })
        await newOS.save()
        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "OS gerada com sucesso",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }
        })
    } catch (error) {
        console.log(error)
    }
})



ipcMain.on('delete-os', async (event, idOS) => {
    try {
        const { response } = await dialog.showMessageBox(osScreen, {
            type: 'warning',
            title: "Atenção!",
            message: "Deseja excluir esta ordem de serviço?\nEsta ação não poderá ser desfeita.",
            buttons: ['Cancelar', 'Excluir']
        })
        if (response === 1) {
            const delOS = await osModel.findByIdAndDelete(idOS)
            event.reply('reset-form')
        }
    } catch (error) {
        console.log(error)
    }
})



ipcMain.on('update-os', async (event, os) => {
    try {
        const updateOS = await osModel.findByIdAndUpdate(
            os.id_OS,
            {
                idCliente: os.idClient_OS,
                statusOS: os.stat_OS,
                celular: os.smart_OS,
                serie: os.serial_OS,
                problema: os.problem_OS,
                tecnico: os.specialist_OS,
                diagnostico: os.diagnosis_OS,
                pecas: os.parts_OS,
                valor: os.total_OS
            },
            {
                new: true
            }
        )
        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Dados da OS alterados com sucesso",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }
        })
    } catch (error) {
        console.log(error)
    }
})



ipcMain.on('search-os', async (event) => {
    prompt({
        title: 'Buscar OS',
        label: 'Digite o número da OS:',
        inputAttrs: {
            type: 'text'
        },
        type: 'input',
        width: 400,
        height: 200
    }).then(async (result) => {
        if (result !== null) {
            if (mongoose.Types.ObjectId.isValid(result)) {
                try {
                    const dataOS = await osModel.findById(result)
                    if (dataOS && dataOS !== null) {
                        console.log(dataOS)
                        event.reply('render-os', JSON.stringify(dataOS))
                    } else {
                        dialog.showMessageBox({
                            type: 'warning',
                            title: "Aviso!",
                            message: "OS não encontrada",
                            buttons: ['OK']
                        })
                    }
                } catch (error) {
                    console.log(error)
                }
            } else {
                dialog.showMessageBox({
                    type: 'error',
                    title: "Atenção!",
                    message: "Formato do número da OS inválido.\nVerifique e tente novamente.",
                    buttons: ['OK']
                })
            }
        }
    })
})



async function relatorioOsAberta() {
    try {
        const osaberta = await osModel.find({ statusOS: 'Aberta' }).sort({ nomeCliente: 1 })
        const clientes = await clientModel.find({})

        const doc = new jsPDF('l', 'mm', 'a4')

        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.png')
        const imageBase64 = fs.readFileSync(imagePath, 'base64')
        doc.addImage(imageBase64, 'PNG', 5, 8)

        doc.setFontSize(18)
        doc.text("Relatório de OS Abertas", 100, 30)
        doc.setFontSize(12)
        doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 250, 10)

        let y = 60
        doc.text("Cliente", 14, y)
        doc.text("Telefone", 75, y)
        doc.text("Data", 110, y)
        doc.text("Técnico", 140, y)
        doc.text("Diagnóstico", 165, y)
        doc.text("Peça", 220, y)
        y += 5
        doc.setLineWidth(0.5)
        doc.line(10, y, 280, y)

        y += 5

        osaberta.forEach(os => {
            if (y > 280) {
                doc.addPage()
                y = 20
                doc.text("Cliente", 14, y)
                doc.text("Telefone", 75, y)

                doc.text("Data", 110, y)
                doc.text("Técnico", 140, y)
                doc.text("Diagnóstico", 165, y)
                doc.text("Peça", 220, y)
                y += 5
            }

            const cliente = clientes.find(c => c._id.equals(os.idCliente))
            const nomeCliente = cliente ? cliente.nomeCliente : ''
            const telefone = clientes.find(c => c._id.equals(os.idCliente))
            const foneCliente = telefone ? telefone.foneCliente : ''


            doc.text(nomeCliente, 14, y)
            doc.text(foneCliente, 75, y)
            doc.text(os.dataEntrada ? new Date(os.dataEntrada).toLocaleDateString('pt-BR') : 'N/A', 110, y)
            doc.text(os.tecnico, 140, y)
            doc.text(os.diagnostico, 165, y)
            doc.text(os.pecas, 220, y)

            y += 5
        })

        const paginas = doc.internal.getNumberOfPages()
        for (let i = 1; i <= paginas; i++) {
            doc.setPage(i)
            doc.setFontSize(10)
            doc.text(`Página ${i} de ${paginas}`, 105, 290, { align: 'center' })
        }

        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'Osaberta.pdf')
        doc.save(filePath)
        shell.openPath(filePath)

    } catch (error) {
        console.error("Erro ao gerar relatório:", error)
    }
}


async function relatorioOsConcluida() {
    try {
        const osconcluida = await osModel.find({ statusOS: 'Finalizada' }).sort({ nomeCliente: 1 })
        const clientes = await clientModel.find({})

        const doc = new jsPDF('l', 'mm', 'a4')

        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.png')
        const imageBase64 = fs.readFileSync(imagePath, 'base64')
        doc.addImage(imageBase64, 'PNG', 5, 8)

        doc.setFontSize(18)
        doc.text("Relatório de Os Concluída", 100, 30)
        doc.setFontSize(12)
        doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 250, 10)

        let y = 60
        doc.text("Cliente", 14, y)
        doc.text("Telefone", 75, y)
        doc.text("Data", 110, y)
        doc.text("Técnico", 140, y)
        doc.text("Diagnóstico", 165, y)
        doc.text("Peça", 220, y)
        y += 5
        doc.setLineWidth(0.5)
        doc.line(10, y, 280, y)

        y += 5

        osconcluida.forEach(os => {
            if (y > 280) {
                doc.addPage()
                y = 20
                doc.text("Cliente", 14, y)
                doc.text("Telefone", 75, y)

                doc.text("Data", 110, y)
                doc.text("Técnico", 140, y)
                doc.text("Diagnóstico", 165, y)
                doc.text("Peça", 220, y)
                y += 5
            }

            const cliente = clientes.find(c => c._id.equals(os.idCliente))
            const nomeCliente = cliente ? cliente.nomeCliente : ''
            const telefone = clientes.find(c => c._id.equals(os.idCliente))
            const foneCliente = telefone ? telefone.foneCliente : ''


            doc.text(nomeCliente, 14, y)
            doc.text(foneCliente, 75, y)
            doc.text(os.dataEntrada ? new Date(os.dataEntrada).toLocaleDateString('pt-BR') : 'N/A', 110, y)
            doc.text(os.tecnico, 140, y)
            doc.text(os.diagnostico, 165, y)
            doc.text(os.pecas, 220, y)

            y += 5
        })

        const paginas = doc.internal.getNumberOfPages()
        for (let i = 1; i <= paginas; i++) {
            doc.setPage(i)
            doc.setFontSize(10)
            doc.text(`Página ${i} de ${paginas}`, 105, 290, { align: 'center' })
        }

        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'Osaberta.pdf')
        doc.save(filePath)
        shell.openPath(filePath)

    } catch (error) {
        console.error("Erro ao gerar relatório:", error)
    }
}
ipcMain.on('show-error-box', (event, message) => {
    dialog.showMessageBox({
        type: 'error',
        title: 'Erro',
        message: message,
        buttons: ['OK']
    });
});


ipcMain.on('print-os', async (event) => {
    prompt({
        title: 'Imprimir OS',
        label: 'Digite o número da OS:',
        inputAttrs: {
            type: 'text'
        },
        type: 'input',
        width: 400,
        height: 200
    }).then(async (result) => {
        if (result !== null) {
            if (mongoose.Types.ObjectId.isValid(result)) {
                try {
                    const dataOS = await osModel.findById(result)
                    if (dataOS && dataOS !== null) {
                        console.log(dataOS)
                        const dataClient = await clientModel.find({

                            _id: dataOS.idCliente

                        })
                        console.log(dataClient)
                        const doc = new jsPDF('p', 'mm', 'a4')
                        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.png')
                        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
                        doc.addImage(imageBase64, 'PNG', 80, 8)
                        doc.setFontSize(12)
                        const dataAtual = new Date().toLocaleDateString('pt-BR')
                        doc.text(`Data: ${dataAtual}`, 165, 10)
                        doc.setFontSize(18)
                        doc.text("Ordem de Serviço:", 25, 45)
                        doc.text(String(dataOS.id), 83, 45)
                        doc.setFontSize(12)

                        const imageMarc = path.join(__dirname, 'src', 'public', 'img', 'marcartela.png')
                        const imageBase1 = fs.readFileSync(imageMarc, { encoding: 'base64' })
                        doc.addImage(imageBase1, 'PNG', 14, 85)


                        dataClient.forEach((c) => {
                            doc.text("Cliente:", 14, 65),
                                doc.text(c.nomeCliente, 29, 65),
                                doc.text("Telefone:", 62, 65),
                                doc.text(c.foneCliente, 81, 65),
                                doc.text("E-mail:", 113, 65),
                                doc.text(c.emailCliente || "N/A", 127, 65),
                                doc.text("Celular:", 14, 80),
                                doc.text("Problema:", 62, 80),
                                doc.text("Assinatura:___________________ ", 30, 230),
                                doc.text("CPF:", 120, 230),
                                doc.text(c.cpfCliente, 130, 230)

                        })


                        doc.text(String(dataOS.celular), 29, 80)

                        doc.text(String(dataOS.problema), 81, 80)
                        doc.setFontSize(10)
                        const termo = `


                        Termo de Serviço e Garantia – Assistência Técnica de Celulares

Ao assinar a Ordem de Serviço, o cliente autoriza o reparo e concorda com os termos abaixo:

Diagnóstico: Gratuito apenas se o serviço for aprovado. Caso contrário, pode haver cobrança.
(Art. 421 do Código Civil)
Peças Substituídas: Podem ser descartadas ou devolvidas, se solicitado.
(Art. 740 do Código Civil)
Garantia: 90 dias para serviços e peças, cobrindo apenas o item reparado. Perde validade com mau uso, violação, queda ou oxidação.
(Art. 26, I do CDC)
Perda de Dados: A assistência não se responsabiliza. Recomenda-se backup antes do serviço.
(Art. 6º, III do CDC)
Retirada do Aparelho: Deve ocorrer em até 90 dias após o conserto. Após isso, podem ser cobradas taxas ou ocorrer descarte.
(Art. 1.275, III do Código Civil)
Peças Utilizadas: Compatíveis e de procedência conhecida. Peças originais podem ter custos e prazos diferentes.
(Art. 6º, I do CDC)
Dados Pessoais: Protegidos pela LGPD e usados apenas para fins técnicos e administrativos.
(Lei nº 13.709/2018 – LGPD)`

                        doc.text(termo, 14, 130, { maxWidth: 180 })

                        const tempDir = app.getPath('temp')
                        const filePath = path.join(tempDir, 'os.pdf')
                        doc.save(filePath)
                        shell.openPath(filePath)

                    } else {
                        dialog.showMessageBox({
                            type: 'warning',
                            title: "Aviso!",
                            message: "OS não encontrada",
                            buttons: ['OK']
                        })
                    }

                } catch (error) {
                    console.log(error)
                }
            } else {
                dialog.showMessageBox({
                    type: 'error',
                    title: "Atenção!",
                    message: "Formato do número da OS inválido.\nVerifique e tente novamente.",
                    buttons: ['OK']
                })
            }
        }
    })
})


