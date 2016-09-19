
//get current folder as root
global.BASE_PATH = __dirname;

var express = require('express');
//run the factory
var app = express();
var bodyParser = require('body-parser');
//get connection, set into global so all the controllers would be able to use it
GLOBAL.con = require('./modules/db.js');
var session = require('express-session');



// expose the static content folder
app.use(express.static('public'));
//expose the users uploads folders
app.use(express.static('.tmp/uploads'));
// this middleware parse a json string into object and populate it into  req.body
app.use(bodyParser.json());
// this middleware Parse Cookie header and populate req.cookies with an object keyed by the cookie names.


// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(session({
    secret: 'A secret key [super private!]',
    resave: false, //do not save the session if user did not make changed
    saveUninitialized: false //do not save session on Uninitialized
}));

//any url that starts with '/auth' should been managed by this controller
// for example: '/auth/login','/auth/register'
var auth = require('./modules/controllers/auth');
app.use('/auth', auth);

//this controller handle chat
var chat = require('./modules/controllers/chat');
app.use('/chat', chat);
// var ws = require('./modules/controllers/ws');
var exports = module.exports;
//start listening to network
var appPort = 8080;
var http = require('http'),
    //create server with express() as app
    server = http.createServer(app),
    //make the socket io listen to that server
    io = require('socket.io').listen(server),
//this controller handle the server side socket.io functions - passed on the io connection as a param.
    ws = require('./modules/controllers/ws')(io);
//now it's about time to activate this whole server package on the selected port
server.listen(appPort);
// app.listen(appPort);

console.log("Server listening on port " + appPort);


app.get('/', function (req, res) {
    //console.log(req.session.userData);
    //console.log(req.body);
    if (req.session.userData != undefined) {
        if (req.session.userData.rememberMe == true){
        console.log('hey we remember you!');
        console.log(req.session.userData);
        res.render(BASE_PATH + '/views/pages/chat.ejs');
    }else{
            //console.log(req.session.userData);
            res.render(BASE_PATH + '/views/pages/index.ejs');

        }
    } else {
        console.log(req.session.userData);
        res.render(BASE_PATH + '/views/pages/index.ejs');
    }

    });


