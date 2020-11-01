const path = require('path')
const express = require("express")
const hbs = require("hbs")
require('./db/mongoose')
const bodyParser = require("body-parser")
const Blog = require('./models/blog')

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({extended: true}))

const publicDirectoryPath = path.join(__dirname, '../public')
// const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
// app.set('views', 'viewsPath')
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Blogs',
        name: 'Not Anyone'
    })
})

app.get('/compose', (req, res) => {
    res.render('compose', {
      title: 'Blogging',
      name: 'Not Anyone'  
    })
})

app.post("/compose", async (req, res) => {
  const blog = new Blog({
        "title": req.body.postTitle,
        "body": req.body.postBody
    })

  try {
        await blog.save()
        res.status(201).redirect("/")
    } catch (e) {
        res.status(400).send(e)
    }

})

// app.post("/compose", function(req, res){
//   const post = {
//     title: req.body.postTitle,
//     content: req.body.postBody
//   };

//   console.log(post);

// //   res.redirect("/");

// });


app.listen(port, () => {
    console.log('Server running on port ' + port);
})
