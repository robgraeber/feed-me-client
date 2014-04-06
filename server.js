var express = require('express');
var partials= require('express-partials');
var path    = require('path');
var fs      = require('fs');
var env     = require('./config')['env'];

// GLOBAL VARIABLES
var server  = express();
var today   = (new Date()).toISOString().replace(/T/, ' ').replace(/\..+/,'');
var dstatic = path.join(__dirname, 'public');
var ficon   = path.join(__dirname,'public/assets/favicon.ico');
var flogname= path.join(__dirname,'server.log');
var dviews  = path.join(__dirname, 'views');
var flog    = fs.createWriteStream(flogname, {flags: 'a'}); 


// BANNER
console.log('---------------------------------------------------------');
console.log('| FeedMe  | Front-End Web-Server |', today,' |');
console.log('---------------------------------------------------------');
console.log('| Listen  |', env.feuri ,'                                  |');
console.log('| Port    |', env.feport,'                                       |');
console.log('| Statics |', dstatic   ,'    |');
console.log('| Views   |', dviews, '     |');
console.log('| Logging |', flogname  ,'|');
console.log('---------------------------------------------------------');

// CONFIG: SERVER
server.listen(env.feport);
server.set('port' , env.feport);
server.set('views', dviews);                        // set path to views
server.set('view engine', 'ejs');                   // set view engine to ejs
server.use(express.logger({'stream': flog }));      // set up logger
server.use(partials());                             // load partials' middleware
server.use(express.favicon(ficon));                 // default favicon
// express.bodyParser includes .json(), .urlencoded(), .multipart()
server.use(express.json());                         // accepts json
server.use(express.urlencoded());                   // accepts encoded url
server.use(express.static(dstatic));                // directory of statics
server.use(express.cookieParser(env.cookie));       // set up cookie
server.use(express.session({'secret':env.session}));// set up session

// CONFIG: DEV-SPECIFIC
if(env.env === 'development') server.use(express.errorHandler());

// ROUTING 
server.get('/', function(req, res){
  res.render('index.ejs', {} ); // .render(view , [options ,] callback)
});
