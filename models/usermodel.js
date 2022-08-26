const mongoose = require('mongoose')
const validator = require('validator')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    email :{
        type: String,
        required: true,
        unqiue: true,
        trim: true,
        lowercase: true,
        validate(value) {
           if(!validator.isEmail(value)){
            throw new Error('email is invalid')
           }
        }
    },
    password: {
        type: String,
        // required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')){
                throw new Error('password must not contain the word password')
            }
        }
    }, phone: {
        type: String,
    },
      area: {
          type: String,
          trim: true
   },
     city: {
         type: String,
         trim: true,
   },
    town: {
        type: String,
        trim: true,
   },
   googleId: {
        type: String
   }, facebook_id: {
        type: String
   },
   token: {
    type: String
   }
},
{ timestamps: true }
)

userSchema.plugin(uniqueValidator)

const User = new mongoose.model('User', userSchema)

module.exports = User
