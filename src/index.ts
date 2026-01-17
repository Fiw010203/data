import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import roomRoutes  from './room/index.js'


const app = new Hono()

app.route('/api/room',roomRoutes)

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})