/**
 * Processo de renderização
 * Tela Principal
 */
//console.log("Processo de Renderização")
function client() {
    //console.log("Teste do botão cliente")
    api.clientWindow()
}
function os() {
    //console.log("Teste de botão os")
    api.osWindow()
}
// troca do icone banco de dados (usando a api do preload.js)
api.dbStatus((event, message) => {
    //teste do recebimento da mensagem do main
    console.log(message)
    if (message === "conectado") {
        document.getElementById('statusdb').src = "../public/img/dbon.png"
    } else {
        document.getElementById('statusdb').src = "../public/img/dboff.png"
    }
})
