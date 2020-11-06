const express = require('express')
const Blog = require('../models/blog')
const connectEnsureLogin = require('connect-ensure-login')
const router = new express.Router()
const _ = require('lodash')

let blogs = []

router.get('/compose', connectEnsureLogin.ensureLoggedIn('/users/login'), async (req, res) => {
    try {
        await res.render('compose', {
            title: 'Blogging',
            name: 'Not Anyone',
            blogTitle: null,
            blogBody: null
        })
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/community', async (req, res) => {
    try {
        blogs = await Blog.find({})
        await res.render('community', {
            title: 'They are something more than just blogs..',
            name: "Not Anyone",
            posts: blogs
        })
    } catch(e) {
        res.status(500).send(e)
    }
})

router.post('/compose/', connectEnsureLogin.ensureLoggedIn('/users/login'), async (req, res) => {
    const blog = new Blog({
        'title': req.body.postTitle,
        'body': req.body.postBody,
        'penName': req.user.penName,
    })

    try {
        await blog.save()
        blogs = await Blog.find({})
        res.status(201).redirect('/home/'+req.user.penName)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/compose/:id', connectEnsureLogin.ensureLoggedIn('/users/login'), async (req, res) => {
    try {
        _id = req.params.id
        blog = await Blog.findById(_id)
        var blogTitle = blog.title
        var blogBody = blog.body
        await Blog.deleteOne({_id: _id})
        await res.render('compose', {
            'title': 'Blogging',
            'name': 'Not Anyone',
            'blogTitle': blogTitle,
            'blogBody': blogBody
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/delete/:id', connectEnsureLogin.ensureLoggedIn('/users/login'), async (req, res) => {
    try{
        _id = req.params.id
        await Blog.deleteOne({_id: _id})
        res.redirect('/home/'+req.user.penName)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/blogs/:blogName', async (req, res) => {
    const requestedTitle = _.lowerCase(req.params.blogName)

    try {
        blogs.forEach(async (blog) => {
            const storedTitle = _.lowerCase(blog.title)

            try {
                if (storedTitle === requestedTitle) {
                    await res.render('post', {
                        title: blog.title,
                        body: blog.body,
                        name: 'Not Anyone',
                        _id: blog._id
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