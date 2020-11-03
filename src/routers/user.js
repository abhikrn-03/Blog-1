const express = require('express')
const User = require('../models/user')
const Blog = require('../models/blog')
const auth = require('../middleware/auth')
const router = new express.Router()

let posts = []

router.get('/home', auth, async (req, res) => {

    try{
        posts = await Blog.find({})
        await res.render('home', {
            title: 'Blogs',
            name: req.user,
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

router.post('/users/signUp', async (req, res) => {
    const user = new User({
        'name': req.body.userName,
        'email': req.body.userEmail,
        'password': req.body.userPassword,
        'gender': req.body.userGender,
        'penName': req.body.userPen,
        'age': req.body.userAge
    })

    try {
        await user.save()
        const token = await user.generateAuthToken()
        // res.status(201).send({ user, token} )
        res.status(201).redirect('/home')
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/signIn', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.loginEmail, req.body.loginPassword)
        const token = await user.generateAuthToken()
        // res.send({ user, token })
        res.redirect('/home')
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router
