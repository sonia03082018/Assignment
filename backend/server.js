const express = require("express")
const dotEnv = require("dotenv")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const employeeRoutes = require("./routes/employeeRoutes")
const userRoutes = require("./routes/userRoutes")
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()

const PORT = process.env.PORT || 5000

dotEnv.config()

app.use(bodyParser.json())

app.use(cors({
    origin:"http://localhost:3000",
    credentials: true
    }
));

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Mongodb connected successfully")
    })
    .catch((error) => {
        console.log("Error", `${error}`)
    })

app.use('/employees', employeeRoutes)
app.use('/users', userRoutes)

app.listen(PORT, () => {
    console.log(`server started and running ar ${PORT}`)
})