const express = require('express')
const app = express();
const allRouters = require('./routes/routes')

app.use(express.json())

app.use('/api', allRouters)

const PORT = process.env.PORT || 9000
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})