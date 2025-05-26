// Buscar CEP
function buscarCEP() {
    //console.log("teste do evento blur")
    //armazenar o cep digitado na variável
    let cep = document.getElementById('inputCEPClient').value
    //console.log(cep) //teste de recebimento do CEP
    //"consumir" a API do ViaCEP
    let urlAPI = `https://viacep.com.br/ws/${cep}/json/`
    //acessando o web service par abter os dados
    fetch(urlAPI)
        .then(response => response.json())
        .then(dados => {
            //extração dos dados
            document.getElementById('inputAddressClient').value = dados.logradouro
            document.getElementById('inputNeighborhoodClient').value = dados.bairro
            document.getElementById('inputCityClient').value = dados.localidade
            document.getElementById('inputUFClient').value = dados.uf
        })
        .catch(error => console.log(error))
}

// == Validar CPF =============================================
// Função para aplicar a máscara no CPF
function aplicarMascaraCPF(campo) {
    let cpf = campo.value.replace(/\D/g, "").slice(0, 11); // mantêm até 11 dígitos
    if (cpf.length > 9) {
        campo.value = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    } else if (cpf.length > 6) {
        campo.value = cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (cpf.length > 3) {
        campo.value = cpf.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    } else {
        campo.value = cpf;
    }
}

// Função para aplicar máscara dinâmica (CPF ou CNPJ)
function aplicarMascaraDocumento(campo) {
    let valor = campo.value.replace(/\D/g, "");

    if (valor.length <= 11) {
        // Máscara CPF: 000.000.000-00
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
        // Máscara CNPJ: 00.000.000/0000-00
        valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
        valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
        valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
        valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
    }

    campo.value = valor;
}

// Função para validar CPF ou CNPJ
function validarDocumento() {
    const campo = document.getElementById('inputCPFClient');
    let valor = campo.value.replace(/\D/g, "");

    if (valor.length === 11) return validarCPF(campo, valor);
    if (valor.length === 14) return validarCNPJ(campo, valor);

    return mostrarErro(campo);
}

// Validação CPF
function validarCPF(campo, cpf) {
    if (/^(\d)\1+$/.test(cpf)) return mostrarErro(campo);

    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return mostrarErro(campo);

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[10])) return mostrarErro(campo);

    return mostrarSucesso(campo);
}

// Validação CNPJ
function validarCNPJ(campo, cnpj) {
    if (/^(\d)\1+$/.test(cnpj)) return mostrarErro(campo);

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return mostrarErro(campo);

    tamanho += 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(1))) return mostrarErro(campo);

    return mostrarSucesso(campo);
}

// Mostrar erro visual
function mostrarErro(campo) {
    campo.style.borderColor = "red";
    campo.style.color = "red";
    return false;
}

// Mostrar sucesso visual
function mostrarSucesso(campo) {
    campo.style.borderColor = "green";
    campo.style.color = "green";
    return true;
}

// Eventos para campo de CPF/CNPJ
const docInput = document.getElementById('inputCPFClient');
if (docInput) {
    docInput.addEventListener("input", () => aplicarMascaraDocumento(docInput));
    docInput.addEventListener("blur", validarDocumento);
}



// vetor global que será usado na manipulação dos dados
let arrayClient = []

// capturar o foco na busca pelo nome do cliente
// a constante foco obtem o elemento html (input) identificado como 'searchClient'
const foco = document.getElementById('searchClient')


function teclaEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault()
        buscarCliente()
    }
}

// Iniciar a janela de clientes alterando as propriedades de alguns elementos
document.addEventListener('DOMContentLoaded', () => {
    // Desativar os botões
    btnUpdate.disabled = true
    btnDelete.disabled = true
    // Foco na busca do cliente
    foco.focus()
})

//captura dos dados dos inputs do formulário (Passo 1: Fluxo)
let frmClient = document.getElementById('frmClient')
let nameClient = document.getElementById('inputNameClient')
let cpfClient = document.getElementById('inputCPFClient')
let emailClient = document.getElementById('inputEmailClient')
let phoneClient = document.getElementById('inputPhoneClient')
let cepClient = document.getElementById('inputCEPClient')
let addressClient = document.getElementById('inputAddressClient')
let numberClient = document.getElementById('inputNumberClient')
let complementClient = document.getElementById('inputComplementClient')
let neighborhoodClient = document.getElementById('inputNeighborhoodClient')
let cityClient = document.getElementById('inputCityClient')
let ufClient = document.getElementById('inputUFClient')
let id = document.getElementById('idClient')




// == Manipulação da tecla Enter ============================
// Função para manipular o evento da tecla Enter
function teclaEnter(event) {
    // se a tecla Enter for pressionada
    if (event.key === "Enter") {
        event.preventDefault() // ignorar o comportamento padrão
        // associar o Enter a busca pelo cliente
        buscarCliente()
    }
}

// Função para restaurar o padrão da tecla Enter (submit)
function restaurarEnter() {
    frmClient.removeEventListener('keydown', teclaEnter)
}

