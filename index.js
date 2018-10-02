require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Miser Test');
});

app.get('/github_info', (req, res) => {
    axios.get(

    ).then(res.send(ndssj))
});

app.listen('4390', function () {
    console.log('listening on 4390');
    console.log(process.env.SLACK_BASE);
});

app.get('/auth', (req, res) => {
    var str = process.env.SLACK_BASE + process.env.SLACK_SEARCH_MSG 
    + '?token=xoxp-417514605056-419276193895-419538005029-3bb9bcd489238edd34f2fbb89ec9e9f7'
    + '&query=@here'
    + '&highlights=true';

    axios.get(
        encodeURI(str)    
    ).then(result => {
        console.log('@here: ', result);
        res.json(result.data);
    });
    
});
