const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())
app.use(express.static('build'))

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

let persons = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: 1
    },
    {
      name: "Martti Tienari",
      number: "040-123456",
      id: 2
    },
    {
      name: "Arto Järvinen",
      number: "040-123456",
      id: 3
    },
    {
      name: "Lea Kutvonen",
      number: "040-123456",
      id: 4
    }
  ]
/*
app.get('/', (req, res) => {
  res.send('<h1>Go to /info -page</h1>')
})

app.get('/info', (req, res) => {
  res.send('<p>puhelinluettelossa on ' + persons.length + 
    ' henkilön tiedot</p> <p>' + new Date() + '</p>')
})
*/
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if ( person ) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if ((body.name === undefined) || (body.number === undefined) || 
    (persons.find(person => person.name === body.name)) !== undefined) {
    return response.status(400).json(
      {error: 'incorrect post request or name is already in use'})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * Math.floor(5000))
  }

  persons = persons.concat(person)
  response.json(person)
})


const port = process.env.PORT || 3002
app.listen(port)
console.log(`Phonebook server running on port ${port}`)


