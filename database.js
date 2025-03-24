/**
 * Modulo de conexão com o banco de dados
 * Uso do Framework mongoose
 */

// Importação do mongoose
const mongoose = require('mongoose')
//configuração do acesso ao banco de dados
//ip/link - autenticação como faço isso ?
//obs: Atlas (obter via compass)
//Para cirar um banco de dados personalizado basta escolher um nome no final da String da Url (ex:dbtecsanches)
const url =`mongodb+srv://adminT:123Senac@projetoestudo.5s38n.mongodb.net/dbtecsanches`
// apos isso crie uma varuavel de apoio para validação necessario para um projeto real
let conectado = false
// metodo para conectar o banco de dados
// asycn executar a função de forma assincrona
const conectar = async () => {
// validação (se não estiver conectado, conectar)
    if(!conectado){
    //conectar com o banco de dados
        try{
            await mongoose.connect(url) //conectar
            conectado = true //setar a variavel
            console.log("MongoDB conectado")
            return true // para o main identificar a conexçao estabelecida com sucesso
            //try catch - tratamento de exceçoes
        } catch (error){
            // se o código de erro = 8000 (autenticação)
            if(error.code = 8000){
                console.log("Erro de autenticação")
            } else {
                console.log(error)
                
            }
            return false
        }

    }
}
// metodo para desconectar o banco de dados
const desconectar = async () => {
    // validação (se estiver conectado, desconectar)
        if(conectado){
        //desconectar o banco de dados
            try{
                await mongoose.disconnect(url) //conectar
                conectado = false 
                console.log("MongoDB desconectado")
                return true // banco de dados desconectado com sucesso para o main identificar a desconecção
                //try catch - tratamento de exceçoes
            } catch (error){
                console.log(error)
             return false   
            }
    
        }
    }
//agora voce exporta para o main os metedos de conectar e desconectar
module.exports = {conectar, desconectar}