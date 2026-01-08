require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Conexión a MongoDB
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✓ Connected to MongoDB'))
    .catch(err => console.error('✗ MongoDB connection error:', err.message))
} else {
  console.warn('⚠ MONGODB_URI not set')
}

// Modelo de Note
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = mongoose.model('Note', noteSchema)

// Rutas API
app.get('/api/notes', async (req, res, next) => {
  try {
    const notes = await Note.find({})
    res.json(notes)
  } catch (error) {
    next(error)
  }
})

app.post('/api/notes', async (req, res, next) => {
  const body = req.body

  if (!body.content) {
    return res.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  try {
    const savedNote = await note.save()
    res.json(savedNote)
  } catch (error) {
    next(error)
  }
})

app.put('/api/notes/:id', async (req, res, next) => {
  const body = req.body

  const note = {
    content: body.content,
    important: body.important,
  }

  try {
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, note, { new: true })
    if (updatedNote) {
      res.json(updatedNote)
    } else {
      res.status(404).json({ error: 'note not found' })
    }
  } catch (error) {
    next(error)
  }
})

app.delete('/api/notes/:id', async (req, res, next) => {
  try {
    await Note.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

// Servir archivos estáticos del frontend (después de las rutas API)
app.use(express.static('dist'))

// Catch-all para SPA
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

// Middleware de manejo de errores (DEBE tener 4 parámetros: error, req, res, next)
app.use((error, req, res, next) => {
  console.error('Error details:', {
    message: error.message,
    name: error.name,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  })
  
  // CastError de MongoDB (ID inválido)
  if (error.name === 'CastError') {
    return res.status(400).json({ 
      error: 'malformatted id',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
  
  // ValidationError de Mongoose
  if (error.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'validation failed',
      details: error.message
    })
  }
  
  // Error personalizado con status
  const status = error.status || 500
  const message = error.message || 'internal server error'
  
  res.status(status).json({ 
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  })
})

// Iniciar servidor
const PORT = process.env.PORT || 3001
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
