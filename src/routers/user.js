const express = require('express')
const passport = require('passport')
const User = require('../models/user')
const Blog = require('../models/blog')
const connectEnsureLogin = require('connect-ensure-login')
const _ = require('lodash')
const router = new express.Router()

let blogs = []

router.get('/profile/:penName', async (req, res) => {
    const penName = req.params.penName
    blogs = await Blog.find({penName: penName})
    try{
        const user = await User.findOne({penName})
        if (req.user==undefined && (user)){
            await res.render('profile', {
            title: 'Blogs',
            name: null,
            penName: null,
            email: null,
            blogs
            })
        }
        else if ((req.user)&& (req.user.penName==penName) && (user)){
            await res.render('home', {
            title: 'Blogs',
            penName: req.user.penName,
            name: req.user.name,
            email: req.user.email,
            blogs
            })
        }
        else if ((req.user)&&(req.user.penName!=penName) && (user)){
            await res.render('profile', {
            title: 'Blogs',
            penName: req.user.penName,
            name: req.user.name,
            email: req.user.email,
            blogs
            }) 
        }
        else {
            await res.render('404', {
            errorMessage: "Sorry, we could not find the Blogger you've requested",
            name: 'Not Anyone' 
            })
        }
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

router.post('/users/signUp', passport.authenticate('local-signup', {}), async (req, res) => {
    try {
        res.redirect('/profile/'+req.user.penName)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/signIn', passport.authenticate('local-login', {}), (req, res) => {
    res.redirect('/profile/' + req.user.penName)
})

router.get('/users/google', passport.authenticate('google-auth', {
    scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email']
}))

router.get('/auth/google/BlogBower', passport.authenticate('google-auth', {
}), (req, res) => {
    if(req.user.penName){
        return res.redirect('/profile/' + req.user.penName)
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
            displayName: req.user.name,
            message: 'A blogger should have a unique Pen Name'
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
        return res.redirect('/profile/' + req.body.penName)
    } catch(e) {
        if (e.codeName == 'DuplicateKey'){
            await res.render('setupProfile', {
            displayName: req.user.name,
            message: 'This Pen Name already exists, try a different Pen Name'
            })
        }
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
