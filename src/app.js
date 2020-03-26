const express = require('express')
require('./db/mongoose.js') //requere mongoose file to just run in background!

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()


app.use(express.json()) /// congigure express to automatically parse the incoming json to an onject we can access it in request handellers
app.use(userRouter)
app.use(taskRouter)

module.exports = app