const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Miser Test');
});

app.listen('4390', function () {
    console.log('listening on 4390');
});
