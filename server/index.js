require('dotenv').config();
const express = require('express');
const massive = require('massive');
const { json } = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 3001;
const controller = require('./controller');
//setup
const app = express();
app.use(json());
app.use(cors());
massive(process.env.CONNECTION_STRING)
	.then((dbInstance) => app.set('db', dbInstance))
	.catch((err) => console.log(err));
//endpoints

app.get('/api/posts', controller.getPosts);
app.get('/api/reply/:id', controller.getReply);

app.post('/api/post', controller.newPost);

app.get('/api/isliked/:id/:user', controller.isLiked);
app.post('/api/addlike/:id', controller.addLike);
app.delete('/api/deletelike/:id', controller.deleteLike);

app.listen(port, () => {
	console.log(`Port ${port} is listening...`);
});
