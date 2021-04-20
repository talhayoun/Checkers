const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("./models/usersSchema");

passport.serializeUser(function(user, done) {
    console.log("@@@", user)
    // const token = await user.activateToken();
    //     res.cookie("token_id", token).send({username: user.username});
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

//   const token = await user.activateToken();
//   res.cookie("token_id", token).send({username: user.username});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    console.log(profile)
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    let getUser = await User.findOne({googleID: profile.id})
    if(!getUser){
        let user = await new User({
            googleID: profile.id,
            username: profile._json.name,
            email: profile._json.email
        })
        await user.save()
        return cb(null, user);
    }else{
        return cb(null, getUser);
    }
  }
));