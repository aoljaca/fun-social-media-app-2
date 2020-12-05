const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const session = require('express-session');
var FileStore = require('session-file-store')(session);
const passport = require('passport')
const connectDB = require('./config/db')

dotenv.config({path: './config/config.env'})

require('./config/passport')(passport)

const app = express();
const port = process.env.PORT || 5000;

connectDB()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes/index'))

app.listen(port, () => console.log(`Listening on port ${port}`));