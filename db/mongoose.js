const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true
}).then(() => {
    console.log('database connected')
}).catch((e) => {
  console.log(e)
})
