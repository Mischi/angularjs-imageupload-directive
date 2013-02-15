var express = require('express');
var http    = require('http');
var path    = require('path');
var fs      = require('fs');


var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 8080);
    app.use(express.bodyParser());
    app.use(express.static(path.join(__dirname, 'public')));    
});


app.get('/', function(req, res){
    res.sendfile(__dirname + '/demo.html');
});

app.post('/upload', function(req, res) {
    var image =  req.files.image;
    var newImageLocation = path.join(__dirname, 'public/images', image.name);
    
    fs.readFile(image.path, function(err, data) {
        fs.writeFile(newImageLocation, data, function(err) {
            res.json(200, { 
                src: 'images/' + image.name,
                size: image.size
            });
        });
    });
});

http.createServer(app).listen(app.get('port'), function() {
    console.log("imageupload demo running on port " + app.get('port'));
});