import { Hono } from 'hono'
import auth from './auth/index.js'

const api = new Hono()

api.route('/auth', auth)

export default api
