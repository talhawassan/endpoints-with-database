const mongoose = require('mongoose')
const validator = require('validator')
const uniqueValidator = require('mongoose-unique-validator')

const bizzSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
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
    },
    token: {
        type: String,
    },
    slug: {
        type: String,
        tolowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    town: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    businessType: {
        type: String,
        required: true
    },
    services: {
        type: String,
        required: true
    },
    costPerHour: {
        type: Number,
        required: true,
        default:0
    }, 
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String
    },
    whatsAppNo: {
        type: String,
        required: true
    },
    basicPackage: {
        type: Number,
        required: true,
        default: 0
    },
    standardPackage: {
        type: Number,
        required: true,
        default: 0
    },
    premiumPackage: {
        type: Number,
        required: true,
        default: 0
    },
    includes: {
        // type: [String],
        type: String,
        required: true
    },
    camera: {
        type: String,
        required: true
    },
    lense: {
        type: String,
        required: true
    },
    drone: {
        type: String,
        required: true
    },
    portfolio: {
        type: String
    }
}, {timestamps:true})

bizzSchema.plugin(uniqueValidator)

const Bizz = new mongoose.model('Bizz', bizzSchema)

module.exports = Bizz