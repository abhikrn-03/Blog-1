const express = require('express')
const Blog = require('../models/blog')
const auth = require('../middleware/auth')
const router = new express.Router()
const _ = require('lodash')

let posts = []

router.get('/compose', async (req, res) => {
    try {
        await res.render('compose', {
            title: 'Blogging',
            name: 'Not Anyone'
        })
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/compose', async (req, res) => {
    const blog = new Blog({
        'title': req.body.postTitle,
        'body': req.body.postBody
    })

    try {
        await blog.save()
        posts = await Blog.find({})
        res.status(201).redirect('/home')
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/blogs/:blogName', async (req, res) => {
    const requestedTitle = _.lowerCase(req.params.blogName)

    try {
        posts.forEach(async (blog) => {
            const storedTitle = _.lowerCase(blog.title)

            try {
                if (storedTitle === requestedTitle) {
                    await res.render('post', {
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

module.exports = router