const mongoose = require('mongoose')

// process.argv -> saber cuantos argumentos tiene para poner las condiciones 
// [3] -> nombre de la persona 
// [4] -> Teléfono

if (process.argv.length < 3){
    console.log('Give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://yerkoarce:${password}@phonebookfso.ncrt3o7.mongodb.net/?retryWrites=true&w=majority&appName=phonebookFSO`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3){
    console.log('Phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`) // Mejorar salida por consola 
        })
        mongoose.connection.close()
    })
} else if (process.argv.length === 4){
    console.log('Give a name and number for add person to phonebook')
    process.exit(1)
} else if (process.argv.length === 5){
    const inputName = process.argv[3]
    const inputNumber = process.argv[4]
    const person = new Person({
        name: inputName,
        number: inputNumber
    })
    person.save().then(result => {
        console.log(`Added ${result.name} number ${result.number} to phonebook.`)
        mongoose.connection.close()
    })
}



