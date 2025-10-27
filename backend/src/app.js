const express = require('express');
const routes = require('./routes');
const session = require('express-session');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, sameSite: 'lax' }
  }));


app.use(express.json());
app.use('/api', routes);
app.use('/uploads', express.static('uploads'));

module.exports = app;