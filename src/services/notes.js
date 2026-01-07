import axios from 'axios'

// Para desarrollo: proxy en vite.config.js redirige a http://localhost:3001
// Para producción: ruta relativa al mismo servidor
const baseUrl = '/api/notes'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, update, remove }
