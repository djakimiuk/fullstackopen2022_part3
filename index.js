require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Contact = require('./models/contact')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

const errorMiddleware = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.get('/api/persons', (req, res) => {
    Contact.find({}).then((contacts) => {
        res.json(contacts)
    })
})

app.get('/api/persons/:id', (req, res) => {
    Contact.findById(req.params.id).then((contact) => {
        res.json(contact)
    })
})

app.get('/info', (req, res) => {
    Contact.estimatedDocumentCount()
        .then((count) => {
            res.send(`<p>Phonebook has info for ${count} people</p>
    <p>${new Date()}</p>`)
        })
        .catch((err) => {
            console.log(`There was an error: ${err}`)
        })
})

app.delete('/api/persons/:id', (req, res) => {
    Contact.findByIdAndRemove(req.params.id).then((contact) => {
        res.status(204).end()
    })
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body
    if (!body || !body.name || !body.number) {
        return res.status(400).json({ error: 'name and number must be filled in' })
    }

    const person = new Contact({
        name: body.name,
        number: body.number,
    })

    person
        .save()
        .then((savedPerson) => {
            res.json(savedPerson)
        })
        .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const updatedPerson = {
        name: body.name,
        number: body.number,
    }
    Contact.findByIdAndUpdate(req.params.id, updatedPerson, {
        new: true,
        runValidators: true,
        context: 'query',
    })
        .then((contact) => {
            res.json(contact)
        })
        .catch((error) => next(error))
})

app.use(errorMiddleware)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
