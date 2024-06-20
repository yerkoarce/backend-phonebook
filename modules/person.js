const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('Conecting to ', url)

mongoose.connect(url)
    .then(result => {
        console.log('connect to MongoDB')
    })
    .catch(error => {
        console.log('Error connecting to MongoDB ', error)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJson', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model('Person', personSchema)