const express = require('express')
const User = require('../models/user')
const router = new express.Router()

let posts = []

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
    const user = new user({
        'name': req.body.userName,
        'email': req.body.userEmail,
        'password': req.body.userPassword,
        'gender': req.body.userGender,
        'penName': req.body.userPen,
        'age': req.body.userAge
    })

    try {
        await user.save()
        res.status(201).redirect('/home')
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/signIn', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.loginEmail, req.body.loginPassword)
        res.redirect('/home')
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router
