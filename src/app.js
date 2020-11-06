const path = require('path')
const express = require("express")
const passport = require('passport')
const bodyParser = require("body-parser")
const ejs = require('ejs')
require('./db/mongoose')
const _ = require("lodash")
const User = require('./models/user')
const userRouter = require('./routers/user')
const blogRouter = require('./routers/blog')
const expressSession = require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
})
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const app = express()
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static(publicDirectoryPath))
app.use(expressSession)
app.use(passport.initialize())
app.use(passport.session())
app.use(userRouter)
app.use(blogRouter)

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
(req, email, password, done) => {
    process.nextTick(() => {
        User.findOne({'email': email}, (err, user) => {
            if (err){
                return done(err);
            } else {
                var newUser = new User();
                newUser.email = email;
                newUser.password = newUser.generateHash(password);
                newUser.age = req.body.age
                newUser.gender = req.body.gender
                newUser.penName = req.body.penName
                newUser.name = req.body.name
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

    });

}));

passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',

},
(email, password, done) => {
    User.findOne({ 'email' :  email }, (err, user) => {
        if (err)
            return done(err);
        if (!user)
            return done(null, false, {message: 'Incorrect Username of Password'} );
        if (!user.validPassword(password))
            return done(null, false, {message: 'Incorrect Username or Password'});
        return done(null, user);
    });
}));

passport.use('google-auth', new GoogleStrategy({
    clientID: '652219290709-kjebgljvnkriiup29d2g5h5lgml6d123.apps.googleusercontent.com',
    clientSecret: 'JtLsRsi9lhjN49PiHxXiufXb',
    callbackURL: "http://localhost:3000/auth/google/BlogBower"
},
(accessToken, refreshToken, profile, done) => {
    User.findOne({
        'google_id': profile.id
    }, (err, user) => {
        if (err) {
            return done(err)
        }
        if (!user) {
            const newUser = new User({
                'google_id': profile.id,
                'name': profile.displayName,
                'email': profile.emails[0].value
            })
            newUser.save(function(err){
                if(err){
                    throw err
                }
                return done(null, newUser)
            })
        }
        else{
            return done(null, user)
        }
    })
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

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
