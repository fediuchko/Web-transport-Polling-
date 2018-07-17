var express = require('express')
var app = express()
var http =  require ('http').Server(app);
var bodyParser = require('body-parser');
  

var messages = getArrayWithLimitedLength(100);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req,res) {
    res.sendFile(__dirname + '/index.html');
 
});

app.get('/client.js', function(req,res) {
    res.sendFile(__dirname + '/client.js');
});

app.get('/messages', function(req,res) {
    res.json(messages);
});

app.post('/messages', function(req,res) {
    messages.push(req.body);
});

http.listen(5000, function(){
    console.log('listening on :5000')
});

function getArrayWithLimitedLength(length) {
    var array = new Array();

    array.push = function () {
        if (this.length >= length) {
            this.shift();
        }
        return Array.prototype.push.apply(this,arguments);
    }

    return array;

}

