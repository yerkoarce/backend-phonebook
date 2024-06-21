require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./modules/person')

const app = express()
app.use(cors())

app.use(express.json())
app.use(express.static('dist'))



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

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person =>{
        res.json(person)
    })
})

app.get('/info', (req, res)=> {
    
})


app.delete('/api/persons/:id',(req, res) =>{
    
})

app.post('/api/persons',(req, res) => {
    const body = req.body
    
    if (body === undefined){
        return res.status(404).json({ error: 'Content missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })

})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server listen on port ${PORT}`)
})