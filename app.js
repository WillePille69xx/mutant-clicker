import "dotenv/config"
import express from "express"
import nunjucks from "nunjucks"
import morgan from "morgan"
import session from "express-session"


import db from "./config/db.js" 

import indexRouter from "./routes/index.js"
import loginRegisterRouter from "./routes/loginRegister.js"
import gameRouter from "./routes/game.js"


const app = express()
const port = process.env.PORT || 3000
const isProduction = process.env.NODE_ENV === "production"


app.locals.db = db 


nunjucks.configure("views", {
  autoescape: true,
  express: app,
})

app.set("view engine", "njk")
app.set("views", "./views")


app.use(morgan("dev"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({
  secret: "secret-key", // In production, move this to your .env!
  resave: false,
  saveUninitialized: false
}))

app.use(express.static("public"))


app.use("/", indexRouter)
app.use("/", loginRegisterRouter)
app.use("/", gameRouter)


app.use((req, res) => {
  res.status(404).send("Sidan kunde inte hittas.")
})


app.use((err, req, res, next) => {
  console.error(err.stack)
  const message = isProduction
    ? "Serverfel."
    : `Serverfel: ${err.message}`
  res.status(500).send(message)
}) 

export { app, port }