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

app.listen('4392', function () {
    console.log('listening on 4392');
    console.log(process.env.SLACK_BASE);
});
// https://api.slack.com/methods/search.messages
app.get('/auth', (req, res) => {
    var str = process.env.SLACK_BASE + process.env.SLACK_SEARCH_MSG 
    + '?token=xoxp-417514605056-419276193895-419538005029-3bb9bcd489238edd34f2fbb89ec9e9f7'
    + '&count=1'
    + '&query=@here'
    + '&highlights=true';

    axios.get(
        encodeURI(str)    
    ).then(result => {
        var response = {
            channel: result.data.messages.matches[0].channel.name,
            message: result.data.messages.matches[0].text,
        };
        res.json(response);
    });
});