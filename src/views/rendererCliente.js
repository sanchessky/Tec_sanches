/**
 * 
 * Busca de CEP automaticamente
 * @autor Thiago Sanches
 * 
 */
function buscarCEP(){
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
