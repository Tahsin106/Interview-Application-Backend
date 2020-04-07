// const express = require('express');
// const app = express();
// //const A = require('./test');
// app.use(express.json());

// const arr = [
//     { id: 1, title: 'world', body: 'hello world' },
//     { id: 2, title: 'all', body: 'hello all' },
//     { id: 3, title: 'men', body: 'hello men' },
//     { id: 4, title: 'women', body: 'hello women' },
// ];

// app.use('/',function(req, res, next){
//     //console.log('Miidlewire');
//     next();
// });

// app.get('/', (req, res) => {
//     res.send('Hello World');
// });

// app.get('/story', (req, res) => {
//     res.send(arr);
// });

// app.get('/story/:id', (req, res) => {
//     const story = arr.find((val)=> val.id == req.params.id);
    
//     if(!story){
//         res.status(404).send('Not Found');
//     }
//     else{
//         res.send(story);
//     }
// });

// app.post('/story', (req, res) => {
//     const tmp = {
//         id: arr.length+100,
//         title: req.body.title,
//         body: req.body.body
//     }

//     arr.push(tmp);
//     res.send(tmp);
// });

// app.put('/story', (req, res) => {
//     const story = arr.find((val)=> val.id == req.body.id);
    
//     if(!story){
//         res.status(404).send('Not Found');
//     }
//     else{
//         story.title = req.body.title;
//         story.body = req.body.body;
//         res.send(story);
//     }
// });

// app.delete('/story/:id', (req, res) => {
//     const story = arr.find((val)=> val.id == req.params.id);
    
//     if(!story){
//         res.status(404).send('Not Found');
//     }
//     else{
//         const idx = arr.indexOf(story);
//         arr.splice(idx, 1);
//         res.send(story);
//     }
// });

// app.listen(8080, () => console.log('Listening on port 8080'));