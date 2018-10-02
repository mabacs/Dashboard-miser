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
// get messages with @here
app.get('/here', (req, res) => {
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

// https://api.slack.com/methods/conversations.list
// get channels info
// app.get('/channel', (req, res) => {
//     var str = process.env.SLACK_BASE + process.env.SLACK_CHANNELS
//     + '?token=xoxp-417514605056-419276193895-419538005029-3bb9bcd489238edd34f2fbb89ec9e9f7'

//     axios.get(
//         encodeURI(str)    
//     ).then(result => {        
//         res.json(result.data.channels);
//     });
// });

// general id = CCAB2Q0P7
// random id = CCB7XG6TH

// https://api.slack.com/methods/channels.history
// get messages from channel 'general'
app.get('/channel', (req, res) => {
    var str = process.env.SLACK_BASE + process.env.SLACK_CHANNEL_MSG
    + '?token=xoxp-417514605056-419276193895-419538005029-3bb9bcd489238edd34f2fbb89ec9e9f7'
    + '&channel=CCAB2Q0P7'
    + '&count=3'

    axios.get(
        encodeURI(str)    
    ).then(result => {        
        res.json(result.data.messages);        
    });
});


// SPOTIFY

var client_id = '5487af725f244e75867da5c13c76edf7';
var client_secret = 'ef4ae0b316de4fdd9bd991cc959b4685';
var redirect_uri = '';

app.get('/spotify', (req, res) => {
    var str = process.env.SPOTIFY_AUTH
    + '?client_id=' + client_id
    + '&redirect_uri=http://127.0.0.1:4392/spotify'
    + '&response_type=token'
    + '&currently-playing'

    axios.get(
        encodeURI(str)    
    ).then(result => {
        res.json(result.data);        
    });
});