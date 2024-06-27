require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./modules/person')

const app = express()
app.use(cors())

app.use(express.static('dist'))
app.use(express.json())

const requestLogger = (req, res, next) => {
    console.log('Method: ', req.method)
    console.log('Path: ', req.path)
    console.log('Body: ', req.body)
    console.log('---')
    next()
}

app.use(requestLogger)


morgan.token('info', function (req, res) { 
    return JSON.stringify(req.body) 
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :info'))

app.get('/', (req, res) => {
    res.send('Hello, world!');
  });

app.get('/api/persons', (req, res) => { 
    Person.find({})
        .then(person => {
            res.json(person)
        })
        .catch(error => {
            console.error('Error fetching notes', error.message)
            res.status(500).json({error: 'An error occurred while fetching notes'})
        })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person =>{
            if (person){
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.get('/info', (req, res)=> {
    
})

app.put('/api/persons/:id', (req,res,next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatePerson => {
            res.json(updatePerson)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id',(req, res, next) =>{
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons',(req, res) => {
    const body = req.body
    
    if (body === undefined){
        return res.status(400).json({ error: 'Content missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })

})

// Middleware para solicitudes a rutas inexistentes
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// middleware para el manejo de errores 
const errorHandler = (error , req, res, next) => {
    console.log(error.message)

    if (error.name === 'CastError'){
        return res.status(404).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server listen on port ${PORT}`)
})