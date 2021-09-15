const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URI, {
    useFindAndModify: false,
    // useCreateIndex:true,
    useNewUrlParser: true,
    useUnifiedTopology: true
},
    function (error) { if (error) console.log("Error en la base de datos : " + error) }
);


app.use('/api/meals', require('./routers/meals'))
app.use('/api/orders', require('./routers/orders'))
app.use('/api/auth', require('./routers/auth'))


module.exports = app