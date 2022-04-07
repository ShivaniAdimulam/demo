const express = require('express');
var bodyParser = require('body-parser');

const route = require('./routes/route.js');
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://Prasoon:nKTyhNdAfRpxMY7N@cluster0.vjjsq.mongodb.net/Prasoon001?retryWrites=true&w=majority", {useNewUrlParser: true ,  useUnifiedTopology: true })
    .then(() => console.log('mongodb is Conected'))
    .catch(err => console.log(err))

app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
	console.log('Express app running on port ' + (process.env.PORT || 3000))
});


