import axios from 'axios'

const ApiService = axios.create({
	baseURL: 'https://brem-br3m.firebaseio.com',
	timeout: 12000,
	headers: { 'Content-Type': 'application/json' }
})

export default ApiService
