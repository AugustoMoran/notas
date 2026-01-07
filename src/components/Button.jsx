const Button = ({ onClick, text, type, variant = 'default' }) => {
  return (
    <button onClick={onClick} type={type} className={`btn-${variant}`}>
      {text}
    </button>
  )
}

export default Button
