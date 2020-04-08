//const A = require('./test');
const express = require('express');
const socket = require('socket.io');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
var server = app.listen(8080, () => console.log('Listening on port 8080'));
var io = socket(server);

var candidateCount = 0;
var usernames = [];

var msg = [];
var code = '';
var question = '';

io.on('connect', function (socket) {

    console.log('Connected '+socket.id);
    if(msg.length) socket.emit('logs', msg);
    if(code.length) socket.emit('code-rcv',{
        code: code
    });
    if(question.length) socket.emit('question-rcv',{
        question: question
    });

    io.sockets.emit('online-users',usernames);

    socket.on('chat', function (data) {

        msg.push(data);

        io.sockets.emit('chat', data);
    });

    socket.on('code', function (data) {
        code = data.code;
        socket.broadcast.emit('code-rcv', data);
    });

    socket.on('question',function(data){
        question = data.question;
        socket.broadcast.emit('question-rcv', data);
    });

    socket.on('disconnect', function () {
        //console.log('Disconnected '+socket.id);
    });
});

const joinCode = '01688';
//usernames.push({username:req.query.username,role:req.query.role});

app.get('/join',function(req, res){
    if (!usernames.find((data) => data.username == req.query.username) && req.query.code == joinCode) {
        usernames.push({username:req.query.username,role:req.query.role});
        res.status(200).send(true);
    }
    else {
        res.status(403).send(false);
    }
});

app.get('/logout',function(req, res){
    usernames = usernames.filter(data=>data.username!=req.query.username);
    res.status(200).send(true);
});

app.get('/validate', function (req, res) {
    //console.log(req.query);
    //console.log(req.query);
    if (req.query.code == joinCode && usernames.find((data) => data.username == req.query.username)) {
        res.status(200).send(true);
    }
    else {
        res.status(403).send(false);
    }
});


