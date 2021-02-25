require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const MongoStore = require('connect-mongo');
const session = require('express-session');
const passport = require('passport');
const discordStrategy = require('./strategies/discordStrategy');
const db = require('./database/database')
const path = require('path')
const mongoose = require('mongoose');

db.then(() => console.log('Connected to MongoDB')).catch(err => console.log(err))

//Routes
const authRoute = require('./routes/auth')
const dashboardRoute = require('./routes/dashboard')

//Session
app.use(session({
    secret: 'some random secret',
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    saveUninitialized: false,
    resave: false,
    name: 'discord.oauth2',
}))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Middleware Routes
app.use('/auth', authRoute);
app.use('/dashboard', dashboardRoute)

app.get('/', isAuthorized, (req, res) => {
    res.render('home', {
        users: [
            { name: 'Chris', email: 'chris@gmail.com'},
            { name: 'Bryan', email: 'bryan@gmail.com'},
            { name: 'Eric', email: 'eric@gmail.com'},
            { name: 'David', email: 'david@gmail.com'},
            { name: 'Daniel', email: 'daniel@gmail.com'},
        ]
    })
})

function isAuthorized(req, res, next) {
    if(req.user) {
        console.log('User is logged in');
        res.redirect('/dashboard');
    }
    else {
        console.log('User is not logged in');
        next();
    }
}

app.listen(PORT, () => {
    console.log(`Now listening to requests on port ${PORT}`);
})  