import express from "express"
import db from "../config/db.js"

const router = express.Router()

router.get("/game", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login")
    }

    res.render("game.njk", {
        user: req.session.user
    })
})

router.get("/get_progress", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not logged in" })
    }

    const progress = db.prepare(`
        SELECT * FROM progress
        WHERE user_id = ?
    `).get(req.session.user.id)

    res.json(progress || {
        dna: 0,
        money_per_click: 1,
        money_per_second: 0,
        upgrades: 0,
        clicks: 0
    })
})

router.post("/save_progress", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not logged in" })
    }

    const {
        dna,
        moneyPerClick,
        moneyPerSecond,
        acquiredUpgrades,
        numberOfClicks
    } = req.body

    const existing = db.prepare(`
        SELECT id FROM progress
        WHERE user_id = ?
    `).get(req.session.user.id)

    if (existing) {
        db.prepare(`
            UPDATE progress
            SET dna = ?,
                money_per_click = ?,
                money_per_second = ?,
                upgrades = ?,
                clicks = ?,
                updated_at = datetime('now')
            WHERE user_id = ?
        `).run(
            dna,
            moneyPerClick,
            moneyPerSecond,
            acquiredUpgrades,
            numberOfClicks,
            req.session.user.id
        )
    } else {
        db.prepare(`
            INSERT INTO progress (
                user_id,
                dna,
                money_per_click,
                money_per_second,
                upgrades,
                clicks
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(
            req.session.user.id,
            dna,
            moneyPerClick,
            moneyPerSecond,
            acquiredUpgrades,
            numberOfClicks
        )
    }

    res.json({ success: true })
})

export default router