function buscarCEP() {
    let cep = document.getElementById('inputCEPClient').value
    let urlAPI = `https://viacep.com.br/ws/${cep}/json/`
    fetch(urlAPI)
        .then(response => response.json())
        .then(dados => {
            document.getElementById('inputAddressClient').value = dados.logradouro
            document.getElementById('inputNeighborhoodClient').value = dados.bairro
            document.getElementById('inputCityClient').value = dados.localidade
            document.getElementById('inputUFClient').value = dados.uf
        })
        .catch(error => console.log(error))
}

function aplicarMascaraCPF(campo) {
    let cpf = campo.value.replace(/\D/g, "").slice(0, 11);
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

function aplicarMascaraDocumento(campo) {
    let valor = campo.value.replace(/\D/g, "");

    if (valor.length <= 11) {
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
        valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
        valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
        valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
        valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
    }

    campo.value = valor;
}

function validarDocumento() {
    const campo = document.getElementById('inputCPFClient');
    let valor = campo.value.replace(/\D/g, "");

    if (valor.length === 11) return validarCPF(campo, valor);
    if (valor.length === 14) return validarCNPJ(campo, valor);

    return mostrarErro(campo);
}

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

function mostrarErro(campo) {
    campo.style.borderColor = "red";
    campo.style.color = "red";
    return false;
}

function mostrarSucesso(campo) {
    campo.style.borderColor = "green";
    campo.style.color = "green";
    return true;
}

const docInput = document.getElementById('inputCPFClient');
if (docInput) {
    docInput.addEventListener("input", () => aplicarMascaraDocumento(docInput));
    docInput.addEventListener("blur", validarDocumento);
}



let arrayClient = []

const foco = document.getElementById('searchClient')


function teclaEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault()
        buscarCliente()
    }
}

document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true
    btnDelete.disabled = true
    foco.focus()
})

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




function teclaEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault()
        buscarCliente()
    }
}

function restaurarEnter() {
    frmClient.removeEventListener('keydown', teclaEnter)
}

frmClient.addEventListener('keydown', teclaEnter)

frmClient.addEventListener('submit', async (event) => {

    event.preventDefault()
    const documentoValido = validarDocumento();
    if (!documentoValido) {
        window.api.showErrorBox("CPF ou CNPJ inválido! Corrija antes de continuar.");
        docInput.focus();
        return;
    }
    console.log(nameClient.value, cpfClient.value, emailClient.value, phoneClient.value, cepClient.value, addressClient.value, numberClient.value, complementClient.value, neighborhoodClient.value, cityClient.value, ufClient.value)
    if (id.value === "") {
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
        api.newClient(client)
    } else {
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

function buscarCliente() {
    let name = document.getElementById('searchClient').value
    if (name === "") {
        api.validateSearch()
        foco.focus()
    } else {
        api.searchName(name)
        api.renderClient((event, dataClient) => {
            const dadosCliente = JSON.parse(dataClient)
            arrayClient = dadosCliente
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
                btnCreate.disabled = true
                btnUpdate.disabled = false
                btnDelete.disabled = false
            })
        })
    }


}
api.setClient((args) => {
    let campoBusca = document.getElementById('searchClient').value.trim()
    if (/^\d{11}$/.test(campoBusca) || /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(campoBusca)) {
        foco.value = "";
        cpfClient.focus();
        cpfClient.value = campoBusca;
    }
    else if (/^\d{14}$/.test(campoBusca) || /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(campoBusca)) {
        foco.value = "";
        cpfClient.focus();
        cpfClient.value = campoBusca;
    }
    else {
        foco.value = "";
        nameClient.focus();
        nameClient.value = campoBusca;
    }
})

function apagarCliente() {
    api.deleteClient(id.value)

}
function resetForm() {
    location.reload()
}
api.resetForm((args) => {
    resetForm()
})
