require("dotenv").config()
const express = require("express")
const compression = require("compression")
const app = express()
app.use(compression())
const readml100k = require('./controllers/ml100kreader/ml100kreader')
readml100k.readml100kinit()
app.get("/ml100k/get", (req, res)=>{
    res.status(200).json({
        dataset : "ml100k",
        timestamp : Date.now(),
        data : readml100k.readml100k()
    })
})
app.listen(process.env.PORT, ()=>{
    console.log("encoder started on "+process.env.PORT)
})