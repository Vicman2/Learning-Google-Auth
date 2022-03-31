import express from 'express';
import session from 'express-session';
import passport from 'passport'
import  passportGogleAuth from 'passport-google-oauth'
import dotenv from "dotenv"
import { CONSTANTS } from './constants';
dotenv.config();
const app = express();
 
app.set('view engine', 'ejs');


app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));

app.get('/', function(req, res) {
    res.render('pages/auth/login');
});

let  userProfile;
app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});
   
passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

const   GoogleStrategy = passportGogleAuth.OAuth2Strategy;

passport.use(new GoogleStrategy({
    clientID: CONSTANTS().GOOGLE_CLIENT_ID,
    clientSecret: CONSTANTS().GOOGLE_CLIENT_SECRET,
    callbackURL: CONSTANTS().GOOGLE_CALLBACK
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
  
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
  
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
});
let theJson = JSON.stringify({"id":"113295168803205715844","displayName":"Offordile Victor","name":{"familyName":"Victor","givenName":"Offordile"},"emails":[{"value":"offordilevictor@gmail.com","verified":true}],"photos":[{"value":"https://lh3.googleusercontent.com/a-/AOh14GhL9WwMbdRSGIO1mfFF4vKiD9rQ57DB2oWQ60oGDw=s96-c"}],"provider":"google","_raw":"{\n  \"sub\": \"113295168803205715844\",\n  \"name\": \"Offordile Victor\",\n  \"given_name\": \"Offordile\",\n  \"family_name\": \"Victor\",\n  \"picture\": \"https://lh3.googleusercontent.com/a-/AOh14GhL9WwMbdRSGIO1mfFF4vKiD9rQ57DB2oWQ60oGDw\\u003ds96-c\",\n  \"email\": \"offordilevictor@gmail.com\",\n  \"email_verified\": true,\n  \"locale\": \"en\"\n}","_json":{"sub":"113295168803205715844","name":"Offordile Victor","given_name":"Offordile","family_name":"Victor","picture":"https://lh3.googleusercontent.com/a-/AOh14GhL9WwMbdRSGIO1mfFF4vKiD9rQ57DB2oWQ60oGDw=s96-c","email":"offordilevictor@gmail.com","email_verified":true,"locale":"en"}})
console.log(JSON.parse(theJson))
 
 

 
const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));
