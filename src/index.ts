import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import userRoutes from './users/index.js'
import roleRoutes from './roles/index.js'
import db from './db/index.js' 

const app = new Hono()
  
app.route('/api/users',userRoutes)
app.route('/api/roles',roleRoutes)


 
serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})