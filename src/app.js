const path = require('path')
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require('ejs')
require('./db/mongoose')
const _ = require("lodash")
const userRouter = require('./routers/user')
const blogRouter = require('./routers/blog')

const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static(publicDirectoryPath))
app.use(userRouter)
app.use(blogRouter)

let posts = []

app.get('', async (req, res) => {

    try {
        await res.render('index', {
            title: 'Your personal diary',
            name: 'Not Anyone'
        }) 
    } catch (e) {
        res.status(500).send(e)
    }
})

app.get('/about', async (req, res) => {
    
    try {
        await res.render('about', {
        title: 'About',
        name: 'Not Anyone'  
    })
    } catch (e) {
        res.status(500).send(e)
    }
})

app.get('/contact', async (req, res) => {
    
    try {
        await res.render('contact', {
        title: 'Contact',
        name: 'Not Anyone'  
    })
    } catch (e) {
        res.status(500).send(e)
    }
})

app.listen(port, () => {
    console.log('Server running on port ' + port);
})
