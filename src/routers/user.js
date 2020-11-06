const express = require('express')
const passport = require('passport')
const User = require('../models/user')
const Blog = require('../models/blog')
const connectEnsureLogin = require('connect-ensure-login')
const router = new express.Router()

let posts = []

router.get('/home', connectEnsureLogin.ensureLoggedIn('/users/login'), async (req, res) => {
    try{
        posts = await Blog.find({email: req.user.email})
        await res.render('home', {
            title: 'Blogs',
            name: req.user.email,
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

router.post('/users/signUp', passport.authenticate('local-signup', {
    successRedirect: '/home',
}))

router.post('/users/signIn', passport.authenticate('local-login', {
    successRedirect: '/home',
    successMessage: true
}));

router.get('/users/google', passport.authenticate('google-auth', {
    scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email']
}))

router.get('/auth/google/BlogBower', passport.authenticate('google-auth', {
    successRedirect: '/home'
}))

router.get('/users/logout', connectEnsureLogin.ensureLoggedIn('/users/login'), (req, res) => {
    req.logout()
    res.redirect('/')
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

router.post('/users/editProfile', connectEnsureLogin.ensureLoggedIn('/users/login'), async(req, res) => {
    _id = req.user._id
    reqBody = req.body
    if(reqBody.name){
        try{
            var newUser = await User.findByIdAndUpdate(_id, { name: reqBody.name })
        } catch (e) {
            return res.status(400).send(e)
        }
    }
    if(reqBody.penName){
        try{
            var newUser = await User.findByIdAndUpdate(_id, { penName: reqBody.penName })
        } catch (e) {
            return res.status(400).send(e)
        }
    }
    if(reqBody.age){
        try{
            var newUser = await User.findByIdAndUpdate(_id, { age: reqBody.age })
        } catch (e) {
            return res.status(400).send(e)
        }
    }
    if(reqBody.gender){
        try{
            var newUser = await User.findByIdAndUpdate(_id, { gender: reqBody.gender })
        } catch (e) {
            return res.status(400).send(e)
        }
    }
    return res.redirect('/users/editProfile')
})

module.exports = router
