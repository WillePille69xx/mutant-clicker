import express from "express"
import bcrypt from "bcrypt"
import db from "../config/db.js"

const router = express.Router()

router.get("/register", (req, res) => {
    res.render("register.njk")
})

router.post("/register", async (req, res) => {
    const { username, password, passwordCheck } = req.body

    if (password !== passwordCheck) {
        return res.send("Passwords do not match")
    }

    try {
        const hash = await bcrypt.hash(password, 10)

        const insert = db.prepare(`
            INSERT INTO users (username, password_hash)
            VALUES (?, ?)
        `)

        insert.run(username, hash)

        res.redirect("/login")
    } catch (err) {
        console.error(err)

        if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.send("Username already exists")
        }

        res.status(500).send("Server error")
    }
})

router.get("/login", (req, res) => {
    res.render("login.njk")
})

router.post("/login", async (req, res) => {
    const { username, password } = req.body

    try {
        const user = db.prepare(`
            SELECT * FROM users
            WHERE username = ?
        `).get(username)

        if (!user) {
            return res.send("User not found")
        }

        const match = await bcrypt.compare(password, user.password_hash)

        if (!match) {
            return res.send("Wrong password")
        }

        req.session.user = {
            id: user.id,
            username: user.username
        }

        res.redirect("/game")
    } catch (err) {
        console.error(err)
        res.status(500).send("Server error")
    }
})

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login")
    })
})

export default router