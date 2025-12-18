import { Hono } from "hono";
import * as z from "zod";
import { zValidator } from "@hono/zod-validator";
import db from "../db/index.js";

const userRoutes = new Hono();
const createUserSchema = z.object({
  username: z.string("กรอกชื่อมาแน่")
  .min(5,"ชื่อต้องมีความยาวอย่างน้อย5 ตัว"),
  password: z.string("กรุณากรอกชื่อผู้ใช้"),
  firstname: z.string("กรุณากรอกชื่อจริง"),
  lastname: z.string("กรุณากรอกนามสกุล"), 
})


type User = {
  id: number;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
};

userRoutes.get("/:id", (c) => {
  const {id} = c.req.param(); // ดึง parameter จาก URL เช่น /users?id=1
  const sql = "SELECT * FROM users WHERE id = @id";
  const stmt = db.prepare<{ id: string }, User>(sql);
  const user = stmt.get({ id: id });
  return c.json({
    message: `User for ID: ${id}`,
    data: user,
  });
  
});
userRoutes.post('/',
  zValidator('json', createUserSchema, (result,c) => {
    if  (!result.success){
      return c.json({
        message: 'Validation Error',
        errors: result.error.issues }, 400)
    }
  }),
  

  async (c) => {
    const body = await c.req.json<User>()
    let sql = `INSERT INTO users
      (username, password, firstname, lastname)
      VALUES (@username, @password, @firstname, @lastname);`

    let stmt = db.prepare<Omit<User, "id">>(sql)
    let result = stmt.run(body)

    if (result.changes === 0) {
      return c.json({ message: 'Failed to create user' }, 500)
    }

    let lastRowid = result.lastInsertRowid as number

    let sql2 = 'SELECT * FROM users WHERE id = ?'
    let stmt2 = db.prepare<[number], User>(sql2)
    let newUser = stmt2.get(lastRowid)

    return c.json({ message: 'User created', data: newUser }, 201)
  }
)

export default userRoutes

