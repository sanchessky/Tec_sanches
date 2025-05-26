// Iniciar a janela OS alterando as propriedades de alguns elementos
document.addEventListener('DOMContentLoaded', () => {
    // Desativar os botões
    btnUpdate.disabled = true
    btnDelete.disabled = true    
})


// == Variáveis gerais - OS ===================================

let arrayOS = []

let frmOS = document.getElementById('frmOS')
let statusOS = document.getElementById('inputStatus')
let celular = document.getElementById('inputcell')
let serial = document.getElementById('inputImei')
let problem = document.getElementById('inputProblem')
let specialist = document.getElementById('inputSpecialist')
let diagnosis = document.getElementById('inputDiagnosis')
let parts = document.getElementById('inputParts')
let total = document.getElementById('inputTotal')
let idOS = document.getElementById('inputOS')
let dateOS = document.getElementById('inputData')

// ============================================================
// == CRUD Create/Update ======================================

frmOS.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (idClient.value === "") {
        api.validateClient()
    } else {
        console.log(idOS.value, idClient.value, statusOS.value, celular.value, serial.value, problem.value, specialist.value, diagnosis.value, parts.value, total.value)
        if (idOS.value === "") {
            //Gerar OS
            //Criar um objeto para armazenar os dados da OS antes de enviar ao main
            const os = {
                idClient_OS: idClient.value,
                stat_OS: statusOS.value,
                smart_OS: celular.value,
                serial_OS: serial.value,
                problem_OS: problem.value,
                specialist_OS: specialist.value,
                diagnosis_OS: diagnosis.value,
                parts_OS: parts.value,
                total_OS: total.value
            }
            // Enviar ao main o objeto os - (Passo 2: fluxo)
            // uso do preload.js
            api.newOS(os)
        } else {
            //Editar OS
            //Gerar OS
            //Criar um objeto para armazenar os dados da OS antes de enviar ao main
            const os = {
                id_OS: idOS.value,
                idClient_OS: idClient.value,
                stat_OS: statusOS.value,
                smart_OS: celular.value,
                serial_OS: serial.value,
                problem_OS: problem.value,
                specialist_OS: specialist.value,
                diagnosis_OS: diagnosis.value,
                parts_OS: parts.value,
                total_OS: total.value
            }
            // Enviar ao main o objeto os - (Passo 2: fluxo)
            // uso do preload.js
            api.updateOS(os)
        }
    }
})

// == Fim CRUD Create/Update ==================================
// ============================================================

// == Busca avançada =========================================

const input = document.getElementById('inputSearchClient')
const suggestionList = document.getElementById('viewListSuggestion')
let idClient = document.getElementById('inputIdClient')
let nameClient = document.getElementById('inputNameClient')
let phoneClient = document.getElementById('inputPhoneClient')

let arrayClients = []

input.addEventListener('input', () => {
    const search = input.value.toLowerCase()
    suggestionList.innerHTML = ""

    api.searchClients()

    api.listClients((event, clients) => {
        const listaClientes = JSON.parse(clients)
        arrayClients = listaClientes

        const results = arrayClients.filter(c =>
            c.nomeCliente && c.nomeCliente.toLowerCase().includes(search)
        ).slice(0, 10)

        suggestionList.innerHTML = ""

        results.forEach(c => {
            const item = document.createElement('li')
            item.classList.add('list-group-item', 'list-group-item-action')
            item.textContent = c.nomeCliente

            item.addEventListener('click', () => {
                idClient.value = c._id
                nameClient.value = c.nomeCliente
                phoneClient.value = c.foneCliente
                input.value = ""
                suggestionList.innerHTML = ""
            })

            suggestionList.appendChild(item)
        })
    })
})

api.setSearch(() => {
    input.focus()
})

document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !suggestionList.contains(e.target)) {
        suggestionList.innerHTML = ""
    }
})

// == Fim - busca avançada ===================================
// ============================================================

// == Buscar OS - CRUD Read ===================================

function findOS() {
    api.searchOS()
}

api.renderOS((event, dataOS) => {
    const os = JSON.parse(dataOS)

    idOS.value = os._id

    const data = new Date(os.dataEntrada)
    const formatada = data.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    })

    dateOS.value = formatada
    idClient.value = os.idCliente
    statusOS.value = os.statusOS
    celular.value = os.celular       
    serial.value = os.serie
    problem.value = os.problema
    specialist.value = os.tecnico
    diagnosis.value = os.diagnostico
    parts.value = os.pecas
    total.value = os.valor

        // desativar o botão adicionar
        btnCreate.disabled = true
        // ativar os botões editar e excluir
        btnUpdate.disabled = false
        btnDelete.disabled = false    


    api.searchClients() // pedir a lista de clientes

    api.listClients((event, clients) => {
        const listaClientes = JSON.parse(clients)
        // procurar o cliente com o idCliente da OS
        const clienteEncontrado = listaClientes.find(c => c._id === os.idCliente)
        if (clienteEncontrado) {
            nameClient.value = clienteEncontrado.nomeCliente
            phoneClient.value = clienteEncontrado.foneCliente
        } else {
            nameClient.value = ''
            phoneClient.value = ''
        }
    })

})


// == Fim - Buscar OS - CRUD Read =============================


// == Reset form ==============================================

function resetForm() {
    location.reload()
}

api.resetForm(() => {
    resetForm()
})

// == Fim - reset form ========================================

// == Inicio Imprimir OS ================================================

function generate(){
    api.printOS()

}


// == Fim Imprimir OS ================================================