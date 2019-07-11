const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();

const server = require('http').Server(app); //http
const io = require('socket.io')(server); // websocket

mongoose.connect('mongodb+srv://maturana:showman10!@cluster0-dna91.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
});

//all requests after this will have access of req.io
app.use((req, res, next) => {
    req.io = io;

    next(); // continue next routes
})

//all urls from different IPs and server can access this backend
app.use(cors());

//everytime we access the route /files, we access the folder resized
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')));

app.use(require('./routes'));

server.listen(3333);
