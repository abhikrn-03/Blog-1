const path = require('path')
const express = require("express")
const bodyParser = require("body-parser")
// const hbs = require("hbs")
const ejs = require('ejs')
require('./db/mongoose')
const _ = require("lodash")
const Blog = require('./models/blog')

const app = express()
const port = process.env.PORT || 3000
app.use(express.json())

app.use(bodyParser.urlencoded({extended: true}))

const publicDirectoryPath = path.join(__dirname, '../public')
// const viewsPath = path.join(__dirname, '../templates/views')
// const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'ejs')
// app.set('view engine', 'hbs')
// app.set('views', 'viewsPath')
// hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))

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

app.get('/home', async (req, res) => {

    try {
        posts = await Blog.find({})
        await res.render('home', {
        title: 'Blogs',
        name: 'Not Anyone',
        posts: posts
        })
    } catch (e) {
        res.status(500).send(e)
    }
})

app.get('/compose', async (req, res) => {
    
    try {
        await res.render('compose', {
        title: 'Blogging',
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

app.post("/compose", async (req, res) => {
  const blog = new Blog({
        "title": req.body.postTitle,
        "body": req.body.postBody
    })

  try {
        await blog.save()
        posts = await Blog.find({})
        res.status(201).redirect("/home")
    } catch (e) {
        res.status(400).send(e)
    }

})

app.get("/blogs/:blogName", async (req, res) => {
  const requestedTitle = _.lowerCase(req.params.blogName);

  try {
    posts.forEach( async (blog) => {
    const storedTitle = _.lowerCase(blog.title);

    try {
        if (storedTitle === requestedTitle) {
            await res.render("post", {
            title: blog.title,
            body: blog.body,
            name: 'Not Anyone'
            })
        }
    } catch (e) {
        res.status(500).send(e)
    }
  })
  } catch (e) {
    res.status(404).send(e)
  }
})

app.listen(port, () => {
    console.log('Server running on port ' + port);
})
