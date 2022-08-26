const express = require('express')
const passport = require('passport')
const session = require('express-session')
const app = express()
require('dotenv').config()
require('./db/mongoose')
const userRoute = require('./routers/userRouter')
const bizRoute = require('./routers/bizRouter')
require('./config/passport')(passport)


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use(userRoute)
app.use(bizRoute)



const PORT = process.env.PORT || 5002

app.listen(PORT, () => {
    console.log(`server is up on port ${PORT}`)
})