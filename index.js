require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');
const querystring = require('querystring');

var slackToken = '';

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Miser Test');
});

app.listen('4392', function () {
    console.log('listening on 4392');
});


app.get('/auth', (req, res) => {
    console.log('auth');
    
    let str = process.env.SLACK_AUTH 
        + '?client_id='
        + process.env.SLACK_CLIENT_ID
        + '&scope='
        + process.env.SLACK_SCOPE_SEARCH_READ + ' ' 
        + process.env.SLACK_SCOPE_CHANNEL_READ + ' '
        + process.env.SLACK_SCOPE_CHANNEL_HISTORY;
            
    res.redirect(301, encodeURI(str));
});

app.get('/auth/code', (req, res) => {
    let data = querystring.stringify({
        client_id: encodeURI(process.env.SLACK_CLIENT_ID),
        client_secret: encodeURI(process.env.SLACK_CLIENT_SECRET),
        code: encodeURI(req.query.code),
    });

    axios.post(process.env.SLACK_AUTH_ACCESS, data, {
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        }
    }).then(response => {
        slackToken = response.data.access_token;
        res.send(response.data.access_token);
    });
});

// https://api.slack.com/methods/search.messages
// get messages with @here
app.get('/here', (req, res) => {
    var str = process.env.SLACK_BASE + process.env.SLACK_SEARCH_MSG 
    + '?token=' + slackToken
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
})


// https://api.slack.com/methods/conversations.list
// get channels info
// app.get('/channel', (req, res) => {
//     var str = process.env.SLACK_BASE + process.env.SLACK_CHANNELS
//     + '?token=' + slackToken

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
    + '?token=' + slackToken
    + '&channel=CCAB2Q0P7'
    + '&count=3'

    axios.get(
        encodeURI(str)    
    ).then(result => {        
        res.json(result.data.messages);        
    });
});
