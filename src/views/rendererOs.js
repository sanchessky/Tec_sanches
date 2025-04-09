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



//Evento associado ao botão submit (uso das validações do html)
frmOS.addEventListener('submit', async (event) => {
    //evitar o comportamento padrão do submit que é enviar os dados do formulário e reiniciar o documento html
    event.preventDefault()
    // Teste importante (recebimento dos dados do formuláro - passo 1 do fluxo)
    console.log(nameClientOS.value, cpfClientOS.value, phoneClientOS.value, osStatus.value, modelcellOS.value, ImeiOS.value, servicoOS.value, tecnicoOS.value, diagnosticoOS.value, valorOS.value, dataOS.value)
    //Criar um objeto para armazenar os dados da OS antes de enviar ao main
    const os = {
        //nameOS: nameClientOS.value,         // opcional
       // cpfOS: cpfClientOS.value,           // opcional
        //phoneCliOS: phoneClientOS.value,    // opcional
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

// == Fim CRUD Create/Update ==================================
// ============================================================

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