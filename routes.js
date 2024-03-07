
const passport = require('passport');
const bcrypt = require('bcrypt');

// middleware function to ensure users are authenticated
function ensureAuthenticated(req,res,next){
    return req.isAuthenticated() ? next() : res.redirect('/')
  }
module.exports = (app,myDataBase) => {
  app.route('/').get((req, res) => {
    res.render('index',
    {title: 'Connected to database',
     message: 'Please log in',
     showLogin:true,
     showRegistration:true,
     showSocialAuth:true
      })   
    });
    app.route(`/auth/github`).get(passport.authenticate('github'))
    app.route('/auth/github/callback').get(passport.authenticate('github',{failureRedirect:true}),(req,res)=>{
        res.redirect('/profile')
    })

    // POST to /login
    app.route('/login').post(passport.authenticate('local',{failureRedirect:'/'}),function(req,res){
      res.redirect('/profile');
    })
    // GET login
    app.route('/profile').get(ensureAuthenticated,function(req,res){
      res.render('profile',{username:req.user.username})
    })
    app.route('/register').post((req,res,next)=>{
      const git = bcrypt.hashSync(req.body.password, 12);
      myDataBase.findOne({username:req.body.username},(err,user)=>{
        if(err){
          next(err);
        }
        else if(user){
          res.redirect('/');
        }
        else{
          myDatabase.insertOne({
            username:req.body.username,
            password: hash
          },(err,doc)=>{
            if(err){
              res.redirect('/')
            }
            else{
              next(null, doc.ops[0])
            }
          })
        }
      })
    })
    app.route('/logout').get((req,res)=>{
      req.logout();
      res.redirect('/')
    })
    // 404 Not Found
    app.use((req,res,next)=>{
      res.status(404)
      .type('text')
      .send('Not Found')
    })
}