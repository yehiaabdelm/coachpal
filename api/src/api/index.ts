import { Hono } from 'hono'
import auth from './auth/index.js'
import organizations from './organizations/index.js'

const api = new Hono()

api.route('/auth', auth)
api.route('/organizations', organizations)

export default api
