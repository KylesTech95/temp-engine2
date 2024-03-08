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
            myDataBase.findOneAndUpdate(
              {id:profile.id},
              {
              $setOnInsert:{
                username:profile.username,
                name:profile.displayName||`John Doe`,
                photo: profile.photos[0].value||``,
                email:Array.isArray(profile.email)?profile.emails[0].value:'no Public email',
                created_on: new Date(),
                provider: profile.provider||''
              },
              $set: {
                last_login:newDate()
              },
              $inc:{
                login_count:1
              }
            },
            {upsert:true,new:true},
            (err,doc)=>{
              return cb(null,doc.value)
            }
            )


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