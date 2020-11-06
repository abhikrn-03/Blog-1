const express = require('express')
const passport = require('passport')
const User = require('../models/user')
const Blog = require('../models/blog')
const connectEnsureLogin = require('connect-ensure-login')
const _ = require('lodash')
const router = new express.Router()

let posts = []

router.get('/home/:penName', async (req, res) => {
    try{
        penName = req.params.penName
        posts = await Blog.find({penName: penName})
        await res.render('home', {
            title: 'Blogs',
            name: penName,
            posts: posts
        })
    } catch(e){
        res.status(500).send(e)
    }
})

router.get('/users/login', async (req, res) => {
    try {
        await res.render('login', {
            title: 'About',
            name: 'Not Anyone'
        })
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/signUp', passport.authenticate('local-signup', {}), (req, res) => {
    res.redirect('/home/'+req.user.penName)
})

router.post('/users/signIn', passport.authenticate('local-login', {}), (req, res) => {
    res.redirect('/home/' + req.user.penName)
});

router.get('/users/google', passport.authenticate('google-auth', {
    scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email']
}))

router.get('/auth/google/BlogBower', passport.authenticate('google-auth', {
}), (req, res) => {
    if(req.user.penName){
        return res.redirect('/home/' + req.user.penName)
    }
    res.redirect('/users/setupProfile')
})

router.get('/users/logout', connectEnsureLogin.ensureLoggedIn('/users/login'), (req, res) => {
    req.logout()
    res.redirect('/')
})

router.get('/users/setupProfile', connectEnsureLogin.ensureLoggedIn('/users/login'), async (req, res) => {
    try {
        await res.render('setupProfile', {
            displayName: req.user.name
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/setupProfile', connectEnsureLogin.ensureLoggedIn('/users/login'), async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { penName: req.body.penName  })
        if(req.body.age){
            await User.findByIdAndUpdate(req.user._id, { age: req.body.age })
        }
        if(req.body.gender){
            await User.findByIdAndUpdate(req.user._id, { gender: req.body.gender })
        }
        return res.redirect('/home/' + req.body.penName)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/users/editProfile', connectEnsureLogin.ensureLoggedIn('/users/login'), async (req, res) => {
    try{
        const user = await User.findById(req.user._id)
        await res.render('editProfile',{
            name: user.name,
            age: user.age,
            gender: user.gender,
            penName: user.penName
        })
    } catch (e){
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


router.post('/users/editProfile', connectEnsureLogin.ensureLoggedIn('/users/login'), async(req, res) => {
    _id = req.user._id
    reqBody = req.body
    if(reqBody.name){
        try{
            await User.findByIdAndUpdate(_id, { name: reqBody.name })
        } catch (e) {
            return res.status(400).send(e)
        }
    }
    if(reqBody.age){
        try{
            await User.findByIdAndUpdate(_id, { age: reqBody.age })
        } catch (e) {
            return res.status(400).send(e)
        }
    }
    if(reqBody.gender){
        try{
            await User.findByIdAndUpdate(_id, { gender: reqBody.gender })
        } catch (e) {
            return res.status(400).send(e)
        }
    }
    return res.redirect('/users/editProfile')
})

module.exports = router
