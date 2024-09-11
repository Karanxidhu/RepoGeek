require('dotenv').config()
const express = require('express');
const router = express.Router();
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const session = require('express-session');
const passport = require("passport");
var GitHubStrategy = require('passport-github2').Strategy;
const User = require('../model/User')
const crypto = require('crypto');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/middleware');

const JWT_SECRET = process.env.JWT_SECRET
const algorithm = process.env.CRYPTO_ALGO
const secretKey = process.env.CRYPTO_SECRET
const googleSecret = process.env.GOOGLE_SECRET
const googleClient = process.env.GOOGLE_CLIENT
const githubClient = process.env.GITHUB_CLIENT
const githubSecret = process.env.GITHUB_SECRET
const FRONT_ENT_URL = process.env.FRONT_ENT_URL
const BACK_END_URL = process.env.BACK_END_URL

const iv = crypto.randomBytes(16);

const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const decrypt = (hash) => {
    const [iv, encryptedText] = hash.split(':');
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedText, 'hex')), decipher.final()]);

    return decrypted.toString();
};

router.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}));

router.use(passport.initialize());
router.use(passport.session());

passport.use(
    new OAuth2Strategy({
        clientID: googleClient,
        clientSecret: googleSecret,
        callbackURL: `${BACK_END_URL}/api/auth/google/callback`,
        scope: ["profile", "email"]
    },
    async function (request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
    })
)

passport.use(new GitHubStrategy({
    clientID: githubClient,
    clientSecret: githubSecret,
    callbackURL: "/api/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    profile.accessToken = accessToken;
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user, done) => {
    done(null, user);
});


router.get('/', async (req, res) => {
    res.send("<a href='/api/auth/google'>login</a>")
})

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/api/auth/success',
        failureRedirect: '/api/auth/failure'
    }));

router.get('/success', async (req, res) => {
  try {
      console.log(req.user)
         if (req.user) {
             const payload = req.user;
             let user
             if(payload.provider == 'google'){
              user = await User.findOne({ googleId: payload.id });
             }else{
                 user = await User.findOne({ githubId: payload.id });
             }
             console.log(user)
             if (user) {
                 const data = {
                     user: {
                         id: user.id
                     }
                 }
                 console.log("welcome back")
                 const authtoken = jwt.sign(data, JWT_SECRET);
                 return res.redirect(`${FRONT_ENT_URL}/login?token=`+ authtoken);
             } else {
                if(payload.provider == 'google'){
                  user = await User.create({
                      name: payload?.displayName,
                      email: payload?.email,
                      googleId: payload?.id,
                      provider: 'google'
                  });
                }else{
                  user = await User.create({
                      name: payload?.displayName,
                      githubId: payload?.id,
                      provider: 'github',
                      accessToken: encrypt(payload?.accessToken),
                      githubUsername: payload?.username
                  });
                }
                 
                 const data = {
                     user: {
                         id: user.id
                     }
                 }
                 console.log("welcome new")
                 const authtoken = jwt.sign(data, JWT_SECRET);
                 return res.redirect(`${FRONT_ENT_URL}/login?token=`+ authtoken);
             }
         }
     } catch (error) {
        console.log(error)
        return res.json({ error })
     }
})

  router.get('/failure', async (req, res) => {
      res.json({ error: 'error occurred' })
  })

  router.get('/github',
    passport.authenticate('github', { scope: [ 'user:email', 'repo' ] }));
  
  router.get('/github/callback', 
    passport.authenticate('github', {
      successRedirect: '/api/auth/success',
      failureRedirect: '/api/auth/failure' }),
   );
  
  function ensureAuthenticated(req, res, next) {
      if (req.isAuthenticated()) {
          return next();
      }
      res.redirect('/');
  }

  router.get('/user', fetchuser, async (req, res) => {
    console.log('hitting')
    try {
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(500).send('Failed to find user');
        }
        return res.json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Failed to fetch user');
    }
  })

  
module.exports = router