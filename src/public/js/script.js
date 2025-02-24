function obterData() {
    const dataAtual = new Date()
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return dataAtual.toLocaleDateString('pt-BR',options)
}
//executar a função
document.getElementById('dataAtual').innerHTML = obterData()