const express = require('express')
require('./db/mongoose.js') //requere mongoose file to just run in background!

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT


app.use((req, res, next) => {
    const MaintenanceMode = 0
    if (MaintenanceMode)
        return res.status(503).send('The Site Is Under Maintenance, Please Try Again Soon!')
    next()
})

app.use(express.json()) /// congigure express to automatically parse the incoming json to an onject we can access it in request handellers
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('The App Is Running On Port', port)
})