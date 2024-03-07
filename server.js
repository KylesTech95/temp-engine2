'use strict';
const { ObjectID } = require('mongodb');
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const app = express();

// express session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave:true,
  saveUninitialized:true,
  cookie:{secure:false}
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.set('view engine','pug')
app.set('views','./views/pug')
fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


myDB(async client =>{
  const myDataBase = await client.db('database').collection('users');
  app.route('/').get((req, res) => {
    res.render('index',
    {title: 'Connected to database',
     message: 'Please log in',
     showLogin:true
      })   
    });

    // POST to /login
    app.route('/login').post(passport.authenticate('local',{failureRedirect:'/'}),function(req,res){
      res.redirect('/profile');
    })
    // GET login
    app.route('/profile').get(function(req,res){
      res.render('profile')
    })






    // use LocalStrategy
    passport.use(new LocalStrategy((username,password,done)=>{
      myDataBase.findOne({username:username},(err,user)=>{
        console.log(`User ${username} attempted to log in.`);
        let res;
        switch(true){
          case err:
          res = done(err);
          break;
          case !user:
          res = done(null,false);
          break;
          case password !== user.password:
          res = done(null,false);
          default:
          res = done(null,user);
          break;
        }
        return res;
      })
    }))    
    // serial & deserialize users
    passport.serializeUser((user,done)=>{
    done(null,user._id);
    })
    passport.deserializeUser((id,done)=>{
    myDatabase.findOne({_id: new ObjectID(id)},(doc,done)=>{
    done(null,doc)
    })
    })
    // POST login
  app.route('/login').post({failureRedirect:'/'},(req,res)=>{

  })
  
})
.catch(err=>{
  app.route('/').get((req,res)=>{
    res.render('index',{title:e,message:'Unable to connect to database'})
  })
})

// app.listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
