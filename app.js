var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const mysql = require('mysql2');
var app = express();

app.use(cors());

require('dotenv').config();

app.use(express.json());

const dbConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 3306
});

dbConnection.connect((error) => {
    if (error) {
        console.error('Database connection failed:', error.stack);
        return;
    }
    console.log('Connected to database.');
});

var usersRouter = require('./routes/users');
var profilesRouter = require('./routes/profiles');
var mealsRouter = require('./routes/meals');

app.get("/api", (req, res) => {
   res.json({ message: "Hello from Api" });
});

app.use('/api/users', usersRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/meals', mealsRouter);

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'client', 'dist')));
app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const port = 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
