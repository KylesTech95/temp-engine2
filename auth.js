const passport = require('passport');
const { ObjectID } = require('mongodb');
const LocalStrategy = require('passport-local');
const GithubStrategy = require('passport-github').Strategy;
module.exports = (app,myDatabase) => {
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
                case !bcrypt.compareSync(password, user.password):
                res = done(null,false);
                default:
                res = done(null,user);
                break;
              }
              return res;
            })
          }))    
        
        //github strategy
        passport.use(new GithubStrategy({
            clientID:process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: '/auth/github/callback'
        },
        function(accessToken, refreshToken, profile, cb) {
            console.log(profile);
            //Database logic here with callback containing your user object
          }))
          // serial & deserialize users
          passport.serializeUser((user,done)=>{
          done(null,user._id);
          })
          passport.deserializeUser((id,done)=>{
          myDataBase.findOne({_id: new ObjectID(id)},(doc,done)=>{
          done(null,doc)
          })
          })  
}