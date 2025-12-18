import { Hono } from 'hono'

const userRoutes = new Hono()

userRoutes.get('/',(c) => {
    return c.json({message: 'List of users '})
})




export default userRoutes