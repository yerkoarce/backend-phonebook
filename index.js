const express = require('express')
const { v4: uuidv4 } = require('uuid')
const morgan = require('morgan')

const app = express()


app.use(express.json())

morgan.token('info', function (req, res) { 
    return JSON.stringify(req.body) 
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :info'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res)=> {
    const personsQuantity = persons.length
    const date = Date()
    res.send(`<p>Phonebook has info for ${personsQuantity} people.</p><p>${date}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id === id)
    
    if(person){
        res.send(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id',(req, res) =>{
    const id = req.params.id
    persons = persons.filter(p => p.id !== id)

    res.status(204).end() 
})

app.post('/api/persons',(req, res) => {
    const body = req.body
    const existingPerson = persons.find(p => p.name === body.name)

    if (!body.name || !body.number){
        return res.status(400).json({
            error: "Name or number missing"
        })
    } 
    if (existingPerson){
        return res.status(409).json({
            error: "Phonebook name already registred"
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: uuidv4()
    }

    persons = persons.concat(person)
    res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server listen on port ${PORT}`)
})