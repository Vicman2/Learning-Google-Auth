"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth_1 = __importDefault(require("passport-google-oauth"));
const dotenv_1 = __importDefault(require("dotenv"));
const constants_1 = require("./constants");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.use((0, express_session_1.default)({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));
app.get('/', function (req, res) {
    res.render('pages/auth/login');
});
let userProfile;
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));
passport_1.default.serializeUser(function (user, cb) {
    cb(null, user);
});
passport_1.default.deserializeUser(function (obj, cb) {
    cb(null, obj);
});
const GoogleStrategy = passport_google_oauth_1.default.OAuth2Strategy;
passport_1.default.use(new GoogleStrategy({
    clientID: (0, constants_1.CONSTANTS)().GOOGLE_CLIENT_ID,
    clientSecret: (0, constants_1.CONSTANTS)().GOOGLE_CLIENT_SECRET,
    callbackURL: (0, constants_1.CONSTANTS)().GOOGLE_CALLBACK
}, function (accessToken, refreshToken, profile, done) {
    userProfile = profile;
    return done(null, userProfile);
}));
app.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/error' }), function (req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
});
let theJson = JSON.stringify({ "id": "113295168803205715844", "displayName": "Offordile Victor", "name": { "familyName": "Victor", "givenName": "Offordile" }, "emails": [{ "value": "offordilevictor@gmail.com", "verified": true }], "photos": [{ "value": "https://lh3.googleusercontent.com/a-/AOh14GhL9WwMbdRSGIO1mfFF4vKiD9rQ57DB2oWQ60oGDw=s96-c" }], "provider": "google", "_raw": "{\n  \"sub\": \"113295168803205715844\",\n  \"name\": \"Offordile Victor\",\n  \"given_name\": \"Offordile\",\n  \"family_name\": \"Victor\",\n  \"picture\": \"https://lh3.googleusercontent.com/a-/AOh14GhL9WwMbdRSGIO1mfFF4vKiD9rQ57DB2oWQ60oGDw\\u003ds96-c\",\n  \"email\": \"offordilevictor@gmail.com\",\n  \"email_verified\": true,\n  \"locale\": \"en\"\n}", "_json": { "sub": "113295168803205715844", "name": "Offordile Victor", "given_name": "Offordile", "family_name": "Victor", "picture": "https://lh3.googleusercontent.com/a-/AOh14GhL9WwMbdRSGIO1mfFF4vKiD9rQ57DB2oWQ60oGDw=s96-c", "email": "offordilevictor@gmail.com", "email_verified": true, "locale": "en" } });
console.log(JSON.parse(theJson));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listening on port ' + port));
//# sourceMappingURL=app.js.map