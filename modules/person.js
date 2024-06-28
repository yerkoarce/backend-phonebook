const mongoose = require( 'mongoose' )

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('Conecting to ', url)

mongoose.connect(url)
    .then(result => {
        console.log('connect to MongoDB')
    })
    .catch(error => {
        console.error('Error connecting to MongoDB ', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /d{2,3}-d{5,8}/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        minLength: 8
    }
})

personSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model('Person', personSchema)