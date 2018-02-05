const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Person = require('./models/person')

app.use(bodyParser.json())
app.use(express.static('build'))

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

app.get('/info', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.send('<p>puhelinluettelossa on ' + persons.length + 
    ' henkilön tiedot</p> <p>' + new Date() + '</p>')
    })
    .catch(error => {
      console.log(error)
      response.status(404).end()
    })
})

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(result => result.map(Person.format))
    .then(persons => response.json(persons))
    .catch(error => {
      console.log(error)
      response.status(404).end()
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(Person.format)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => response.status(204).end())
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if ((body.name === undefined) || (body.number === undefined)) {
    return response.status(400).json({error: 'erroneous post request'})
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  Person
    .find({name: person.name})
    .then(result => {
      if(!result) {
        person
          .save()
          .then(Person.format)
          .then(savedAndFormatted => response.json(savedAndFormatted))
          .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'something went wrong in saving' })
          })
      } else {
        response.status(400).send({ error: 'person already in database' })
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'something went wrong when checking the name' })
    })
      
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  if ((body.name === undefined) || (body.number === undefined)) {
    return response.status(400).json({error: 'erroneous put request'})
  }

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true } )
    .then(Person.format)
    .then(updated => response.json(updated))
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})


const port = process.env.PORT || 3002
app.listen(port)
console.log(`Phonebook server running on port ${port}`)