// "Escuta do evento Tecla Enter"
frmClient.addEventListener('keydown', teclaEnter)

// == Fim - manipulação tecla Enter ==========================

// == CRUD Create/Update ======================================

//Evento associado ao botão submit (uso das validações do html)
frmClient.addEventListener('submit', async (event) => {

    //evitar o comportamento padrão do submit que é enviar os dados do formulário e reiniciar o documento html
    event.preventDefault()
    const documentoValido = validarDocumento();
    if (!documentoValido) {
        window.api.showErrorBox("CPF ou CNPJ inválido! Corrija antes de continuar.");
        docInput.focus();
        return; // Impede envio
    }
    // Teste importante (recebimento dos dados do formuláro - passo 1 do fluxo)
    console.log(nameClient.value, cpfClient.value, emailClient.value, phoneClient.value, cepClient.value, addressClient.value, numberClient.value, complementClient.value, neighborhoodClient.value, cityClient.value, ufClient.value)
    if (id.value === "") {
        //executar o metodo para cadastra um cliente
        const client = {
            nameCli: nameClient.value,
            cpfCli: cpfClient.value,
            emailCli: emailClient.value,
            phoneCli: phoneClient.value,
            cepCli: cepClient.value,
            addressCli: addressClient.value,
            numberCli: numberClient.value,
            complementCli: complementClient.value,
            neighborhoodCli: neighborhoodClient.value,
            cityCli: cityClient.value,
            ufCli: ufClient.value
        }
        // Enviar ao main o objeto client - (Passo 2: fluxo)
        // uso do preload.js
        api.newClient(client)
    } else {
        // excecutar o método para alterar os dados do cliente
        const client = {
            idCli: id.value,
            nameCli: nameClient.value,
            cpfCli: cpfClient.value,
            emailCli: emailClient.value,
            phoneCli: phoneClient.value,
            cepCli: cepClient.value,
            addressCli: addressClient.value,
            numberCli: numberClient.value,
            complementCli: complementClient.value,
            neighborhoodCli: neighborhoodClient.value,
            cityCli: cityClient.value,
            ufCli: ufClient.value
        }
        api.updateClient(client)
    }
    
})

// == Fim CRUD Create/Update ==================================
// // == Inicio CRUD Read =========================================
function buscarCliente() {
    //console.log("teste do botão buscar")
    // Passo 1: capturar o nome do cliente
    let name = document.getElementById('searchClient').value
    console.log(name) // teste do passo 1

    //Validação de campo obrigatorio. Se o campo de busca não for preenchido enviar um alerta ao usuario. Fazer o main enviar um pedido para alertar o usuário
    if (name === "") {
        api.validateSearch()
        foco.focus()
    } else {
        api.searchName(name) // Passo 2: envio do nome ao main
        // recebimento dos dados do cliente
        api.renderClient((event, dataClient) => {
            console.log(dataClient) // teste do passo 5
            // passo 6 renderizar os dados do cliente no formulário
            // - Criar um vetor global para manipulação dos dados
            // - criar uma constante para converter os dados recebidos (string) para o formato JASON (JSON.parse)
            // usar o laço forEach para percorre o vetor e setar os campos (caixas de texto) do formulário
            const dadosCliente = JSON.parse(dataClient)
            // atribuir ao vetor os dados do cliente
            arrayClient = dadosCliente
            // extrair os dados do cliente
            arrayClient.forEach((c) => {
                id.value = c._id,
                nameClient.value = c.nomeCliente,
                    cpfClient.value = c.cpfCliente,
                    emailClient.value = c.emailCliente,
                    phoneClient.value = c.foneCliente,
                    cepClient.value = c.cepCliente,
                    addressClient.value = c.logradouroCliente,
                    numberClient.value = c.numeroCliente,
                    complementClient.value = c.complementoCliente,
                    neighborhoodClient.value = c.bairroCliente,
                    cityClient.value = c.cidadeCliente,
                    ufClient.value = c.ufCliente
                     // bloqueio do botão adicinar
                     btnCreate.disabled = true
                     // Desbloqueio dos botão ediar e excluir
                     btnUpdate.disabled = false
                     btnDelete.disabled = false
            })
        })
    }


}
// == Fim CRUD Read================================================================
// setar o cliente não cadastrado (recortar do campo de busca e colar no campo nome)
api.setClient((args) => {
    let campoBusca = document.getElementById('searchClient').value.trim()

// Verifica se é CPF (somente números ou com máscara)
if (/^\d{11}$/.test(campoBusca) || /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(campoBusca)) {
    foco.value = "";
    cpfClient.focus();
    cpfClient.value = campoBusca;
}
// Verifica se é CNPJ (somente números ou com máscara)
else if (/^\d{14}$/.test(campoBusca) || /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(campoBusca)) {
    foco.value = "";
    cpfClient.focus();
    cpfClient.value = campoBusca;
}
// Senão, assume como nome
else {
    foco.value = "";
    nameClient.focus();
    nameClient.value = campoBusca;
}
})

//======================================================================
/// == Inicio CRUD Delete =========================================

function apagarCliente() {
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
