import Button from './Button'

const Note = ({ note, toggleImportance, deleteNote }) => {
  const label = note.important ? 'make not important' : 'make important'
  
  return (
    <li>
      {note.content} 
      <Button onClick={toggleImportance} text={label} variant="neutral" />
      <Button onClick={deleteNote} text="delete" variant="red" />
    </li>
  )
}

export default Note
