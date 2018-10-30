require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const querystring = require('querystring');
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use(function(_, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});

app.get('/', function (req, res) {
    res.send('<h1>Dashboard Miser!</h1>');
});

app.listen('4392', function () {
    console.log('listening on 4392');
});

// app.get('/auth', (req, res) => {
//     console.log('auth');
    
//     let str = process.env.SLACK_AUTH 
//         + '?client_id='
//         + process.env.SLACK_CLIENT_ID
//         + '&scope='
//         + process.env.SLACK_SCOPE_SEARCH_READ + ' ' 
//         + process.env.SLACK_SCOPE_CHANNEL_READ + ' '
//         + process.env.SLACK_SCOPE_CHANNEL_HISTORY;
            
//     res.redirect(301, encodeURI(str));
// });

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
    }).then(resAxios => {          
        res.cookie('slackToken', resAxios.data.access_token);
        res.end();
       // slackToken = resAxios.data.access_token;
        // res.send(resAxios.data.access_token);
    }).catch(function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            res.send(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            res.send(error.request)
        } else {
            // Something happened in setting up the request that triggered an Error
            res.send(error.message);
        }
    });
});

// https://api.slack.com/methods/search.messages
// get messages with @here
// app.get('/here', (req, res) => {
//     var str = process.env.SLACK_BASE + process.env.SLACK_SEARCH_MSG 
//     + '?token=' + slackToken
//     + '&count=1'
//     + '&query=@here'
//     + '&highlights=true';

//     axios.get(
//         encodeURI(str)    
//     ).then(result => {
//         var response = {
//             channel: result.data.messages.matches[0].channel.name,
//             message: result.data.messages.matches[0].text,
//         };
//         res.json(response);
//     });
// })


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
// reunioes = CDBK2EPMW
// devops = CDBPLUGHE

// https://api.slack.com/methods/channels.history
// get messages from channel 'general'
// app.get('/channel', (req, res) => {
//     var str = process.env.SLACK_BASE + process.env.SLACK_CHANNEL_MSG
//     + '?token=' + slackToken
//     + '&channel=CCAB2Q0P7'
//     + '&count=3'

//     axios.get(
//         encodeURI(str)    
//     ).then(result => {        
//         res.json(result.data.messages);        
//     });
// });

app.get('/slack/token', (req, res) => {
    let data = querystring.stringify({
        client_id: encodeURI(process.env.SLACK_CLIENT_ID),
        client_secret: encodeURI(process.env.SLACK_CLIENT_SECRET),
        code: encodeURI(req.query.code),
    });

    axios.post(process.env.SLACK_AUTH_ACCESS, data, {
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
    }).then(resAxios => {
        var token = resAxios.data.access_token;

        if (resAxios.data.access_token !== undefined) {
            res.cookie('slackToken', token);
            // res.send("slack cookie set");
            res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <script>
                        window.close();    
                    </script>
                </head>
                <body></body>
                </html>
            `);
        } else {
            res.send(resAxios.data);
        }
    //    slackToken = resAxios.data.access_token;
    //     res.send(resAxios.data.access_token);
    }).catch(function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            res.send(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            res.send(error.request)
        } else {
            // Something happened in setting up the request that triggered an Error
            res.send(error.message);
        }
    });
});

app.get('/spotify/token', (req, res) => {
    var data = {
        code: req.query.code,
        redirect_uri: 'http://barbatheus.dashboard.com:4392/spotify/token',
        grant_type: 'authorization_code',
    };
    
    var postConfig = {
        url: 'https://accounts.spotify.com/api/token',
        method: 'post',
        data: querystring.stringify(data),
        headers: {
            'Authorization': 'Basic '
                + (new Buffer(
                    process.env.SPOTIFY_CLIENT_ID + ':'
                    + process.env.SPOTIFY_CLIENT_SECRET
                ).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    axios(postConfig)
        .then(resAxios => {
            var token = resAxios.data.access_token;

            if (resAxios.data.access_token !== undefined) {
                res.cookie('spotifyToken', token);
                // res.send("spotify cookie set");
                res.send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <script>
                            window.close();    
                        </script>
                    </head>
                    <body>
                    </body>
                    </html>
                `);
            } else {
                res.send(resAxios.data);
            }

            // var token = resAxios.data.access_token;
            // res.cookie('spotifyToken', token);
            // console.log(req.cookies);
            // res.send('cookie set?!');
        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                res.send(error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                res.send(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                res.send( error.message);
            }
            res.send(error.config);
        });
});

app.get("/sinteg/ldr", (req, res) => {
    var request = {
        method: 'get',
        url: 'http://raspdock.duckdns.org:8123/api/states/sensor.ldr'
    };

    axios(request).then(resAxios => {
        res.send(resAxios.data);
    }).catch(error => {
        res.send(error.message);
    });
});

app.get("/sinteg/temperature", (req, res) => {
    var request = {
        method: 'get',
        url: 'http://raspdock.duckdns.org:8123/api/states/sensor.temperature'
    };

    axios(request).then(resAxios => {
        res.send(resAxios.data);
    }).catch(error => {
        res.send(error.message);
    });
});

app.get("/sinteg/humidity", (req, res) => {
    var request = {
        method: 'get',
        url: 'http://raspdock.duckdns.org:8123/api/states/sensor.humidity'
    };

    axios(request).then(resAxios => {
        res.send(resAxios.data);
    }).catch(error => {
        res.send(error.message);
    });
});

app.get("/sinteg/reedswitch", (req, res) => {
    var request = {
        method: 'get',
        url: 'http://raspdock.duckdns.org:8123/api/states/sensor.reed_switch'
    };

    axios(request).then(resAxios => {
        res.send(resAxios.data);
    }).catch(error => { 
        res.send(error.message);
    });
});

// app.get('/spotify/auth', (req, res) => {
//     var scopes = ["streaming", "user-read-birthdate", "user-read-email", "user-read-private"];
//     res.redirect(
//         'https://accounts.spotify.com/authorize' 
//         + '?response_type=code' 
//         + '&client_id=' + 'b35dda2c6d8844eb9ca34c7b405ef4d5'
//         + (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
//         '&redirect_uri=' + encodeURIComponent('http://localhost:4392/spotify/token')
//     );
// });
