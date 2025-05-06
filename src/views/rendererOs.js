// == CRUD Create/Update ======================================
// a constante foco obtem o elemento html (input) identificado como 'searchOS'
const foco = document.getElementById('inputSearchOS')

// Desativar os botões
btnUpdate.disabled = true
btnDelete.disabled = true

// Foco na busca do cliente
foco.focus()

//captura dos dados dos inputs do formulário (Passo 1: Fluxo)
let frmOS = document.getElementById('frmOS')
let nameClientOS = document.getElementById('inputNameClientOS')
let cpfClientOS = document.getElementById('inputCPFClientOS')
let phoneClientOS = document.getElementById('inputPhoneClientOS')
let osStatus = document.getElementById('inputosStatusOS')
let modelcellOS = document.getElementById('inputmodelcellOS')
let ImeiOS = document.getElementById('inputIMEIOS')
let servicoOS = document.getElementById('inputservicoOS')
let tecnicoOS = document.getElementById('inputTecnicoOS')
let diagnosticoOS = document.getElementById('inputDiagnosticoOS')
let valorOS = document.getElementById('inputValorOS')
let dataOS = document.getElementById('txtDataOS')

// == Inicio CRUD Create ===============================================

//Evento associado ao botão submit (uso das validações do html)
frmOS.addEventListener('submit', async (event) => {
    //evitar o comportamento padrão do submit que é enviar os dados do formulário e reiniciar o documento html
    event.preventDefault()
    // Teste importante (recebimento dos dados do formuláro - passo 1 do fluxo)
    console.log(nameClientOS.value, cpfClientOS.value, phoneClientOS.value, osStatus.value, modelcellOS.value, ImeiOS.value, servicoOS.value, tecnicoOS.value, diagnosticoOS.value, valorOS.value, dataOS.value)
    //Criar um objeto para armazenar os dados da OS antes de enviar ao main
    const os = {
        nameCOS: nameClientOS.value,         // opcional
        cpfOS: cpfClientOS.value,           // opcional
        phoneCliOS: phoneClientOS.value,    // opcional
        StatusOS: osStatus.value,
        modeloOS: modelcellOS.value,
        ImeiOS: ImeiOS.value,
        servicoOS: servicoOS.value,
        tecnicoOS: tecnicoOS.value,
        diagnosticoOS: diagnosticoOS.value,
        dataOS: dataOS.value,               // opcional, não está no schema
        valorOS: valorOS.value
    }
    
    // Enviar ao main o objeto os - (Passo 2: fluxo)
    // uso do preload.js
    api.newOS(os)
})

// == Fim CRUD Create ===============================================

// // == Inicio CRUD Read =========================================
function buscarOs() {
    //console.log("teste do botão buscar")
    // Passo 1: capturar o nome do cliente
    let nameos = document.getElementById('inputSearchOS').value
    console.log(nameos) // teste do passo 1

    //Validação de campo obrigatorio. Se o campo de busca não for preenchido enviar um alerta ao usuario. Fazer o main enviar um pedido para alertar o usuário
    if (nameos === "") {
        api.validateSearch()
        foco.focus()
    } else {
        api.searchNameos(nameos) // Passo 2: envio do nome ao main
        // recebimento dos dados do cliente
        api.renderClientos((event, dataClientos) => {
            console.log(dataClientos) // teste do passo 5
            // passo 6 renderizar os dados do cliente no formulário
            // - Criar um vetor global para manipulação dos dados
            // - criar uma constante para converter os dados recebidos (string) para o formato JASON (JSON.parse)
            // usar o laço forEach para percorre o vetor e setar os campos (caixas de texto) do formulário
            const ordemOS = JSON.parse(dataClientos)
            // atribuir ao vetor os dados do cliente
            arrayOS = ordemOS
            // extrair os dados do cliente
            arrayOS.forEach((o) => {
                id.value = o._id,
                nameClientOS.value  = o.nameClientOS, 
                cpfOS.value = o.cpfClientOS, 
                phoneOS.value  = o.phoneClientOS, 
                osStatus.value  = o.osStatus,
                modelcellOS.value = o.modelcellOS, 
                ImeiOS.value   = o.ImeiOS, 
                servicoOS.value   = o.servicoOS, 
                tecnicoOS.value  = o.tecnicoOS, 
                diagnosticoOS.value  = o.diagnosticoOS, 
                valorOS.value   = o.valorOS, 
                dataOS.value  = o.dataOS
                
                
            })
        })
    }


}
// == Fim CRUD Read=============================================
/// == Inicio CRUD Delete =========================================

function apagarOs() {
    console.log(id.value) // passo 1 (receber do form o id)
    api.deleteClient(id.value) // passo 2 (enviar o id ao main)
    
}

// == Fim CRUD Delete ============================================
//=====Reset form==================
function resetForm() {
    //Limpar os campos e resetar o formulario com as configurações pré definidas.
    location.reload()
}
// Recebimento do pedido do main para resetar o form
api.resetForm((args) => {
    resetForm()
})


//===== Fim - reset form ==================