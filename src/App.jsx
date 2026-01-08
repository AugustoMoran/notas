import { useState, useEffect } from 'react'
import Note from './components/Notes'
import Button from './components/Button'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState(
    'a new note...'
  )
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    noteService
      .getAll()
      .then(response => {
        const notesData = response.data || response || []
        setNotes(Array.isArray(notesData) ? notesData : [])
      })
      .catch(error => {
        console.error('Error fetching notes:', error)
      })
  }, [])

  const notesToShow = Array.isArray(notes) 
    ? (showAll ? notes : notes.filter(note => note.important === true))
    : []

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }
    
    noteService
      .create(noteObject)
      .then(response => {
        setNotes(notes.concat(response.data || response))
        setNewNote('')
      })
      .catch(error => {
        console.error('Error creating note:', error)
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
    
    noteService
      .update(id, changedNote)
      .then(response => {
        setNotes(notes.map(n => n.id !== id ? n : (response.data || response)))
      })
      .catch(error => {
        alert(`The note was already deleted from server`)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const deleteNote = (id) => {
    if (window.confirm('Delete this note?')) {
      noteService
        .remove(id)
        .then(() => {
          setNotes(notes.filter(n => n.id !== id))
        })
        .catch(error => {
          alert('Error deleting note')
        })
    }
  }

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <Button 
          onClick={() => setShowAll(!showAll)}
          text={showAll ? 'show important' : 'show all'}
          variant="white"
        />
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note 
            key={note.id} 
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
            deleteNote={() => deleteNote(note.id)}
          />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <Button type="submit" text="save" variant="green" />
      </form>
    </div>
  )
}

export default App
