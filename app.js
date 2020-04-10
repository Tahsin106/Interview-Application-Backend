//const A = require('./test');
const express = require('express');
const socket = require('socket.io');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
var server = app.listen(8080, () => console.log('Listening on port 8080'));
var io = socket(server);

var candidateCount = {};

var usernames = {};
var msg = {};

var code = {};
var question = {};
const joinCode = {};

io.on('connect', function (socket) {

    // console.log('Connected '+socket.id);

    socket.on('join', function (data) {
        socket.join(data.roomCode);
    });

    socket.on('join-connect', function (data) {
    
        if (joinCode[data.roomCode]) {
            if (msg[data.roomCode].length) socket.emit('logs', msg[data.roomCode]);
            if (code[data.roomCode].length) socket.emit('code-rcv', {
                code: code[data.roomCode]
            });
            if (question[data.roomCode].length) socket.emit('question-rcv', {
                question: question[data.roomCode]
            });

            io.sockets.to(data.roomCode).emit('online-users', usernames[data.roomCode]);
        }
    });

    socket.on('chat', function (data) {

        msg[data.roomCode].push(data);

        io.sockets.to(data.roomCode).emit('chat', data);
    });

    socket.on('code', function (data) {
        code[data.roomCode] = data.code;
        socket.broadcast.to(data.roomCode).emit('code-rcv', data);
    });

    socket.on('question', function (data) {
        question[data.roomCode] = data.question;
        socket.broadcast.to(data.roomCode).emit('question-rcv', data);
    });

    socket.on('disconnect', function () {
        //console.log('Disconnected '+socket.id);
    });
});


app.get('/join_room', function (req, res) {

    if (req.query.role == "Admin") {

        if (joinCode[req.query.code]) {
            
            res.status(403).send('This Room exists already');
        }
        else {
            candidateCount[req.query.code] = 0;
            usernames[req.query.code] = [{username:req.query.username,role:req.query.role}];
            msg[req.query.code] = [];
            code[req.query.code] = '';
            question[req.query.code] = '';
            joinCode[req.query.code] = true;

            res.status(201).send(true);
        }
    }
    else if (req.query.role == "Interviewer") {
        if (!joinCode[req.query.code]) {
            res.status(403).send("This Room Doesn't Exist");
        }
        else {
            if (!usernames[req.query.code].find((data) => data.username == req.query.username)) {
                usernames[req.query.code].push({ username: req.query.username, role: req.query.role });
                res.status(201).send(true);
            }
            else {
                res.status(403).send('This username has already been taken in this Room');
            }
        }
    }
    else if (req.query.role == "Candidate") {
        if (!joinCode[req.query.code]) {
            res.status(403).send("This Room Doesn't Exist");
        }
        else {
            if (candidateCount[req.query.code] >= 1) res.status(403).send('At Most 1 Candidate can enter 1 Room');
            else if (!usernames[req.query.code].find((data) => data.username == req.query.username)) {
                usernames[req.query.code].push({ username: req.query.username, role: req.query.role });
                candidateCount[req.query.code] = 1;
                res.status(201).send(true);
            }
            else {
                res.status(403).send('This username has already been taken in this Room');
            }
        }
    }

});

app.get('/logout', function (req, res) {

    if (req.query.role == "Admin") {
        delete (candidateCount[req.query.code]);
        delete (usernames[req.query.code]);
        delete (msg[req.query.code]);
        delete (code[req.query.code]);
        delete (question[req.query.code]);
        delete (joinCode[req.query.code]);
    }
    else {
        if(joinCode[req.query.code])
        {
            usernames[req.query.code] = usernames[req.query.code].filter(data => data.username != req.query.username);
            if (req.query.role == "Candidate") candidateCount[req.query.code] = 0;
        }
    }

    res.status(200).send(true);
});

app.get('/validate', function (req, res) {
    if(!joinCode[req.query.code]) res.status(403).send(false);
    else if (usernames[req.query.code].find((data) => data.username == req.query.username)) {
        res.status(200).send(true);
    }
    else {
        res.status(403).send(false);
    }
});