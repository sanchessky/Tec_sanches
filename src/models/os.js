/**
 * Modelo de dados para construção das coleções("tabelas")
 * OS
 */

// importação dos recursos do framework mongoose
const { model, Schema } = require('mongoose')

// criação da estrutura da coleção OS
const osSchema = new Schema({
    dataOS: {
        type: Date,
        default: Date.now
    },
    idCliente: {
        type: String,        
    },
    status_OS: {
        type: String
    },
    smartphone: {
        type: String
    },
    imei: {
        type: String        
    },
    problema: {
        type: String  
    },
    tecnico: {
        type: String  
    },
    diagnostico: {
        type: String  
    },
    pecas: {
        type: String 
    },
    valor: {
        type: String 
    },
}, {versionKey: false}) //não versionar os dados armazenados

// exportar para o main o modelo de dados
// OBS: OS 
module.exports = model('OS', osSchema)