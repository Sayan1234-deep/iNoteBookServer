const express = require('express')
const connectToMongo = require('./db')
const app = express()
const cors = require('cors')

connectToMongo();


const PORT = 3004

app.use('cors')
app.use(express.json())
//Available routes
app.use('/api/auth', require('./route/auth'))
app.use('/api/note', require('./route/note'))


app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})