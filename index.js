require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body "))

// let persons = [
//   { 
//     "id": "1",
//     "name": "Arto Hellas", 
//     "number": "040-123456"
//   },
//   { 
//     "id": "2",
//     "name": "Ada Lovelace", 
//     "number": "39-44-5323523"
//   },
//   { 
//     "id": "3",
//     "name": "Dan Abramov", 
//     "number": "12-43-234345"
//   },
//   { 
//     "id": "4",
//     "name": "Mary Poppendieck", 
//     "number": "39-23-6423122"
//   }
// ]

app.get('/api/people', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get("/api/info", (request, response) => {
  response.send(
    `<p>
      Phonebook has info for ${persons.length} people <br/>
      ${new Date()}
    </p>`
  )
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  response.status(204).end()
})

app.post('/api/people', (request, response) => {
  const body = request.body

  if (body.name === undefined ||
    body.number === undefined
  ) {
    return response.status(400).json({ error: 'Contact info missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(p => Number(p.id)))
    : 0
  return String(maxId + 1)
}

// app.post('/api/persons', (request, response) => {
//   const body = request.body
//   console.log(body);
  
//   if (!body.name || !body.number) {
//     return response.status(400).json({ 
//       error: 'name or number missing'
//     })
//   }
//   const duplicate = persons
//     .map(p => p.name)
//     .find(p => p === body.name)
//   console.log(duplicate)
  
//   if (duplicate) {
//     return response.status(400).json({
//       error: "Name already exists"
//     })
//   }

//   const person = {
//     name: body.name,
//     number: body.number,
//     id: generateId(),
//   }

//   persons = persons.concat(person)

//   response.json(person)
// })


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})