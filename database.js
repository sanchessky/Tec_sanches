const mongoose = require('mongoose')
const url = `mongodb+srv://adminT:123Senac@projetoestudo.5s38n.mongodb.net/dbtecsanches`
let conectado = false
const conectar = async () => {
    if (!conectado) {

        try {
            await mongoose.connect(url)
            conectado = true
            return true
        } catch (error) {

            if (error.code = 8000) {
            } else {
                console.log(error)

            }
            return false
        }

    }
}
const desconectar = async () => {
    if (conectado) {
        try {
            await mongoose.disconnect(url)
            conectado = false
            return true
        } catch (error) {
            console.log(error)
            return false
        }

    }
}
module.exports = { conectar, desconectar }