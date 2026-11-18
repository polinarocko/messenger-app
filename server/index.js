import express from 'express'
import bcrypt from 'bcrypt'
import db from './db.js'
import JWT from 'jsonwebtoken'
import { authMiddleware } from './middleware/authMiddleware.js'

const JWT_SECRET = 'hihihihihihihihihihihihihihihihi'

const app = express();
app.use(express.json())
app.use(express.static("public"))

app.post("/register", async (req, res) => {
    const { username, password } = req.body
    const passwordHash = await bcrypt.hash(password, 10)
    const sql = `
    INSERT INTO users (username, password)
    VALUES (?,?)
    `
    db.run(sql, [username, passwordHash], (error) => {
        if (error) {
            return res.status(400).json({
                error: error.message
            })
        }
        res.json({
            // id: this.lastID, 
            username: username
        })
    })
})

app.post('/login', (req, res) => {
    const { username, password } = req.body
    const sql = 'SELECT * FROM users WHERE username = ?'
    db.get(sql, [username], async (error, user) => {
        if (error) {
            return res.status(400).json({
                error: error.message
            })
        }

        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials'
            })
        }
        let isPassValid = await bcrypt.compare(password, user.password)
        if (!isPassValid) {
            return res.status(401).json({
                error: 'Incorrect password'
            })
        }
        const token = JWT.sign({ id: user.id, username: user.username }, JWT_SECRET)
        if (token) {
            res.json({
                token: token

            })
        }
    })

})

app.get('/profile', authMiddleware, (req, res) => {
    res.json({
        id: req.user.id,
        username: req.user.username
    })
})
// app.get('/message', authMiddleware, (req, res) => {
//     console.log("hi")
//     res.json({
//         id: req.user.id,
//         username: req.user.username
//     })
// })
app.get('/users', authMiddleware, (req, res) => {
    const sql = 'SELECT id, username FROM users'
    db.all(sql, [], (error, users) => {
        if (error) {
            return res.status(500).json({
                error: error.message
            });
        }
        res.json(users);
    })
})

app.post('/message', authMiddleware, (req, res) => {
    console.log(req.body)
    const senderID = req.user.id
    const recieverID = req.body.recieverID
    const text = req.body.text
    const sql = 'INSERT INTO messages (sender_id, reciever_id, text) VALUES (?, ?, ?)'
    db.run(sql, [senderID, recieverID, text], (error) =>{
        if (error){
            return res.status(500).json({
                error: error.message,
            })
        }
        res.status(201).json({ response: "Message sent" });
    })
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
});